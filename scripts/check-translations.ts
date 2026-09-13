/**
 * Translation audit — run with `npm run i18n:check` (also part of `npm run build`).
 *
 * Fails when a language is missing a key, has an empty string, uses different
 * {placeholders}, or mixes scripts: Latin text inside Tajik/Russian copy, Cyrillic
 * inside English copy, Russian-only letters (щ ц ы ь) inside Tajik copy, or
 * Tajik-only letters (ғ ӣ қ ӯ ҳ ҷ) inside Russian copy.
 */
import { translations, type Language } from '../src/data/translations.ts';

type Node = string | readonly Node[] | { readonly [key: string]: Node };

const LANGS: Language[] = ['tj', 'ru', 'en'];
const REFERENCE: Language = 'en';

/** Brand and product names that legitimately stay in Latin script in every language. */
const LATIN_ALLOWED = /Google|Instagram|Plus Code|TJS|HQ44\+GV|@yakkachinar\.tj|Yakkachinar/g;
/** Strings that may be identical between languages. */
const SAME_ALLOWED = new Set(['Instagram', 'Plus Code', 'Душанбе']);

const LATIN = /[A-Za-z]/;
const CYRILLIC = /[Ѐ-ӿ]/;
const TAJIK_ONLY = /[ҒғӢӣҚқӮӯҲҳҶҷ]/;
const RUSSIAN_ONLY = /[ЩщЦцЫыЬь]/;

const errors: string[] = [];
const warnings: string[] = [];

function kind(node: Node | undefined): string {
  if (node === undefined) return 'missing';
  if (typeof node === 'string') return 'string';
  return Array.isArray(node) ? 'array' : 'object';
}

function placeholders(text: string): string {
  return [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
}

function checkString(lang: Language, path: string, text: string, reference: string) {
  if (!text.trim()) errors.push(`[${lang}] ${path}: empty string`);
  if (placeholders(text) !== placeholders(reference)) {
    errors.push(`[${lang}] ${path}: placeholders {${placeholders(text)}} differ from ${REFERENCE} {${placeholders(reference)}}`);
  }
  // Placeholder names like {count} are code, not copy.
  const copy = text.replace(/\{\w+\}/g, '');
  if (lang === 'en') {
    if (CYRILLIC.test(copy)) errors.push(`[en] ${path}: Cyrillic text in English copy → "${text}"`);
    return;
  }
  const withoutBrands = copy.replace(LATIN_ALLOWED, '');
  if (LATIN.test(withoutBrands)) errors.push(`[${lang}] ${path}: Latin letters in ${lang} copy → "${text}"`);
  if (lang === 'tj' && RUSSIAN_ONLY.test(text)) errors.push(`[tj] ${path}: Russian-only letter in Tajik copy → "${text}"`);
  if (lang === 'ru' && TAJIK_ONLY.test(text)) errors.push(`[ru] ${path}: Tajik-only letter in Russian copy → "${text}"`);
}

function walk(path: string, nodes: Record<Language, Node | undefined>) {
  const reference = nodes[REFERENCE];
  const referenceKind = kind(reference);

  for (const lang of LANGS) {
    const node = nodes[lang];
    if (kind(node) !== referenceKind) {
      errors.push(`[${lang}] ${path || '(root)'}: expected ${referenceKind}, found ${kind(node)}`);
    }
  }
  if (referenceKind === 'string') {
    for (const lang of LANGS) {
      const node = nodes[lang];
      if (typeof node === 'string') checkString(lang, path, node, reference as string);
    }
    const [tj, ru, en] = LANGS.map((lang) => nodes[lang]);
    const pairs: [string, unknown, unknown][] = [['tj=ru', tj, ru], ['ru=en', ru, en], ['tj=en', tj, en]];
    for (const [label, a, b] of pairs) {
      if (typeof a === 'string' && a === b && !SAME_ALLOWED.has(a)) warnings.push(`${path}: identical text (${label}) → "${a}"`);
    }
    return;
  }
  if (referenceKind === 'array') {
    for (const lang of LANGS) {
      const node = nodes[lang];
      if (Array.isArray(node)) {
        if (node.length === 0) errors.push(`[${lang}] ${path}: empty list`);
        node.forEach((item, index) => {
          if (typeof item === 'string') checkString(lang, `${path}[${index}]`, item, (reference as readonly string[])[0] ?? '');
          else errors.push(`[${lang}] ${path}[${index}]: expected string`);
        });
      }
    }
    return;
  }
  if (referenceKind === 'object') {
    const keys = new Set<string>();
    for (const lang of LANGS) {
      const node = nodes[lang];
      if (node && typeof node === 'object' && !Array.isArray(node)) Object.keys(node).forEach((key) => keys.add(key));
    }
    for (const key of keys) {
      const child = {} as Record<Language, Node | undefined>;
      for (const lang of LANGS) {
        const node = nodes[lang] as { readonly [key: string]: Node } | undefined;
        child[lang] = node && typeof node === 'object' && !Array.isArray(node) ? node[key] : undefined;
      }
      walk(path ? `${path}.${key}` : key, child);
    }
  }
}

walk('', translations as unknown as Record<Language, Node>);

for (const warning of warnings) console.warn(`  warn  ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`  error ${error}`);
  console.error(`\nTranslation audit failed: ${errors.length} error(s), ${warnings.length} warning(s).`);
  process.exit(1);
}
console.log(`Translation audit passed for ${LANGS.join(', ')} (${warnings.length} warning(s)).`);
