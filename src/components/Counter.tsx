import { useEffect, useLayoutEffect, useRef } from 'react';
import { animate, useInView } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { EASE_OUT } from '../lib/motion';
import './Counter.css';

interface CounterProps {
  value: number;
  /** Formats the animated value — locale aware (e.g. 4,5 in Tajik and Russian). */
  formatter: (value: number) => string;
  duration?: number;
  className?: string;
}

/**
 * Counts from zero to `value` once in view. The final value is laid out invisibly underneath the
 * animated digits, so counting never changes the layout. Screen readers get the final value only;
 * a language change re-formats the finished number without replaying the animation.
 */
export function Counter({ value, formatter, duration = 2.2, className = '' }: CounterProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const formatterRef = useRef(formatter);
  const doneRef = useRef(false);
  const inView = useInView(rootRef, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    formatterRef.current = formatter;
    const node = valueRef.current;
    if (!node) return;
    if (doneRef.current || reduceMotion) {
      doneRef.current = true;
      node.textContent = formatter(value);
    } else if (!node.textContent) {
      node.textContent = formatter(0);
    }
  });

  useEffect(() => {
    const node = valueRef.current;
    if (!node || !inView || doneRef.current || reduceMotion) return;
    const controls = animate(0, value, {
      duration,
      ease: EASE_OUT,
      onUpdate: (latest) => {
        node.textContent = formatterRef.current(latest);
      },
      onComplete: () => {
        doneRef.current = true;
      },
    });
    return () => controls.stop();
  }, [inView, value, duration, reduceMotion]);

  const finalText = formatter(value);

  return (
    <span ref={rootRef} className={`counter ${className}`}>
      <span className="counter__sizer" aria-hidden="true">
        {finalText}
      </span>
      <span ref={valueRef} className="counter__value" aria-hidden="true" />
      <span className="sr-only">{finalText}</span>
    </span>
  );
}
