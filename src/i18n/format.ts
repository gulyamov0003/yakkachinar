/** Fill `{placeholders}` in a translated template. Unknown placeholders are left visible on purpose. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

const SHORT_WORD = /(^|[\s(«„"'—–])([A-Za-zА-Яа-яЁёҒғӢӣҚқӮӯҲҳҶҷ]{1,2})\s+(?=\S)/g;

/**
 * Editorial typesetting shared by all three languages:
 * one- and two-letter words stay with the next word, a dash never starts a line,
 * and numbers stay attached to their units.
 */
export function typeset(text: string): string {
  let out = text;
  // Two passes bind chains of short words such as "и в" or "a to".
  for (let pass = 0; pass < 2; pass += 1) {
    out = out.replace(SHORT_WORD, (_match, lead: string, word: string) => `${lead}${word} `);
  }
  return out
    .replace(/\s+—/g, ' —')
    .replace(/(\d)\s+(?=[^\s\d+])/g, '$1 ')
    .replace(/\}\s+/g, '} ');
}

/** Deeply map every string of a translation tree, keeping its shape and type. */
export function mapStrings<T>(value: T, fn: (text: string, path: string) => string, path = ''): T {
  if (typeof value === 'string') return fn(value, path) as T;
  if (Array.isArray(value)) return value.map((item, index) => mapStrings(item, fn, `${path}[${index}]`)) as T;
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value)) {
      out[key] = mapStrings(child, fn, path ? `${path}.${key}` : key);
    }
    return out as T;
  }
  return value;
}
