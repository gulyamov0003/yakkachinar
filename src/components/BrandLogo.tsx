import './BrandLogo.css';

/** Isolated from the official logo file by scripts/build-logo.py — never redrawn. */
const WIDTHS = [128, 256, 512, 1024] as const;
export const logoUrl = (width: (typeof WIDTHS)[number]) => `/brand/yakkachinar-logo-${width}.webp`;

interface BrandLogoProps {
  /** Rendered size for srcset selection, e.g. "40px" or "(min-width: 768px) 112px, 88px". */
  sizes: string;
  className?: string;
  /** Accessible name. Leave empty when the logo sits inside an already-labelled link. */
  alt?: string;
  eager?: boolean;
}

/**
 * The official Yakkachinar crest. Size it with `--logo-size` on the className.
 * Adding `is-shining` to the element (or hovering a `.sheen-on-hover` ancestor)
 * passes a soft gold light across the gold artwork only.
 */
export function BrandLogo({ sizes, className = '', alt = '', eager = false }: BrandLogoProps) {
  return (
    <span className={`brand-logo ${className}`}>
      <img
        className="brand-logo__image"
        src={logoUrl(256)}
        srcSet={WIDTHS.map((width) => `${logoUrl(width)} ${width}w`).join(', ')}
        sizes={sizes}
        width={256}
        height={256}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
      />
      <span className="brand-logo__sheen" aria-hidden="true" />
    </span>
  );
}
