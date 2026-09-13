import { useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useI18n } from '../i18n/LanguageProvider';
import { useUI } from '../context/UIContext';
import { restaurant } from '../data/restaurant';
import { EASE_OUT } from '../lib/motion';
import { ArrowRight, PhoneIcon } from './Icons';
import './MobileActionBar.css';

/** Sticky reservation bar for phones, shown once the visitor has scrolled past the hero. */
export function MobileActionBar() {
  const { t } = useI18n();
  const { openReservation, menuOpen, reservationOpen } = useUI();
  const { scrollY } = useScroll();
  const [pastHero, setPastHero] = useState(false);

  useMotionValueEvent(scrollY, 'change', (value) => {
    const next = value > window.innerHeight * 0.85;
    setPastHero((current) => (current === next ? current : next));
  });

  const shown = pastHero && !menuOpen && !reservationOpen;

  return (
    <motion.div
      className="action-bar"
      initial={false}
      animate={shown ? { y: 0, opacity: 1 } : { y: '140%', opacity: 0 }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
      aria-hidden={!shown}
      inert={!shown}
    >
      <a className="action-bar__call" href={restaurant.phone.href} aria-label={`${t.actions.callShort} ${restaurant.phone.display}`}>
        <PhoneIcon />
        <span className="action-bar__call-label">{t.actions.callShort}</span>
      </a>
      <button type="button" className="action-bar__reserve" onClick={openReservation} aria-haspopup="dialog">
        <span className="t-fade">{t.actions.reserveShort}</span>
        <ArrowRight size={10} />
      </button>
    </motion.div>
  );
}
