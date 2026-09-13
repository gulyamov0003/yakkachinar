import { useEffect } from 'react';
import Lenis from 'lenis';
import { registerLenis } from '../lib/scroll';
import { isMotionForcedOff } from '../lib/motion';

/** Inertial wheel scrolling on desktop. Disabled entirely when the visitor prefers reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;

    const enable = () => {
      if (lenis || media.matches || isMotionForcedOff()) return;
      lenis = new Lenis({ autoRaf: true, lerp: 0.09, wheelMultiplier: 0.95, allowNestedScroll: true });
      registerLenis(lenis);
    };
    const disable = () => {
      lenis?.destroy();
      lenis = null;
      registerLenis(null);
    };
    const onChange = () => (media.matches ? disable() : enable());

    enable();
    media.addEventListener('change', onChange);
    return () => {
      media.removeEventListener('change', onChange);
      disable();
    };
  }, []);

  return null;
}
