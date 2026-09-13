import { motion, type Variants } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { EASE_OUT } from '../lib/motion';
import { RevealLines } from './Reveal';

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  lines: readonly string[];
  id?: string;
  accent?: number | readonly number[];
  align?: 'left' | 'center';
  className?: string;
}

const rise = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 10 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT, delay } },
});

const draw: Variants = {
  hidden: { scaleX: 0 },
  shown: { scaleX: 1, transition: { duration: 1.1, ease: EASE_OUT, delay: 0.1 } },
};

/** Index, a drawn gold rule and the label arrive in sequence; the title lines follow. */
export function SectionHeading({ index, eyebrow, lines, id, accent, align = 'left', className = '' }: SectionHeadingProps) {
  const reduceMotion = useReducedMotion();
  return (
    <div className={`section-heading section-heading--${align} ${className}`}>
      <motion.p className="eyebrow" initial={reduceMotion ? false : 'hidden'} whileInView="shown" viewport={{ once: true, amount: 0.6 }}>
        <motion.span className="eyebrow__index" variants={rise(0)}>
          {index}
        </motion.span>
        <motion.span className="eyebrow__rule" aria-hidden="true" variants={draw} />
        <motion.span variants={rise(0.25)}>{eyebrow}</motion.span>
      </motion.p>
      <RevealLines as="h2" id={id} lines={lines} accent={accent} className="section-heading__title display" />
    </div>
  );
}
