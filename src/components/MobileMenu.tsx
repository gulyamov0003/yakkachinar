import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useIsPresent } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useI18n } from '../i18n/LanguageProvider';
import { useUI } from '../context/UIContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { NAV_ITEMS } from '../data/navigation';
import { restaurant } from '../data/restaurant';
import type { NavKey } from '../data/translations';
import { lockBackground, lockScroll, scrollToSection, unlockBackground, unlockScroll } from '../lib/scroll';
import { EASE_IN_OUT, EASE_OUT } from '../lib/motion';
import { LanguageSwitcher } from './LanguageSwitcher';
import { PremiumButton } from './PremiumButton';
import { BrandLogo } from './BrandLogo';
import { CloseIcon, InstagramIcon, PhoneIcon } from './Icons';
import './MobileMenu.css';

export function MobileMenu() {
  const { menuOpen } = useUI();
  return createPortal(<AnimatePresence>{menuOpen ? <MenuLayer key="mobile-menu" /> : null}</AnimatePresence>, document.body);
}

const FOCUSABLE = 'a[href], button:not([disabled])';

function MenuLayer() {
  const { t } = useI18n();
  const { setMenuOpen, openReservation } = useUI();
  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1280px)');
  const isPresent = useIsPresent();
  const panelRef = useRef<HTMLDivElement>(null);
  const pendingTarget = useRef<NavKey | null>(null);
  const released = useRef(false);
  // Captured once per opening during render, so StrictMode's effect replay can't record the menu itself.
  const [previousFocus] = useState(() => (document.activeElement instanceof HTMLElement ? document.activeElement : null));

  const close = useCallback(() => setMenuOpen(false), [setMenuOpen]);

  useEffect(() => {
    if (isDesktop) close();
  }, [isDesktop, close]);

  /** Hand the page back as soon as the menu starts closing, then follow the chosen link or restore focus. */
  const release = useCallback(() => {
    if (released.current) return;
    released.current = true;
    unlockBackground();
    unlockScroll();
    const target = pendingTarget.current;
    if (target) {
      scrollToSection(target);
      return;
    }
    const current = document.activeElement;
    const focusWasInside = !current || current === document.body || Boolean(panelRef.current?.contains(current));
    if (previousFocus?.isConnected && focusWasInside) previousFocus.focus({ preventScroll: true });
  }, [previousFocus]);

  useEffect(() => {
    released.current = false;
    const panel = panelRef.current;
    lockScroll();
    lockBackground();
    panel?.querySelector<HTMLElement>('[data-autofocus]')?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (released.current || !panel) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      release();
    };
  }, [close, release]);

  useEffect(() => {
    if (!isPresent) release();
  }, [isPresent, release]);

  const go = (key: NavKey) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    pendingTarget.current = key;
    close();
  };

  const clip = (radius: string) => `circle(${radius} at 100% 0%)`;

  return (
    <motion.div
      ref={panelRef}
      id="mobile-menu"
      className="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={t.a11y.mainNavigation}
      data-lenis-prevent
      style={isPresent ? undefined : { pointerEvents: 'none' }}
      initial={reduceMotion ? { opacity: 0 } : { clipPath: clip('0%') }}
      animate={reduceMotion ? { opacity: 1 } : { clipPath: clip('150%') }}
      exit={reduceMotion ? { opacity: 0 } : { clipPath: clip('0%') }}
      transition={{ duration: 0.85, ease: EASE_IN_OUT }}
    >
      <BrandLogo className="mobile-menu__watermark" sizes="(min-width: 640px) 544px, 92vw" />

      <div className="mobile-menu__top container">
        <a href="#overview" className="nav__brand sheen-on-hover" aria-label={t.a11y.homeLink} onClick={go('overview')}>
          <BrandLogo className="nav__logo" sizes="44px" />
          <span className="nav__wordmark" aria-hidden="true">
            Yakkachinar
          </span>
        </a>
        <button type="button" className="modal-close" onClick={close} aria-label={t.a11y.closeMenu} data-autofocus>
          <CloseIcon />
        </button>
      </div>

      <nav className="mobile-menu__nav container" aria-label={t.a11y.mainNavigation}>
        <ol>
          {NAV_ITEMS.map((key, index) => (
            <motion.li
              key={key}
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.28 + index * 0.05 }}
            >
              <a href={`#${key}`} className="mobile-menu__link" onClick={go(key)}>
                <span className="mobile-menu__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{t.nav[key]}</span>
              </a>
            </motion.li>
          ))}
        </ol>
      </nav>

      <motion.div
        className="mobile-menu__footer container"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.6 }}
      >
        <LanguageSwitcher id="mobile" variant="full" />
        <div className="mobile-menu__contact">
          <a href={restaurant.phone.href} className="mobile-menu__contact-link">
            <PhoneIcon />
            <span>{restaurant.phone.display}</span>
          </a>
          <a href={restaurant.instagram.url} className="mobile-menu__contact-link" target="_blank" rel="noopener noreferrer">
            <InstagramIcon />
            <span>{restaurant.instagram.handle}</span>
            <span className="sr-only"> ({t.a11y.newTab})</span>
          </a>
        </div>
        <PremiumButton className="mobile-menu__reserve" leadingIcon="calendar" onClick={openReservation} hasPopup>
          {t.actions.reserve}
        </PremiumButton>
      </motion.div>
    </motion.div>
  );
}
