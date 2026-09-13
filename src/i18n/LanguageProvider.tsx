import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { LANGUAGES, translations, type Language, type LanguageMeta, type Translation } from '../data/translations';
import { mapStrings, typeset } from './format';
import { scrollByImmediate } from '../lib/scroll';
import { prefersReducedMotion } from '../lib/motion';

const STORAGE_KEY = 'yakkachinar:lang';
const FADE_OUT_MS = 200;
const FADE_IN_MS = 600;

interface I18nValue {
  lang: Language;
  meta: LanguageMeta;
  t: Translation;
  setLang: (next: Language) => void;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function isLanguage(value: unknown): value is Language {
  return LANGUAGES.some((item) => item.code === value);
}

function detectInitialLanguage(): Language {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (isLanguage(fromUrl)) return fromUrl;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(stored)) return stored;
  } catch {
    // Storage can be unavailable (private mode, blocked site data).
  }
  for (const tag of navigator.languages?.length ? navigator.languages : [navigator.language]) {
    const code = tag.toLowerCase();
    if (code.startsWith('tg')) return 'tj';
    if (/^(ru|uk|be|kk|ky|uz)\b/.test(code)) return 'ru';
    if (code.startsWith('en')) return 'en';
  }
  return 'tj';
}

const prepared = new Map<Language, Translation>();

/**
 * Typeset every string once per language. An empty string never silently falls back to
 * another language: it renders as a visible ⟦lang:path⟧ marker and is logged.
 */
function getTranslation(lang: Language): Translation {
  let value = prepared.get(lang);
  if (!value) {
    value = mapStrings(translations[lang], (text, path) => {
      if (!text.trim()) {
        console.error(`[i18n] Missing "${lang}" translation at "${path}"`);
        return `⟦${lang}:${path}⟧`;
      }
      return typeset(text);
    });
    prepared.set(lang, value);
  }
  return value;
}

/**
 * The text block closest to the reader's eye line (35% down the viewport). Its position is
 * restored after the language changes, so longer Tajik or Russian copy never moves what is being read.
 */
function findReadingAnchor(): { element: Element; top: number } | null {
  const eyeLine = window.innerHeight * 0.35;
  let best: { element: Element; top: number } | null = null;
  let bestDistance = Infinity;
  for (const element of document.querySelectorAll('main h2, main h3, main p, main figure, footer p')) {
    const rect = element.getBoundingClientRect();
    if (rect.height === 0 || rect.bottom < 0 || rect.top > window.innerHeight) continue;
    const distance = Math.abs(rect.top - eyeLine);
    if (distance < bestDistance) {
      best = { element, top: rect.top };
      bestDistance = distance;
    }
  }
  return best;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(detectInitialLanguage);
  const langRef = useRef(lang);
  const anchorRef = useRef<{ element: Element; top: number } | null>(null);
  const timers = useRef<number[]>([]);
  const userChangedRef = useRef(false);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const setLang = useCallback((next: Language) => {
    if (next === langRef.current) return;
    langRef.current = next;
    userChangedRef.current = true;
    clearTimers();
    const root = document.documentElement;
    const commit = () => {
      anchorRef.current = findReadingAnchor();
      setLangState(next);
    };
    if (prefersReducedMotion()) {
      commit();
      return;
    }
    root.dataset.langSwitch = 'out';
    timers.current.push(window.setTimeout(commit, FADE_OUT_MS));
  }, []);

  const t = getTranslation(lang);
  const meta = LANGUAGES.find((item) => item.code === lang) ?? LANGUAGES[0];

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.lang = meta.htmlLang;
    root.dataset.lang = lang;
    document.title = translations[lang].meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', translations[lang].meta.description);

    if (userChangedRef.current) {
      try {
        window.localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // Ignore unavailable storage.
      }
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState(window.history.state, '', url);
    }

    const anchor = anchorRef.current;
    anchorRef.current = null;
    if (anchor && anchor.element.isConnected) {
      scrollByImmediate(anchor.element.getBoundingClientRect().top - anchor.top);
    }

    if (root.dataset.langSwitch === 'out') {
      requestAnimationFrame(() => {
        root.dataset.langSwitch = 'in';
        timers.current.push(window.setTimeout(() => delete root.dataset.langSwitch, FADE_IN_MS));
      });
    }
  }, [lang, meta.htmlLang]);

  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) => new Intl.NumberFormat(meta.numberLocale, options).format(value),
    [meta.numberLocale],
  );

  const value = useMemo<I18nValue>(() => ({ lang, meta, t, setLang, formatNumber }), [lang, meta, t, setLang, formatNumber]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside <LanguageProvider>');
  return value;
}
