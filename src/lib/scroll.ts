import type Lenis from 'lenis';
import { easeInOutQuart, prefersReducedMotion } from './motion';

let lenis: Lenis | null = null;
let scrollLocks = 0;
let backgroundLocks = 0;

export function registerLenis(instance: Lenis | null): void {
  lenis = instance;
}

function resolve(target: string | HTMLElement): HTMLElement | null {
  if (typeof target !== 'string') return target;
  return document.getElementById(target.replace(/^#/, ''));
}

/** Smoothly scroll to a section, then move keyboard focus there without a second jump. */
export function scrollToSection(target: string | HTMLElement, options: { focus?: boolean; immediate?: boolean } = {}): void {
  const element = resolve(target);
  if (!element) return;
  const { focus = true } = options;
  const immediate = options.immediate || prefersReducedMotion();

  const moveFocus = () => {
    if (!focus) return;
    if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1');
    element.focus({ preventScroll: true });
  };

  if (lenis) {
    lenis.scrollTo(element, {
      immediate,
      duration: 1.6,
      easing: easeInOutQuart,
      force: true,
      onComplete: moveFocus,
    });
    if (immediate) moveFocus();
    return;
  }
  const top = element.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' });
  moveFocus();
}

/** Compensate a layout shift instantly (used to keep the reader's place when the language changes). */
export function scrollByImmediate(delta: number): void {
  if (Math.abs(delta) < 1) return;
  const top = window.scrollY + delta;
  if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
  else window.scrollTo({ top, behavior: 'auto' });
}

export function lockScroll(): void {
  scrollLocks += 1;
  if (scrollLocks === 1) {
    lenis?.stop();
    document.documentElement.classList.add('is-scroll-locked');
  }
}

export function unlockScroll(): void {
  scrollLocks = Math.max(0, scrollLocks - 1);
  if (scrollLocks === 0) {
    lenis?.start();
    document.documentElement.classList.remove('is-scroll-locked');
  }
}

/** Make the page behind an overlay inert (unreachable by keyboard and assistive tech). */
export function lockBackground(): void {
  backgroundLocks += 1;
  if (backgroundLocks === 1) document.getElementById('root')?.setAttribute('inert', '');
}

export function unlockBackground(): void {
  backgroundLocks = Math.max(0, backgroundLocks - 1);
  if (backgroundLocks === 0) document.getElementById('root')?.removeAttribute('inert');
}
