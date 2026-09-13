import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useI18n } from '../i18n/LanguageProvider';
import { restaurant } from '../data/restaurant';
import { images } from '../data/images';
import type { ImageId } from '../data/translations';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { Counter } from '../components/Counter';
import { Picture } from '../components/Picture';
import { PremiumButton } from '../components/PremiumButton';
import { InstagramIcon } from '../components/Icons';
import './Instagram.css';

const TILES: readonly ImageId[] = ['dinner', 'khachapuri', 'chandelier', 'toast', 'shashlik'];

/** A curated collage linking to the official profile — no feed API is implied. */
export function Instagram() {
  const { t, lang, formatNumber } = useI18n();
  const reduceMotion = useReducedMotion();
  const collageRef = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({ target: collageRef, offset: ['start end', 'end start'] });
  // Pixel-based so every tile in the right-hand column moves by exactly the same amount.
  const columnDrift = useTransform(scrollYProgress, [0, 1], [48, -48]);

  const followers =
    lang === 'en'
      ? { value: restaurant.instagramFollowers / 1000, formatter: (v: number) => `${Math.round(v)}K+` }
      : {
          value: restaurant.instagramFollowers,
          formatter: (v: number) => `${formatNumber(Math.round(v / 1000) * 1000)}+`,
        };

  return (
    <section id="instagram" data-nav="reviews" className="section instagram" aria-labelledby="instagram-title">
      <div className="container instagram__grid">
        <div className="instagram__info">
          <SectionHeading index="07" eyebrow={t.instagram.eyebrow} lines={t.instagram.titleLines} accent={1} id="instagram-title" />
          <Reveal>
            <a href={restaurant.instagram.url} className="instagram__handle" target="_blank" rel="noopener noreferrer">
              {restaurant.instagram.handle}
              <span className="sr-only"> ({t.a11y.newTab})</span>
            </a>
          </Reveal>
          <Reveal className="instagram__stat" delay={0.08}>
            <Counter key={lang === 'en' ? 'compact' : 'full'} value={followers.value} formatter={followers.formatter} className="instagram__count" />
            <span className="instagram__count-label">{t.instagram.followersLabel}</span>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="lead">{t.instagram.lead}</p>
          </Reveal>
          <Reveal delay={0.16}>
            <PremiumButton href={restaurant.instagram.url} external leadingIcon="instagram" icon="external">
              {t.actions.visitInstagram}
            </PremiumButton>
          </Reveal>
        </div>

        <a
          ref={collageRef}
          href={restaurant.instagram.url}
          className="instagram__collage"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t.a11y.instagramImage} (${t.a11y.newTab})`}
          data-cursor="view"
        >
          {TILES.map((id, index) => {
            const drift = index === 1 || index === 3 || index === 4 ? columnDrift : undefined;
            return (
              <motion.span
                key={id}
                className={`instagram__tile instagram__tile--${index + 1}`}
                style={drift && !reduceMotion ? { y: drift } : undefined}
              >
                <motion.span
                  className="instagram__tile-inner"
                  initial={reduceMotion ? false : { opacity: 0, scale: 1.08 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
                >
                  <Picture photo={images[id]} alt="" sizes="(min-width: 1024px) 26vw, 50vw" />
                </motion.span>
              </motion.span>
            );
          })}
          <span className="instagram__badge" aria-hidden="true">
            <InstagramIcon size={22} />
          </span>
        </a>
      </div>
    </section>
  );
}
