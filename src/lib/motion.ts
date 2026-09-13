/** Motion language: slow, controlled, no overshoot. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_LUX = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const DURATION = {
  fast: 0.35,
  base: 0.8,
  slow: 1.2,
  cinematic: 1.8,
} as const;

/** Easing used for programmatic smooth scrolling (Lenis). */
export function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2;
}

const forcedOff = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('motion') === 'reduce';

/** `?motion=reduce` renders every section in its final state (accessibility review, static screenshots). */
export function isMotionForcedOff(): boolean {
  return forcedOff;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && (forcedOff || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}
