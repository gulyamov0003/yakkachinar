import type { MouseEventHandler, PointerEvent, ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { ArrowRight, ArrowUpRight, CalendarIcon, InstagramIcon, MapPinIcon, NavigationIcon, PhoneIcon } from './Icons';
import { useI18n } from '../i18n/LanguageProvider';
import './PremiumButton.css';

export type ButtonIcon = 'arrow' | 'external' | 'phone' | 'instagram' | 'pin' | 'calendar' | 'navigation' | 'none';

interface BaseProps {
  children: ReactNode;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  /** Icon after the label (default: arrow). */
  icon?: ButtonIcon;
  /** Optional icon before the label. */
  leadingIcon?: ButtonIcon;
  className?: string;
  magnetic?: boolean;
  ariaLabel?: string;
}

interface AsButton extends BaseProps {
  href?: undefined;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  hasPopup?: boolean;
}

interface AsLink extends BaseProps {
  href: string;
  external?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

const ICONS = {
  arrow: ArrowRight,
  external: ArrowUpRight,
  phone: PhoneIcon,
  instagram: InstagramIcon,
  pin: MapPinIcon,
  calendar: CalendarIcon,
  navigation: NavigationIcon,
} as const;

const SPRING = { stiffness: 220, damping: 20, mass: 0.6 };
const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

/**
 * The site's tactile control. The outer element carries the magnetic drift and the hit area;
 * the inner surface lifts on hover, presses on click, and carries the fill, light sweep and gold frame.
 * Labels may wrap for long Tajik and Russian translations.
 */
export function PremiumButton(props: AsButton | AsLink) {
  const {
    children,
    variant = 'solid',
    size = 'md',
    icon = 'arrow',
    leadingIcon = 'none',
    className = '',
    magnetic = true,
    ariaLabel,
  } = props;
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  const handleMove = (event: PointerEvent<HTMLElement>) => {
    if (!magnetic || reduceMotion || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(clamp((event.clientX - (rect.left + rect.width / 2)) * 0.12, 6));
    y.set(clamp((event.clientY - (rect.top + rect.height / 2)) * 0.2, 4));
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Leading = leadingIcon === 'none' ? null : ICONS[leadingIcon];
  const Trailing = icon === 'none' ? null : ICONS[icon];
  const classes = ['btn', `btn--${variant}`, `btn--${size}`, Leading ? 'btn--lead' : '', className].filter(Boolean).join(' ');

  const content = (
    <span className="btn__surface">
      <span className="btn__fill" aria-hidden="true" />
      <span className="btn__shine" aria-hidden="true" />
      <span className="btn__frame" aria-hidden="true" />
      {Leading ? (
        <span className={`btn__icon btn__icon--lead btn__icon--${leadingIcon}`} aria-hidden="true">
          <Leading />
        </span>
      ) : null}
      <span className="btn__label">{children}</span>
      {Trailing ? (
        <span className={`btn__icon btn__icon--trail btn__icon--${icon}`} aria-hidden="true">
          <Trailing />
        </span>
      ) : null}
    </span>
  );

  const shared = {
    className: classes,
    style: { x: springX, y: springY },
    onPointerMove: handleMove,
    onPointerLeave: handleLeave,
    'data-cursor': 'magnetic',
    'aria-label': ariaLabel,
  };

  if (props.href !== undefined) {
    const { href, external, onClick } = props;
    return (
      <motion.a
        {...shared}
        href={href}
        onClick={onClick}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {content}
        {external ? <span className="sr-only"> ({t.a11y.newTab})</span> : null}
      </motion.a>
    );
  }

  return (
    <motion.button {...shared} type="button" onClick={props.onClick} aria-haspopup={props.hasPopup ? 'dialog' : undefined}>
      {content}
    </motion.button>
  );
}
