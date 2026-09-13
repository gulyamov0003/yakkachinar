export interface Photo {
  /**
   * Remote Unsplash base URL (temporary placeholder) or a local path under /public.
   * Local paths may contain `{w}` to use pre-generated widths, e.g. `/images/hero-{w}.webp`.
   */
  src: string;
  /** Intrinsic width / height ratio — reserves space and prevents layout shift. */
  ratio: number;
  /** CSS object-position for art-directed crops. */
  focus?: string;
  /** True while stock photography stands in for Yakkachinar's own photos. */
  placeholder?: boolean;
}

const UNSPLASH = 'https://images.unsplash.com/';
export const RESPONSIVE_WIDTHS = [480, 720, 1080, 1440, 1920, 2560] as const;

function nearestWidth(width: number): number {
  return RESPONSIVE_WIDTHS.find((candidate) => candidate >= width) ?? RESPONSIVE_WIDTHS[RESPONSIVE_WIDTHS.length - 1];
}

/** URL for a given rendered width. Unsplash negotiates AVIF/WebP automatically via `auto=format`. */
export function photoUrl(photo: Photo, width: number, quality = 72): string {
  if (photo.src.startsWith(UNSPLASH)) return `${photo.src}?auto=format&fit=max&w=${width}&q=${quality}`;
  if (photo.src.includes('{w}')) return photo.src.replace('{w}', String(nearestWidth(width)));
  return photo.src;
}

export function photoSrcSet(photo: Photo, widths: readonly number[] = RESPONSIVE_WIDTHS): string | undefined {
  if (!photo.src.startsWith(UNSPLASH) && !photo.src.includes('{w}')) return undefined;
  return widths.map((width) => `${photoUrl(photo, width)} ${width}w`).join(', ');
}
