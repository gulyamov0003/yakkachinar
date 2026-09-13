import { useState, type MouseEvent } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useI18n } from '../i18n/LanguageProvider';
import { useUI } from '../context/UIContext';
import { useActiveSection } from '../hooks/useActiveSection';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { NAV_ITEMS } from '../data/navigation';
import type { NavKey } from '../data/translations';
import { scrollToSection } from '../lib/scroll';
import { EASE_OUT } from '../lib/motion';
import { LanguageSwitcher } from './LanguageSwitcher';
import { PremiumButton } from './PremiumButton';
import { BrandLogo } from './BrandLogo';
import { MenuIcon } from './Icons';
import { MobileMenu } from './MobileMenu';
import './Navbar.css';

export function Navbar() {
  const { t } = useI18n();
  const { openReservation, menuOpen, setMenuOpen, introReady } = useUI();
  const active = useActiveSection('overview');
  const reduceMotion = useReducedMotion();
  const compact = useMediaQuery('(max-width: 767px)');
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(() => window.scrollY > 24);

  useMotionValueEvent(scrollY, 'change', (value) => {
    const next = value > 24;
    setScrolled((current) => (current === next ? current : next));
  });

  const handleNav = (event: MouseEvent<HTMLAnchorElement>, key: NavKey) => {
    event.preventDefault();
    scrollToSection(key);
    window.history.replaceState(window.history.state, '', `${window.location.search}#${key}`);
  };

  return (
    <>
      <motion.header
        className={`nav${scrolled ? ' nav--scrolled' : ''}`}
        initial={reduceMotion ? false : { opacity: 0, y: -16 }}
        animate={introReady ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1.2, ease: EASE_OUT, delay: compact ? 0.9 : 1.3 }}
      >
        <div className="nav__bar container">
          <a href="#overview" className="nav__brand sheen-on-hover" aria-label={t.a11y.homeLink} onClick={(event) => handleNav(event, 'overview')}>
            <BrandLogo className="nav__logo" sizes="44px" eager />
            <span className="nav__wordmark" aria-hidden="true">
              Yakkachinar
            </span>
          </a>

          <nav className="nav__links" aria-label={t.a11y.mainNavigation}>
            <ul>
              {NAV_ITEMS.map((key) => (
                <li key={key}>
                  <a
                    href={`#${key}`}
                    className={`nav__link${active === key ? ' is-active' : ''}`}
                    aria-current={active === key ? 'true' : undefined}
                    onClick={(event) => handleNav(event, key)}
                  >
                    <span className="t-fade">{t.nav[key]}</span>
                    {active === key ? (
                      <motion.span layoutId="nav-active" className="nav__active" transition={{ duration: 0.7, ease: EASE_OUT }} />
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav__actions">
            <LanguageSwitcher id="nav" className="nav__lang" />
            <PremiumButton size="sm" variant="outline" className="nav__reserve" onClick={openReservation} hasPopup>
              {t.actions.reserveShort}
            </PremiumButton>
            <button
              type="button"
              className="nav__toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={t.a11y.openMenu}
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon size={28} />
            </button>
          </div>
        </div>
      </motion.header>
      <MobileMenu />
    </>
  );
}
