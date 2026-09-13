import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { EASE_OUT } from '../lib/motion';
import { StarIcon } from './Icons';

interface StarsProps {
  rating: number;
  max?: number;
  label: string;
}

/** Five stars filled precisely to the rating (4.5 → four and a half), drawn in when visible. */
export function Stars({ rating, max = 5, label }: StarsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduceMotion = useReducedMotion();
  const hidden = `${100 - (rating / max) * 100}%`;
  const icons = Array.from({ length: max }, (_, index) => <StarIcon key={index} />);

  return (
    <div ref={ref} className="stars" role="img" aria-label={label}>
      <div className="stars__row stars__row--base">{icons}</div>
      <motion.div
        className="stars__row stars__row--fill"
        initial={reduceMotion ? false : { clipPath: 'inset(0% 100% 0% 0%)' }}
        animate={inView || reduceMotion ? { clipPath: `inset(0% ${hidden} 0% 0%)` } : undefined}
        transition={{ duration: 1.8, ease: EASE_OUT, delay: 0.35 }}
      >
        {icons}
      </motion.div>
    </div>
  );
}
