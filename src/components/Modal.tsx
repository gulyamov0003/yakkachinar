import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useIsPresent } from 'motion/react';
import { lockBackground, lockScroll, unlockBackground, unlockScroll } from '../lib/scroll';
import { EASE_OUT } from '../lib/motion';
import './Modal.css';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  label?: string;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}

const FOCUSABLE = 'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible overlay: portal, inert background, scroll lock, focus trap, Escape to close
 * and focus restored to the trigger. Children bring their own entrance/exit motion.
 */
export function Modal({ open, ...rest }: ModalProps) {
  return createPortal(<AnimatePresence>{open ? <ModalLayer key="modal" {...rest} /> : null}</AnimatePresence>, document.body);
}

function ModalLayer({ onClose, label, labelledBy, className = '', children }: Omit<ModalProps, 'open'>) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const released = useRef(false);
  const isPresent = useIsPresent();
  // Captured once per opening during render, so StrictMode's effect replay can't record the dialog itself.
  const [previousFocus] = useState(() => (document.activeElement instanceof HTMLElement ? document.activeElement : null));

  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  });

  /** Give the page back — called as soon as closing starts, not when the exit animation ends. */
  const release = useCallback(() => {
    if (released.current) return;
    released.current = true;
    unlockBackground();
    unlockScroll();
    const current = document.activeElement;
    const focusWasInside = !current || current === document.body || Boolean(panelRef.current?.contains(current));
    // Restore focus only if it wasn't moved on purpose (e.g. into another dialog).
    if (previousFocus?.isConnected && focusWasInside) previousFocus.focus({ preventScroll: true });
  }, [previousFocus]);

  useEffect(() => {
    released.current = false;
    const panel = panelRef.current;
    lockScroll();
    lockBackground();

    const initial = panel?.querySelector<HTMLElement>('[data-autofocus]') ?? panel?.querySelector<HTMLElement>(FOCUSABLE);
    initial?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (released.current || !panel) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((item) => item.getClientRects().length > 0);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (!panel.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      release();
    };
  }, [release]);

  useEffect(() => {
    if (!isPresent) release();
  }, [isPresent, release]);

  return (
    <motion.div
      className={`modal ${className}`}
      data-state={isPresent ? 'open' : 'closing'}
      style={isPresent ? undefined : { pointerEvents: 'none' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 1, transition: { duration: 0.55 } }}
    >
      <motion.div
        className="modal__backdrop"
        aria-hidden="true"
        onClick={() => onCloseRef.current()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label={label} aria-labelledby={labelledBy} className="modal__dialog" data-lenis-prevent>
        {children}
      </div>
    </motion.div>
  );
}
