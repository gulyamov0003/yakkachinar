import { useRef, type ComponentType } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useI18n } from '../i18n/LanguageProvider';
import { images } from '../data/images';
import type { PillarKey } from '../data/translations';
import { EASE_OUT } from '../lib/motion';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { ImageReveal } from '../components/ImageReveal';
import { CelebrationIcon, CuisineIcon, InteriorIcon, MusicIcon } from '../components/Icons';
import './Experience.css';

const PILLARS: { key: PillarKey; Icon: ComponentType<{ className?: string }> }[] = [
  { key: 'cuisine', Icon: CuisineIcon },
  { key: 'music', Icon: MusicIcon },
  { key: 'interior', Icon: InteriorIcon },
  { key: 'celebrations', Icon: CelebrationIcon },
];

export function Experience() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const visualRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: visualRef, offset: ['start end', 'end start'] });
  const mainDrift = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);
  const detailDrift = useTransform(scrollYProgress, [0, 1], ['22%', '-22%']);

  return (
    <section id="experience" data-nav="experience" className="section experience" aria-labelledby="experience-title">
      <div className="container experience__grid">
        <div className="experience__intro">
          <SectionHeading
            index="01"
            eyebrow={t.experience.eyebrow}
            lines={t.experience.titleLines}
            accent={1}
            id="experience-title"
            className="experience__heading"
          />
          <Reveal delay={0.1}>
            <p className="experience__lead">{t.experience.lead}</p>
          </Reveal>
        </div>

        <div ref={visualRef} className="experience__visual">
          <ImageReveal
            photo={images.experienceMain}
            alt={t.photos.experienceMain}
            sizes="(min-width: 1024px) 38vw, 82vw"
            className="experience__main"
            parallax={mainDrift}
            cursor="view"
          />
          <motion.div className="experience__detail-wrap" style={reduceMotion ? undefined : { y: detailDrift }}>
            <ImageReveal
              photo={images.experienceDetail}
              alt={t.photos.experienceDetail}
              sizes="(min-width: 1024px) 18vw, 46vw"
              className="experience__detail"
              direction="right"
              delay={0.25}
              cursor="view"
            />
          </motion.div>
          <p className="experience__caption">
            <span className="experience__caption-rule" aria-hidden="true" />
            {t.experience.caption}
          </p>
        </div>

        <Reveal className="experience__body">
          <p>{t.experience.body}</p>
        </Reveal>

        <ul className="experience__pillars">
          {PILLARS.map(({ key, Icon }, index) => (
            <motion.li
              key={key}
              className="experience__pillar"
              initial={reduceMotion ? false : { opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.1, ease: EASE_OUT, delay: index * 0.09 }}
            >
              <Icon className="experience__pillar-icon" />
              <span className="experience__pillar-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="experience__pillar-title">{t.experience.pillars[key].title}</h3>
              <p className="experience__pillar-text">{t.experience.pillars[key].text}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
