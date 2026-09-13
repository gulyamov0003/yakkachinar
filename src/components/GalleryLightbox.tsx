import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useI18n } from '../i18n/LanguageProvider';
import { format } from '../i18n/format';
import type { GalleryItem } from '../data/gallery';
import { images, photoAlt } from '../data/images';
import { EASE_OUT } from '../lib/motion';
import { Picture } from './Picture';
import { ChevronLeft, ChevronRight, CloseIcon } from './Icons';
import './GalleryLightbox.css';

interface GalleryLightboxProps {
  items: readonly GalleryItem[];
  index: number;
  /** Index whose grid tile morphs into the viewer; -1 disables the shared transition. */
  sharedIndex: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const pad = (value: number) => String(value).padStart(2, '0');

/** Full-screen viewer: expands from the tile, arrows/keys/swipe to browse, Escape to close. */
export function GalleryLightbox({ items, index, sharedIndex, onIndexChange, onClose }: GalleryLightboxProps) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [direction, setDirection] = useState(0);
  const total = items.length;
  const safeIndex = Math.min(index, total - 1);
  const item = items[safeIndex];

  // Tracks the latest index so rapid key presses each advance one frame.
  const indexRef = useRef(safeIndex);
  useLayoutEffect(() => {
    indexRef.current = safeIndex;
  }, [safeIndex]);

  const go = useCallback(
    (step: number) => {
      if (total < 2) return;
      const next = (indexRef.current + step + total) % total;
      indexRef.current = next;
      setDirection(step);
      onIndexChange(next);
    },
    [total, onIndexChange],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const onDragEnd = (_event: unknown, info: PanInfo) => {
    if (info.offset.x < -70 || info.velocity.x < -500) go(1);
    else if (info.offset.x > 70 || info.velocity.x > 500) go(-1);
  };

  if (!item) return null;
  const photo = images[item.image];
  const alt = photoAlt(t, item.image);
  const distance = reduceMotion ? 0 : 90;

  return (
    <div className="lightbox">
      <motion.div
        className="lightbox__top"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        <p className="lightbox__counter">
          <span aria-hidden="true">
            {pad(safeIndex + 1)} <span className="lightbox__counter-sep">/</span> {pad(total)}
          </span>
          <span className="sr-only" aria-live="polite">
            {format(t.a11y.imageCounter, { current: safeIndex + 1, total })}
          </span>
        </p>
        <button type="button" className="modal-close" onClick={onClose} aria-label={t.a11y.close} data-autofocus>
          <CloseIcon />
        </button>
      </motion.div>

      <div className="lightbox__stage">
        <AnimatePresence initial={false} custom={direction} mode="popLayout" propagate>
          <motion.figure
            key={item.image}
            className="lightbox__figure"
            custom={direction}
            variants={{
              enter: (step: number) => ({ opacity: 0, x: step * distance }),
              center: { opacity: 1, x: 0 },
              exit: (step: number) => ({ opacity: 0, x: step * -distance }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.75, ease: EASE_OUT }}
            drag={total > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.22}
            onDragEnd={onDragEnd}
          >
            <motion.div
              className="lightbox__image"
              layoutId={safeIndex === sharedIndex ? `gallery-photo-${item.image}` : undefined}
              style={{ ['--ratio' as string]: photo.ratio }}
              transition={{ duration: 0.9, ease: EASE_OUT }}
            >
              {/* The tile's cached photograph fills the frame at once; the full-size file fades in over it. */}
              <Picture photo={photo} alt="" sizes="(min-width: 768px) 45vw, 50vw" priority />
              <Picture photo={photo} alt={alt} sizes="100vw" widths={[1080, 1440, 1920, 2560]} priority />
            </motion.div>
            <figcaption className="lightbox__caption">
              <span className="lightbox__category">{t.gallery.filters[item.category]}</span>
              <span className="sr-only">: </span>
              <span>{alt}</span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {total > 1 ? (
        <motion.div
          className="lightbox__controls"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={() => go(-1)} aria-label={t.a11y.previousImage}>
            <ChevronLeft />
          </button>
          <button type="button" className="lightbox__nav lightbox__nav--next" onClick={() => go(1)} aria-label={t.a11y.nextImage}>
            <ChevronRight />
          </button>
        </motion.div>
      ) : null}
    </div>
  );
}
