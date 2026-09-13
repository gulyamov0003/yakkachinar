import { useState, type MouseEvent } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useI18n } from '../i18n/LanguageProvider';
import { format } from '../i18n/format';
import { restaurant } from '../data/restaurant';
import { NAV_ITEMS } from '../data/navigation';
import type { NavKey } from '../data/translations';
import { scrollToSection } from '../lib/scroll';
import { EASE_OUT } from '../lib/motion';
import { BrandLogo } from '../components/BrandLogo';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { ArrowUpRight, InstagramIcon, MapPinIcon, PhoneIcon } from '../components/Icons';
import './Footer.css';

export function Footer() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [logoShine, setLogoShine] = useState(false);
  const year = new Date().getFullYear();

  const go = (key: NavKey) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSection(key);
  };

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <p className="footer__wordmark" aria-hidden="true">
            Yakkachinar
          </p>
          <div className="footer__signature">
            <motion.div
              className="footer__logo-wrap"
              initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.3, ease: EASE_OUT }}
              onViewportEnter={() => setLogoShine(true)}
            >
              <BrandLogo
                className={`footer__logo${logoShine && !reduceMotion ? ' is-shining' : ''}`}
                sizes="(min-width: 768px) 112px, 88px"
                alt={t.a11y.logoAlt}
              />
            </motion.div>
            <div>
              <p className="footer__tagline">{t.footer.tagline}</p>
              <p className="footer__place">{t.hero.eyebrow}</p>
            </div>
          </div>
        </div>

        <div className="footer__grid">
          <nav className="footer__col" aria-label={t.footer.navTitle}>
            <p className="footer__title">{t.footer.navTitle}</p>
            <ul className="footer__list footer__list--nav">
              {NAV_ITEMS.map((key) => (
                <li key={key}>
                  <a href={`#${key}`} className="footer__link" onClick={go(key)}>
                    {t.nav[key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__col">
            <p className="footer__title">{t.footer.contactTitle}</p>
            <ul className="footer__list">
              <li>
                <a className="footer__link footer__link--icon" href={restaurant.phone.href}>
                  <PhoneIcon size={16} />
                  <span className="footer__nowrap">{restaurant.phone.display}</span>
                </a>
              </li>
              <li>
                <a className="footer__link footer__link--icon" href={restaurant.maps.directionsUrl} target="_blank" rel="noopener noreferrer">
                  <MapPinIcon size={16} />
                  <span>
                    {t.location.city}, {t.location.country} · {restaurant.plusCode}
                  </span>
                  <span className="sr-only"> ({t.a11y.newTab})</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <p className="footer__title">{t.footer.followTitle}</p>
            <ul className="footer__list">
              <li>
                <a className="footer__link footer__link--icon" href={restaurant.instagram.url} target="_blank" rel="noopener noreferrer">
                  <InstagramIcon size={16} />
                  <span>{restaurant.instagram.handle}</span>
                  <ArrowUpRight size={14} />
                  <span className="sr-only"> ({t.a11y.newTab})</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <p className="footer__title">{t.footer.languageTitle}</p>
            <LanguageSwitcher id="footer" variant="full" />
          </div>
        </div>

        <div className="footer__bottom">
          <p>{format(t.footer.rights, { year })}</p>
          <button type="button" className="footer__top" onClick={() => scrollToSection('overview')}>
            <span>{t.a11y.backToTop}</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
