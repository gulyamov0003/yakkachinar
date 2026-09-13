import { prefersReducedMotion } from './motion';

const MIN_VISIBLE_MS = 950;
const MAX_WAIT_MS = 1300;
const EXIT_MS = 600;

/**
 * Lifts the static logo preloader from index.html: it stays until its light sweep has crossed the
 * crest (~0.95s from navigation start), then leaves as soon as the hero photograph has decoded —
 * never later than 1.3s; a slow photograph simply fades in behind the opening sequence.
 * With reduced motion it is removed immediately. Returns a cleanup for React effects.
 */
export function releasePreloader(onReveal: () => void): () => void {
  const element = document.getElementById('preloader');
  if (!element || prefersReducedMotion() || getComputedStyle(element).display === 'none') {
    element?.remove();
    onReveal();
    return () => {};
  }

  const timers: number[] = [];
  let cancelled = false;
  const wait = (ms: number) => new Promise<void>((resolve) => timers.push(window.setTimeout(resolve, Math.max(0, ms))));
  const heroImage = document.querySelector<HTMLImageElement>('.hero__image img');
  const decoded = heroImage ? heroImage.decode().catch(() => undefined) : Promise.resolve();

  Promise.race([Promise.all([wait(MIN_VISIBLE_MS - performance.now()), decoded]), wait(MAX_WAIT_MS - performance.now())]).then(() => {
    if (cancelled) return;
    element.classList.add('is-done');
    onReveal();
    timers.push(window.setTimeout(() => element.remove(), EXIT_MS));
  });

  return () => {
    cancelled = true;
    timers.forEach((id) => window.clearTimeout(id));
  };
}
