import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useI18n } from '../i18n/LanguageProvider';
import { format } from '../i18n/format';
import { useUI, type LightboxState } from '../context/UIContext';
import { GALLERY } from '../data/gallery';
import { images, photoAlt } from '../data/images';
import type { GalleryFilter } from '../data/translations';
import { EASE_OUT } from '../lib/motion';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { Picture } from '../components/Picture';
import { Modal } from '../components/Modal';
import { GalleryLightbox } from '../components/GalleryLightbox';
import './Gallery.css';

const FILTERS: readonly GalleryFilter[] = ['all', 'food', 'atmosphere', 'moments'];

/** Asymmetric editorial rhythm, adapted to how many frames the current filter shows. */
function layoutClass(index: number, count: number): string {
  if (count === 4) return ['g-7x2', 'g-5', 'g-5', 'g-12'][index];
  if (count === 5) return ['g-7x2', 'g-5', 'g-5', 'g-6', 'g-6'][index];
  const pattern = ['g-7x2', 'g-5', 'g-5', 'g-4', 'g-4', 'g-4', 'g-5', 'g-7x2', 'g-5', 'g-6', 'g-3', 'g-3'];
  return pattern[index % pattern.length];
}

export function Gallery() {
  const { t } = useI18n();
  const { galleryFilter, setGalleryFilter, lightbox, setLightbox } = useUI();
  const reduceMotion = useReducedMotion();

  // Keep the last viewer state while the dialog animates out.
  const [lastLightbox, setLastLightbox] = useState<LightboxState | null>(lightbox);
  if (lightbox && lightbox !== lastLightbox) setLastLightbox(lightbox);
  const shownLightbox = lightbox ?? lastLightbox;

  const items = useMemo(
    () => (galleryFilter === 'all' ? GALLERY : GALLERY.filter((item) => item.category === galleryFilter)),
    [galleryFilter],
  );

  const closeViewer = useCallback(() => setLightbox(null), [setLightbox]);
  const changeIndex = useCallback((index: number) => setLightbox({ index, shared: -1 }), [setLightbox]);

  return (
    <section id="gallery" data-nav="gallery" className="section gallery" aria-labelledby="gallery-title">
      <div className="container">
        <div className="gallery__header">
          <SectionHeading index="03" eyebrow={t.gallery.eyebrow} lines={t.gallery.titleLines} accent={1} id="gallery-title" />
          <Reveal className="gallery__side" delay={0.1}>
            <p className="lead">{t.gallery.lead}</p>
            <div className="gallery__filters" role="group" aria-label={t.gallery.filterLabel}>
              {FILTERS.map((filter) => {
                const active = filter === galleryFilter;
                return (
                  <button
                    key={filter}
                    type="button"
                    className={`gallery__filter${active ? ' is-active' : ''}`}
                    aria-pressed={active}
                    onClick={() => setGalleryFilter(filter)}
                  >
                    <span className="t-fade">{t.gallery.filters[filter]}</span>
                    {active ? (
                      <motion.span layoutId="gallery-filter-line" className="gallery__filter-line" transition={{ duration: 0.6, ease: EASE_OUT }} />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        <LayoutGroup id="gallery">
          <Reveal y={48} amount={0.08}>
            <motion.ul layout className="gallery__grid">
              <AnimatePresence mode="popLayout" initial={false}>
                {items.map((item, index) => {
                  const alt = photoAlt(t, item.image);
                  return (
                    <motion.li
                      key={item.image}
                      layout
                      className={`gallery__item ${layoutClass(index, items.length)}`}
                      initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.8, ease: EASE_OUT }}
                    >
                      <button
                        type="button"
                        className="gallery__button"
                        data-cursor="explore"
                        aria-haspopup="dialog"
                        aria-label={format(t.a11y.openPhoto, { title: alt })}
                        onClick={() => setLightbox({ index, shared: index })}
                      >
                        <motion.span layoutId={`gallery-photo-${item.image}`} className="gallery__photo" transition={{ duration: 0.9, ease: EASE_OUT }}>
                          <Picture photo={images[item.image]} alt="" sizes="(min-width: 768px) 45vw, 50vw" />
                        </motion.span>
                        <span className="gallery__tag" aria-hidden="true">
                          {t.gallery.filters[item.category]}
                        </span>
                      </button>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </motion.ul>
          </Reveal>

          <Modal open={lightbox !== null} onClose={closeViewer} label={t.a11y.galleryDialog} className="modal--fullscreen">
            {shownLightbox ? (
              <GalleryLightbox
                items={items}
                index={shownLightbox.index}
                sharedIndex={shownLightbox.shared}
                onIndexChange={changeIndex}
                onClose={closeViewer}
              />
            ) : null}
          </Modal>
        </LayoutGroup>
      </div>
    </section>
  );
}
