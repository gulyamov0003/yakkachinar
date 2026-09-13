import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { motion, useScroll, useTransform, type MotionProps } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useI18n } from '../i18n/LanguageProvider';
import { format } from '../i18n/format';
import { useUI } from '../context/UIContext';
import { restaurant } from '../data/restaurant';
import { images } from '../data/images';
import { scrollToSection } from '../lib/scroll';
import { EASE_OUT } from '../lib/motion';
import { Picture } from '../components/Picture';
import { PremiumButton } from '../components/PremiumButton';
import { RevealLines } from '../components/Reveal';
import { HeroEmblem } from '../components/HeroEmblem';
import { BrandLogo } from '../components/BrandLogo';
import { StarIcon } from '../components/Icons';
import './Hero.css';

const BRAND = 'Yakkachinar';

/**
 * Depth, back to front: photograph → shade → grain → copy → crest medallion → navigation.
 * The opening sequence starts as the preloader lifts; phones get the same choreography at a quicker pace.
 * With reduced motion everything is simply present.
 */
export function Hero() {
  const { t, formatNumber } = useI18n();
  const { openReservation, introReady } = useUI();
  const reduceMotion = useReducedMotion();
  const compact = useMediaQuery('(max-width: 767px)');
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const pace = compact ? 0.65 : 1;
  const sectionRef = useRef<HTMLElement>(null);
  const [play, setPlay] = useState(false);
  const [emblemPlay, setEmblemPlay] = useState(false);

  useEffect(() => {
    if (!introReady) return;
    const frame = requestAnimationFrame(() => setPlay(true));
    const emblem = window.setTimeout(() => setEmblemPlay(true), reduceMotion ? 0 : 900 * pace);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(emblem);
    };
  }, [introReady, reduceMotion, pace]);

  // Pointer depth: the photograph, the copy and the crest drift by different amounts.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !finePointer || reduceMotion) return;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    const tick = () => {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      section.style.setProperty('--hero-px', current.x.toFixed(4));
      section.style.setProperty('--hero-py', current.y.toFixed(4));
      frame = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.0005 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || window.scrollY > section.offsetHeight) return;
      target.x = event.clientX / window.innerWidth - 0.5;
      target.y = event.clientY / window.innerHeight - 0.5;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, [finePointer, reduceMotion]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const emblemY = useTransform(scrollYProgress, [0, 1], ['0%', '-45%']);
  // A function transform keeps opacity on the JS path; Motion's native ViewTimeline shortcut
  // mis-reports progress in some layouts (see Entertainment).
  const contentOpacity = useTransform(scrollYProgress, (progress) => 1 - Math.min(Math.max(progress / 0.72, 0), 1));

  const enter = (delay: number, distance = 24): MotionProps => ({
    initial: reduceMotion ? false : { opacity: 0, y: distance },
    animate: play ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1.3, ease: EASE_OUT, delay: delay * pace },
  });

  const explore = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSection('experience');
  };

  const rating = formatNumber(restaurant.rating, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <section ref={sectionRef} id="overview" data-nav="overview" className="hero" aria-labelledby="hero-title">
      <div className="hero__media">
        <motion.div className="hero__media-parallax" style={reduceMotion ? undefined : { y: mediaY }}>
          <motion.div
            className="hero__image"
            initial={reduceMotion ? false : { opacity: 0, scale: 1.16, clipPath: 'inset(14% 10% 14% 10%)' }}
            animate={play ? { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
            transition={{ duration: compact ? 1.8 : 2.3, ease: EASE_OUT, delay: 0.1 * pace }}
          >
            <Picture photo={images.hero} alt={t.photos.hero} sizes="100vw" priority />
          </motion.div>
        </motion.div>
        <div className="hero__glow" />
        <div className="hero__shade" />
        <div className="hero__vignette" />
        <div className="grain-layer" />
      </div>

      <motion.div className="hero__content container" style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}>
        <motion.div className="hero__crest" {...enter(0.2, 0)}>
          <BrandLogo className="hero__crest-logo" sizes="80px" eager />
        </motion.div>

        <motion.p
          className="hero__eyebrow eyebrow"
          initial={reduceMotion ? false : { opacity: 0, letterSpacing: '0.62em' }}
          animate={play ? { opacity: 1, letterSpacing: '0.32em' } : undefined}
          transition={{ duration: 1.8, ease: EASE_OUT, delay: 0.3 * pace }}
        >
          <span className="eyebrow__rule" aria-hidden="true" />
          {t.hero.eyebrow}
        </motion.p>

        <h1 id="hero-title" className="hero__brand">
          <span className="sr-only">{BRAND}</span>
          <span className="hero__brand-word" aria-hidden="true">
            {BRAND.split('').map((letter, index) => (
              <span key={index} className="hero__letter-mask">
                <motion.span
                  className="hero__letter"
                  initial={reduceMotion ? false : { y: '115%' }}
                  animate={play ? { y: '0%' } : undefined}
                  transition={{ duration: 1.35, ease: EASE_OUT, delay: (0.7 + index * 0.05) * pace }}
                >
                  {letter}
                </motion.span>
              </span>
            ))}
          </span>
        </h1>

        <RevealLines
          as="p"
          lines={t.hero.titleLines}
          accent={1}
          className="hero__tagline"
          delay={1.05 * pace}
          stagger={0.12 * pace}
          play={play}
        />

        <motion.p className="hero__lead" {...enter(1.35)}>
          {t.hero.lead}
        </motion.p>

        <motion.div className="hero__actions" {...enter(1.55)}>
          <PremiumButton size="lg" leadingIcon="calendar" onClick={openReservation} hasPopup>
            {t.actions.reserve}
          </PremiumButton>
          <PremiumButton size="lg" variant="outline" href="#experience" onClick={explore}>
            {t.hero.secondaryCta}
          </PremiumButton>
        </motion.div>
      </motion.div>

      <motion.div className="hero__emblem-layer" style={reduceMotion ? undefined : { y: emblemY }}>
        <HeroEmblem play={emblemPlay} />
      </motion.div>

      <motion.div
        className="hero__facts"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={play ? { opacity: 1 } : undefined}
        transition={{ duration: 1.6, ease: EASE_OUT, delay: 1.8 * pace }}
      >
        <dl className="hero__facts-list container">
          <div className="hero__fact">
            <dt>{t.hero.facts.ratingLabel}</dt>
            <dd>
              <span className="hero__fact-value">{rating}</span>
              <StarIcon size={14} className="hero__fact-star" />
              <span className="hero__fact-sub">{format(t.hero.facts.reviewsCount, { count: `${restaurant.reviewCount}+` })}</span>
            </dd>
          </div>
          <div className="hero__fact">
            <dt>{t.hero.facts.openLabel}</dt>
            <dd>
              <span className="hero__fact-value">{t.hero.facts.openValue}</span>
            </dd>
          </div>
          <div className="hero__fact">
            <dt>{t.hero.facts.entertainmentLabel}</dt>
            <dd>
              <span className="hero__fact-value">{t.hero.facts.entertainmentValue}</span>
            </dd>
          </div>
          <div className="hero__fact">
            <dt>{t.hero.facts.priceLabel}</dt>
            <dd>
              <span className="hero__fact-value">{t.hero.facts.priceValue}</span>
            </dd>
          </div>
        </dl>
      </motion.div>
    </section>
  );
}
