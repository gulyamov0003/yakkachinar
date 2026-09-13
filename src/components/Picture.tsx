import { useLayoutEffect, useRef, useState } from 'react';
import { photoSrcSet, photoUrl, type Photo } from '../lib/image';

interface PictureProps {
  photo: Photo;
  alt: string;
  /** Rendered size hint for the browser's srcset choice. */
  sizes: string;
  priority?: boolean;
  className?: string;
  widths?: readonly number[];
}

/**
 * Responsive, lazy image that fades in once decoded and never shifts layout.
 * A photograph the browser already holds (e.g. a gallery tile opened in the viewer) appears at once.
 */
export function Picture({ photo, alt, sizes, priority = false, className = '', widths }: PictureProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [instant, setInstant] = useState(false);
  const srcSet = photoSrcSet(photo, widths);

  useLayoutEffect(() => {
    const image = ref.current;
    if (image?.complete && image.naturalWidth > 0) {
      setInstant(true);
      setLoaded(true);
    }
  }, []);

  return (
    <img
      ref={ref}
      className={`picture${loaded ? ' is-loaded' : ''}${instant ? ' is-instant' : ''}${className ? ` ${className}` : ''}`}
      src={photoUrl(photo, 1440)}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={1600}
      height={Math.round(1600 / photo.ratio)}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      draggable={false}
      onLoad={() => setLoaded(true)}
      style={photo.focus ? { objectPosition: photo.focus } : undefined}
    />
  );
}
