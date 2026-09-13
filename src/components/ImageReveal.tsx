import { useRef } from 'react';
import { motion, useInView, type MotionValue } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { Photo } from '../lib/image';
import { EASE_OUT } from '../lib/motion';
import { Picture } from './Picture';
import './ImageReveal.css';

type Direction = 'up' | 'down' | 'left' | 'right';

const HIDDEN: Record<Direction, string> = {
  up: 'inset(100% 0% 0% 0%)',
  down: 'inset(0% 0% 100% 0%)',
  left: 'inset(0% 0% 0% 100%)',
  right: 'inset(0% 100% 0% 0%)',
};
const SHOWN = 'inset(0% 0% 0% 0%)';

interface ImageRevealProps {
  photo: Photo;
  alt: string;
  sizes: string;
  className?: string;
  delay?: number;
  direction?: Direction;
  /** Scroll-linked vertical drift, e.g. from useTransform. */
  parallax?: MotionValue<string>;
  cursor?: 'view' | 'explore';
}

/**
 * Editorial image entrance: a clip-path wipe while the photograph settles from a slight zoom.
 * The figure is observed but never clipped itself — IntersectionObserver treats a fully clipped
 * element as invisible — so the wipe runs on an inner mask.
 */
export function ImageReveal({ photo, alt, sizes, className = '', delay = 0, direction = 'up', parallax, cursor }: ImageRevealProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const revealed = reduceMotion || inView;

  return (
    <figure ref={ref} className={`image-reveal ${className}`} data-cursor={cursor} data-revealed={revealed}>
      <motion.div
        className="image-reveal__mask media-frame"
        initial={reduceMotion ? false : { clipPath: HIDDEN[direction] }}
        animate={revealed ? { clipPath: SHOWN } : undefined}
        transition={{ duration: 1.6, ease: EASE_OUT, delay }}
      >
        <motion.div className="image-reveal__parallax" style={parallax && !reduceMotion ? { y: parallax } : undefined}>
          <motion.div
            className="image-reveal__zoom"
            initial={reduceMotion ? false : { scale: 1.24 }}
            animate={revealed ? { scale: 1 } : undefined}
            transition={{ duration: 2.3, ease: EASE_OUT, delay }}
          >
            <Picture photo={photo} alt={alt} sizes={sizes} />
          </motion.div>
        </motion.div>
      </motion.div>
    </figure>
  );
}
