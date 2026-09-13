import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { BrandLogo } from './BrandLogo';
import './LogoMedallion.css';

interface LogoMedallionProps {
  className?: string;
  /** Follow the mouse with a gentle tilt (fine pointers only). */
  interactive?: boolean;
}

/**
 * CSS 3D version of the crest medallion: a gold edge layer behind the face gives it thickness,
 * a slow float and an occasional gold light keep it alive. GPU-cheap for tablets and fallbacks.
 */
export function LogoMedallion({ className = '', interactive = false }: LogoMedallionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !interactive || reduceMotion) return;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    const tick = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      node.style.setProperty('--tilt-x', `${(-current.y * 10).toFixed(2)}deg`);
      node.style.setProperty('--tilt-y', `${(current.x * 14).toFixed(2)}deg`);
      frame = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = node.getBoundingClientRect();
      target.x = Math.tanh((event.clientX - rect.left - rect.width / 2) / (rect.width * 1.1));
      target.y = Math.tanh((event.clientY - rect.top - rect.height / 2) / (rect.height * 1.1));
      if (!frame) frame = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, [interactive, reduceMotion]);

  return (
    <div ref={ref} className={`medallion ${className}`}>
      <div className="medallion__tilt">
        <div className="medallion__float">
          <span className="medallion__edge" />
          <BrandLogo className="medallion__face is-periodic" sizes="(min-width: 900px) 26vw, 50vw" eager />
        </div>
      </div>
      <span className="medallion__shadow" />
    </div>
  );
}
