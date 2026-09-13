import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/LanguageProvider';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { prefersReducedMotion } from '../lib/motion';
import './CustomCursor.css';

type CursorMode = 'hidden' | 'default' | 'view' | 'explore' | 'magnetic';

/**
 * Desktop-only cursor: a gold dot with a trailing ring that grows into a
 * VIEW / EXPLORE label over imagery. Elements opt in with `data-cursor`.
 */
export function CustomCursor() {
  const { t } = useI18n();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>('hidden');

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!finePointer || !dot || !ring) return;

    const root = document.documentElement;
    root.classList.add('has-custom-cursor');
    const smoothing = prefersReducedMotion() ? 1 : 0.2;
    let targetX = 0;
    let targetY = 0;
    let ringX = 0;
    let ringY = 0;
    let frame = 0;
    let visible = false;

    const tick = () => {
      ringX += (targetX - ringX) * smoothing;
      ringY += (targetY - ringY) * smoothing;
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frame = Math.abs(targetX - ringX) + Math.abs(targetY - ringY) > 0.2 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        visible = true;
        ringX = targetX;
        ringY = targetY;
        setMode((current) => (current === 'hidden' ? 'default' : current));
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onOver = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const target = event.target instanceof Element ? event.target.closest('[data-cursor], a, button') : null;
      const declared = target?.getAttribute('data-cursor') as CursorMode | null;
      setMode(declared ?? (target ? 'magnetic' : 'default'));
    };

    // Leaving the window or entering an iframe (the map) hides the custom cursor.
    const onOut = (event: MouseEvent) => {
      if (!event.relatedTarget) {
        visible = false;
        setMode('hidden');
      }
    };
    const onDown = () => ring.classList.add('is-pressed');
    const onUp = () => ring.classList.remove('is-pressed');

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut);
    document.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerup', onUp, { passive: true });

    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      cancelAnimationFrame(frame);
      root.classList.remove('has-custom-cursor');
    };
  }, [finePointer]);

  if (!finePointer) return null;

  return (
    <div className={`cursor cursor--${mode}`} aria-hidden="true">
      <div ref={ringRef} className="cursor__ring">
        <span className="cursor__halo" />
        <span className={`cursor__label${mode === 'view' ? ' is-visible' : ''}`}>{t.cursor.view}</span>
        <span className={`cursor__label${mode === 'explore' ? ' is-visible' : ''}`}>{t.cursor.explore}</span>
      </div>
      <div ref={dotRef} className="cursor__dot" />
    </div>
  );
}
