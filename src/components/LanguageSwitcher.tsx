import { motion } from 'motion/react';
import { LANGUAGES } from '../data/translations';
import { useI18n } from '../i18n/LanguageProvider';
import { EASE_OUT } from '../lib/motion';
import './LanguageSwitcher.css';

interface LanguageSwitcherProps {
  /** Unique per instance so each switcher animates its own indicator. */
  id: string;
  variant?: 'compact' | 'full';
  className?: string;
}

export function LanguageSwitcher({ id, variant = 'compact', className = '' }: LanguageSwitcherProps) {
  const { lang, setLang, t } = useI18n();

  return (
    <div role="group" aria-label={t.a11y.languageSwitcher} className={`lang lang--${variant} ${className}`}>
      {LANGUAGES.map((item) => {
        const active = item.code === lang;
        return (
          <button
            key={item.code}
            type="button"
            lang={item.htmlLang}
            className={`lang__option${active ? ' is-active' : ''}`}
            aria-pressed={active}
            onClick={() => setLang(item.code)}
            data-cursor="magnetic"
          >
            {active ? (
              <motion.span
                layoutId={`lang-indicator-${id}`}
                className="lang__indicator"
                transition={{ duration: 0.6, ease: EASE_OUT }}
              />
            ) : null}
            {variant === 'compact' ? (
              <>
                <span className="lang__text" aria-hidden="true">
                  {item.short}
                </span>
                <span className="sr-only">
                  {item.short} {item.native}
                </span>
              </>
            ) : (
              <span className="lang__text">{item.native}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
