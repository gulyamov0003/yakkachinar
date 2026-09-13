import { lazy, Suspense, useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { LogoMedallion } from './LogoMedallion';

const ThreeScene = lazy(() => import('./ThreeScene'));

/**
 * Desktop: the official crest as a WebGL medallion, loaded once the opening sequence is under way.
 * Touch screens (and any device without WebGL): the same crest as a lightweight CSS 3D medallion.
 */
export function HeroEmblem({ play }: { play: boolean }) {
  const desktop = useMediaQuery('(min-width: 900px) and (hover: hover) and (pointer: fine)');
  // Below 900px the hero shows its small crest instead, so nothing here is rendered or downloaded.
  const wide = useMediaQuery('(min-width: 900px)');
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!play || !desktop) return;
    const id = window.setTimeout(() => setMounted(true), 150);
    return () => window.clearTimeout(id);
  }, [play, desktop]);

  const use3D = desktop && !failed;
  const visible = use3D ? ready : play;

  return (
    <div className={`hero-emblem${visible ? ' is-ready' : ''}`} aria-hidden="true">
      {use3D && mounted ? (
        <Suspense fallback={null}>
          <ThreeScene
            className="hero-emblem__canvas"
            animate={!reduceMotion}
            onReady={() => setReady(true)}
            onError={() => setFailed(true)}
          />
        </Suspense>
      ) : null}
      {!use3D && wide ? <LogoMedallion className="hero-emblem__medallion" interactive={desktop} /> : null}
    </div>
  );
}
