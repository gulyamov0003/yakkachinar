import { useRef, type PointerEvent } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useI18n } from '../i18n/LanguageProvider';
import { useUI } from '../context/UIContext';
import { restaurant } from '../data/restaurant';
import { images } from '../data/images';
import { Picture } from '../components/Picture';
import { PremiumButton } from '../components/PremiumButton';
import { Reveal, RevealLines } from '../components/Reveal';
import './ReservationCTA.css';

const TILT_SPRING = { stiffness: 60, damping: 18, mass: 0.8 };

/** Closing scene: slow photographic zoom, a gold frame floating in depth, and the reservation call. */
export function ReservationCTA() {
  const { t } = useI18n();
  const { openReservation } = useUI();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.28, 1.02]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-1, 1], [3.5, -3.5]), TILT_SPRING);
  const rotateY = useSpring(useTransform(pointerX, [-1, 1], [-4.5, 4.5]), TILT_SPRING);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };
  const onPointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      id="reserve"
      data-nav="location"
      className="cta"
      aria-labelledby="cta-title"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <motion.div className="cta__background" style={reduceMotion ? undefined : { scale: backgroundScale, y: backgroundY }}>
        <Picture photo={images.reservation} alt="" sizes="100vw" />
      </motion.div>
      <div className="cta__shade" aria-hidden="true" />
      <div className="grain-layer cta__grain" aria-hidden="true" />

      <motion.div className="cta__stage" style={reduceMotion ? undefined : { rotateX, rotateY }}>
        <div className="cta__frame" aria-hidden="true">
          <span className="cta__corner cta__corner--tl" />
          <span className="cta__corner cta__corner--tr" />
          <span className="cta__corner cta__corner--bl" />
          <span className="cta__corner cta__corner--br" />
        </div>

        <div className="cta__content container">
          <Reveal y={14}>
            <p className="eyebrow cta__eyebrow">
              <span className="eyebrow__rule" aria-hidden="true" />
              <span>{t.reservation.eyebrow}</span>
              <span className="eyebrow__rule" aria-hidden="true" />
            </p>
          </Reveal>
          <RevealLines as="h2" id="cta-title" lines={t.reservation.titleLines} accent={1} className="cta__title display" stagger={0.14} />
          <Reveal delay={0.2}>
            <p className="cta__lead">{t.reservation.lead}</p>
          </Reveal>
          <Reveal delay={0.3} className="cta__actions">
            <PremiumButton size="lg" leadingIcon="calendar" onClick={openReservation} hasPopup>
              {t.actions.reserve}
            </PremiumButton>
            <PremiumButton size="lg" variant="outline" leadingIcon="phone" href={restaurant.phone.href}>
              {t.actions.call}
            </PremiumButton>
          </Reveal>
          <Reveal delay={0.38}>
            <p className="cta__phone">{restaurant.phone.display}</p>
          </Reveal>
        </div>
      </motion.div>
    </section>
  );
}
