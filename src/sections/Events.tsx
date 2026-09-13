import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useI18n } from '../i18n/LanguageProvider';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { restaurant } from '../data/restaurant';
import { images } from '../data/images';
import type { OccasionKey, PhotoKey } from '../data/translations';
import { EASE_OUT } from '../lib/motion';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { Picture } from '../components/Picture';
import { PremiumButton } from '../components/PremiumButton';
import { ArrowRight } from '../components/Icons';
import './Events.css';

const OCCASIONS: readonly { key: OccasionKey; image: PhotoKey }[] = [
  { key: 'weddings', image: 'weddings' },
  { key: 'celebrations', image: 'celebrations' },
  { key: 'private', image: 'privateEvents' },
  { key: 'special', image: 'specialOccasions' },
  { key: 'gatherings', image: 'gatherings' },
];

const pad = (value: number) => String(value).padStart(2, '0');

export function Events() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const [active, setActive] = useState(0);

  // On touch screens the occasion nearest the middle of the screen drives the photograph.
  useEffect(() => {
    if (finePointer) return;
    const rows = document.querySelectorAll<HTMLElement>('[data-occasion]');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number(entry.target.getAttribute('data-occasion')));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [finePointer]);

  const current = OCCASIONS[active];

  return (
    <section id="events" data-nav="events" className="section events" aria-labelledby="events-title">
      <div className="container events__grid">
        <div className="events__intro">
          <SectionHeading
            index="05"
            eyebrow={t.events.eyebrow}
            lines={t.events.titleLines}
            accent={t.events.titleLines.length - 1}
            id="events-title"
          />
          <Reveal delay={0.1}>
            <p className="lead">{t.events.lead}</p>
          </Reveal>
          <Reveal delay={0.16} className="events__cta">
            <PremiumButton href={restaurant.phone.href} leadingIcon="phone">
              {t.events.cta}
            </PremiumButton>
            <p className="events__cta-note">
              {t.events.ctaNote}{' '}
              <a className="events__phone" href={restaurant.phone.href}>
                {restaurant.phone.display}
              </a>
            </p>
          </Reveal>
        </div>

        <div className="events__showcase">
          <Reveal y={40} amount={0.2}>
            <div className="events__frame media-frame" data-cursor="view">
              <AnimatePresence initial={false}>
                <motion.div
                  key={current.image}
                  className="events__image"
                  initial={reduceMotion ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
                  animate={reduceMotion ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
                  exit={{ opacity: 0, transition: { duration: 0.5, delay: reduceMotion ? 0 : 0.6 } }}
                  transition={{ duration: 1.1, ease: EASE_OUT }}
                >
                  <Picture photo={images[current.image]} alt={t.photos[current.image]} sizes="(min-width: 1024px) 52vw, 92vw" />
                </motion.div>
              </AnimatePresence>
              <span className="events__counter" aria-hidden="true">
                {pad(active + 1)} / {pad(OCCASIONS.length)}
              </span>
            </div>
          </Reveal>

          <ol className="events__list">
            {OCCASIONS.map(({ key }, index) => (
              <li
                key={key}
                data-occasion={index}
                className={`events__row${index === active ? ' is-active' : ''}`}
                onPointerEnter={(event) => {
                  if (event.pointerType === 'mouse') setActive(index);
                }}
              >
                <span className="events__row-index" aria-hidden="true">
                  {pad(index + 1)}
                </span>
                <div className="events__row-copy">
                  <h3 className="events__row-title">{t.events.occasions[key].title}</h3>
                  <p className="events__row-text">{t.events.occasions[key].text}</p>
                </div>
                <span className="events__row-mark" aria-hidden="true">
                  <ArrowRight />
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
