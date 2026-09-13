import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useI18n } from '../i18n/LanguageProvider';
import { useUI } from '../context/UIContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { images } from '../data/images';
import { Picture } from '../components/Picture';
import { PremiumButton } from '../components/PremiumButton';
import { Marquee } from '../components/Marquee';
import { Reveal } from '../components/Reveal';
import './Entertainment.css';

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

/**
 * A pinned, scroll-driven scene on large screens: the photograph opens from a window to
 * full-bleed while the headline drifts apart. Phones and reduced motion get a calm stacked layout.
 */
export function Entertainment() {
  const { t } = useI18n();
  const { openGallery } = useUI();
  const reduceMotion = useReducedMotion();
  const largeScreen = useMediaQuery('(min-width: 900px)');
  const pinned = largeScreen && !reduceMotion;
  const stageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start start', 'end end'] });
  // Opacity and clip-path use function transforms on purpose: with array mappings Motion hands them to a
  // native ViewTimeline, which mis-reports progress inside this sticky, taller-than-viewport scene.
  const clipPath = useTransform(scrollYProgress, (progress) => {
    const closed = 1 - clamp01(progress / 0.55);
    const vertical = (14 * closed).toFixed(2);
    const horizontal = (18 * closed).toFixed(2);
    return `inset(${vertical}% ${horizontal}% ${vertical}% ${horizontal}%)`;
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.22, 1]);
  const firstLineX = useTransform(scrollYProgress, [0, 1], ['-4%', '10%']);
  const secondLineX = useTransform(scrollYProgress, [0, 1], ['12%', '-2%']);
  const copyOpacity = useTransform(scrollYProgress, (progress) => clamp01((progress - 0.3) / 0.25));
  const copyY = useTransform(scrollYProgress, [0.3, 0.55], [48, 0]);

  const [firstLine, ...restLines] = t.entertainment.titleLines;

  return (
    <section id="entertainment" data-nav="events" className="entertainment" aria-labelledby="entertainment-title">
      <div className="entertainment__ribbon">
        <Marquee items={t.entertainment.marquee} />
      </div>

      <div ref={stageRef} className={`entertainment__stage${pinned ? ' is-pinned' : ''}`}>
        <div className="entertainment__pin">
          <motion.div className="entertainment__media" style={pinned ? { clipPath } : undefined}>
            <motion.div className="entertainment__image" style={pinned ? { scale: imageScale } : undefined}>
              <Picture photo={images.entertainment} alt={t.photos.entertainment} sizes="100vw" />
            </motion.div>
            <div className="entertainment__shade" />
            <div className="grain-layer" aria-hidden="true" />
          </motion.div>

          <div className="entertainment__content container">
            <p className="eyebrow">
              <span className="eyebrow__index">04</span>
              <span className="eyebrow__rule" aria-hidden="true" />
              <span>{t.entertainment.eyebrow}</span>
            </p>
            <h2 id="entertainment-title" className="entertainment__title display">
              <motion.span className="entertainment__line" style={pinned ? { x: firstLineX } : undefined}>
                {firstLine}
              </motion.span>{' '}
              <motion.span className="entertainment__line is-accent" style={pinned ? { x: secondLineX } : undefined}>
                {restLines.join(' ')}
              </motion.span>
            </h2>

            <motion.div className="entertainment__copy" style={pinned ? { opacity: copyOpacity, y: copyY } : undefined}>
              {pinned ? (
                <EntertainmentCopy onDiscover={() => openGallery('atmosphere')} />
              ) : (
                <Reveal>
                  <EntertainmentCopy onDiscover={() => openGallery('atmosphere')} />
                </Reveal>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EntertainmentCopy({ onDiscover }: { onDiscover: () => void }) {
  const { t } = useI18n();
  return (
    <div className="entertainment__copy-inner">
      <p className="entertainment__lead">{t.entertainment.lead}</p>
      <p className="entertainment__body">{t.entertainment.body}</p>
      <div className="entertainment__actions">
        <PremiumButton onClick={onDiscover} hasPopup>
          {t.entertainment.cta}
        </PremiumButton>
        <p className="entertainment__note">{t.entertainment.note}</p>
      </div>
    </div>
  );
}
