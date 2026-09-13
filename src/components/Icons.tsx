import type { ReactNode, SVGProps } from 'react';

type IconProps = Omit<SVGProps<SVGSVGElement>, 'ref' | 'children'> & { size?: number };

function Svg({
  size = 20,
  viewBox = '0 0 24 24',
  width,
  height,
  children,
  ...rest
}: IconProps & { viewBox?: string; children: ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      width={width ?? size}
      height={height ?? size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Long editorial arrow. `size` is its height. */
export function ArrowRight({ size = 12, ...rest }: IconProps) {
  return (
    <Svg viewBox="0 0 26 12" width={Math.round((size * 26) / 12)} height={size} {...rest}>
      <path d="M1 6h23M19 1.5 23.5 6 19 10.5" />
    </Svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <Svg size={16} {...props}>
      <path d="M7 17 17 7M9 7h8v8" />
    </Svg>
  );
}

export function ArrowDown(props: IconProps) {
  return (
    <Svg size={16} {...props}>
      <path d="M12 4v16M6.5 14.5 12 20l5.5-5.5" />
    </Svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Svg size={18} {...props}>
      <path d="M6.6 3.5h2.5l1.5 4.2-2.1 1.4a11.6 11.6 0 0 0 6.4 6.4l1.4-2.1 4.2 1.5v2.5a2 2 0 0 1-2.2 2A15.6 15.6 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z" />
    </Svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <Svg size={16} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </Svg>
  );
}

/** Location arrow, used for directions. */
export function NavigationIcon(props: IconProps) {
  return (
    <Svg size={16} {...props}>
      <path d="M20.5 3.5 3.5 10.6l7.1 2.8 2.8 7.1z" />
    </Svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <Svg size={18} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <Svg size={18} {...props}>
      <path d="M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </Svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg size={20} {...props}>
      <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
    </Svg>
  );
}

export function ChevronLeft(props: IconProps) {
  return (
    <Svg size={22} {...props}>
      <path d="M14.5 5.5 8 12l6.5 6.5" />
    </Svg>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <Svg size={22} {...props}>
      <path d="M9.5 5.5 16 12l-6.5 6.5" />
    </Svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <Svg size={16} {...props}>
      <rect x="8.5" y="8.5" width="11" height="11" rx="1.5" />
      <path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" />
    </Svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Svg size={16} {...props}>
      <path d="M5 12.5 9.5 17 19 7.5" />
    </Svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <Svg size={20} {...props}>
      <path
        d="M12 2.9l2.75 5.9 6.35.7-4.7 4.35 1.3 6.3L12 17l-5.7 3.15 1.3-6.3L2.9 9.5l6.35-.7z"
        fill="currentColor"
        stroke="none"
      />
    </Svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Svg size={24} {...props}>
      <path d="M3.5 9h17M8.5 15h12" />
    </Svg>
  );
}

/* Experience pillars — fine line illustrations drawn for this site. */

export function CuisineIcon(props: IconProps) {
  return (
    <Svg viewBox="0 0 32 32" size={32} strokeWidth={1.1} {...props}>
      <path d="M4 23.5h24M6.5 23.5a9.5 9.5 0 0 1 19 0M16 14v-2.5M13.5 11.5h5M9 27h14" />
    </Svg>
  );
}

export function MusicIcon(props: IconProps) {
  return (
    <Svg viewBox="0 0 32 32" size={32} strokeWidth={1.1} {...props}>
      <path d="M12 23V8.5l13-3.2v14.6M12 12.6l13-3.2" />
      <circle cx="9" cy="23" r="3" />
      <circle cx="22" cy="20" r="3" />
    </Svg>
  );
}

export function InteriorIcon(props: IconProps) {
  return (
    <Svg viewBox="0 0 32 32" size={32} strokeWidth={1.1} {...props}>
      <path d="M7 27V14a9 9 0 0 1 18 0v13M4 27h24M12 27v-8.5a4 4 0 0 1 8 0V27M16 5v1.5" />
    </Svg>
  );
}

export function CelebrationIcon(props: IconProps) {
  return (
    <Svg viewBox="0 0 32 32" size={32} strokeWidth={1.1} {...props}>
      <path d="M7.5 9h5.5l-.6 6.4a2.2 2.2 0 0 1-4.3 0zM10.2 17.6V26M7.8 26h4.8M19 9h5.5l-.6 6.4a2.2 2.2 0 0 1-4.3 0zM21.8 17.6V26M19.4 26h4.8M16 3.5v2.5M12.8 4.6l1.2 1.6M19.2 4.6 18 6.2" />
    </Svg>
  );
}
