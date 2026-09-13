import { motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useI18n } from '../i18n/LanguageProvider';
import { useUI } from '../context/UIContext';
import { restaurant } from '../data/restaurant';
import { EASE_OUT } from '../lib/motion';
import { Modal } from './Modal';
import { PremiumButton } from './PremiumButton';
import { BrandLogo } from './BrandLogo';
import { CloseIcon } from './Icons';
import './ReservationDialog.css';

/** Reservations happen by phone — no invented booking system. */
export function ReservationDialog() {
  const { t } = useI18n();
  const { reservationOpen, closeReservation } = useUI();
  const reduceMotion = useReducedMotion();

  return (
    <Modal open={reservationOpen} onClose={closeReservation} labelledBy="reservation-title">
      <motion.div
        className="reserve-panel"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 36, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
      >
        <button type="button" className="modal-close reserve-panel__close" onClick={closeReservation} aria-label={t.a11y.close} data-autofocus>
          <CloseIcon />
        </button>

        <BrandLogo className="reserve-panel__logo is-shining" sizes="80px" />
        <p className="eyebrow reserve-panel__eyebrow">{t.reservation.eyebrow}</p>
        <h2 id="reservation-title" className="reserve-panel__title display">
          {t.reservationDialog.title}
        </h2>
        <p className="reserve-panel__text">{t.reservationDialog.text}</p>

        <div className="reserve-panel__phone">
          <p className="reserve-panel__caption">{t.reservationDialog.phoneCaption}</p>
          <p className="reserve-panel__number">{restaurant.phone.display}</p>
        </div>

        <PremiumButton href={restaurant.phone.href} leadingIcon="phone" size="lg" className="reserve-panel__call">
          {t.actions.call}
        </PremiumButton>

        <div className="reserve-panel__plan">
          <p className="reserve-panel__caption">{t.reservationDialog.planTitle}</p>
          <div className="reserve-panel__links">
            <PremiumButton href={restaurant.maps.directionsUrl} external variant="outline" leadingIcon="navigation" icon="external">
              {t.actions.directions}
            </PremiumButton>
            <PremiumButton href={restaurant.instagram.url} external variant="outline" leadingIcon="instagram" icon="external">
              {t.actions.visitInstagram}
            </PremiumButton>
          </div>
        </div>
      </motion.div>
    </Modal>
  );
}
