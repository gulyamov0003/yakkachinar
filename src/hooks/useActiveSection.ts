import { useEffect, useState } from 'react';
import type { NavKey } from '../data/translations';

/**
 * Tracks which navigation group is under a thin reading line at ~40% of the viewport.
 * Sections declare their group with `data-nav` (several sections may share one group).
 */
export function useActiveSection(initial: NavKey): NavKey {
  const [active, setActive] = useState<NavKey>(initial);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-nav]'));
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.getAttribute('data-nav') as NavKey);
        }
      },
      { rootMargin: '-40% 0px -59% 0px' },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return active;
}
