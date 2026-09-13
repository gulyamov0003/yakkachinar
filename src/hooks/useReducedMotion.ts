import { useReducedMotion as useSystemReducedMotion } from 'motion/react';
import { isMotionForcedOff } from '../lib/motion';

/**
 * True when the visitor prefers reduced motion — or when the page is opened with `?motion=reduce`
 * (useful for accessibility reviews and static screenshots).
 */
export function useReducedMotion(): boolean {
  const system = useSystemReducedMotion();
  return isMotionForcedOff() || Boolean(system);
}
