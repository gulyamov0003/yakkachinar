import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { EASE_OUT } from '../lib/motion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Portion of the element that must be visible before it reveals. */
  amount?: number;
}

/** Fade-and-rise block reveal, played once when scrolled into view. */
export function Reveal({ children, className, delay = 0, y = 32, amount = 0.2 }: RevealProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1.1, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

const TAGS = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p } as const;

interface RevealLinesProps {
  lines: readonly string[];
  as?: keyof typeof TAGS;
  id?: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Line indexes rendered in gold italics. */
  accent?: number | readonly number[];
  /** Controlled start (e.g. the hero intro). When omitted the lines reveal on scroll. */
  play?: boolean;
}

/**
 * Masked, line-by-line headline reveal. Each language supplies its own art-directed
 * line breaks; a line may still wrap on narrow screens without clipping.
 */
export function RevealLines({ lines, as = 'h2', id, className = '', delay = 0, stagger = 0.09, accent, play }: RevealLinesProps) {
  const reduceMotion = useReducedMotion();
  const Tag = TAGS[as];
  const accents = accent === undefined ? [] : typeof accent === 'number' ? [accent] : accent;

  const container = {
    hidden: {},
    shown: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const line = {
    hidden: { y: '110%' },
    shown: { y: '0%', transition: { duration: 1.25, ease: EASE_OUT } },
  };
  const trigger =
    play === undefined
      ? { whileInView: 'shown', viewport: { once: true, amount: 0.35 } }
      : { animate: play ? 'shown' : 'hidden' };

  return (
    <Tag id={id} className={`reveal-lines ${className}`} variants={container} initial={reduceMotion ? false : 'hidden'} {...trigger}>
      {lines.map((text, index) => (
        <span key={index} className={`reveal-lines__line${accents.includes(index) ? ' is-accent' : ''}`}>
          <motion.span className="reveal-lines__inner" variants={line}>
            {text}
          </motion.span>
          {index < lines.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}
