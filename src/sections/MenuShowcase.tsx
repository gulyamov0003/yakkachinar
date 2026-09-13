import { useRef, useState, type PointerEvent } from 'react';
import { LayoutGroup, motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useI18n } from '../i18n/LanguageProvider';
import { format } from '../i18n/format';
import { useUI } from '../context/UIContext';
import { DISHES, type Dish } from '../data/menu';
import { images } from '../data/images';
import type { DishId } from '../data/translations';
import { EASE_OUT } from '../lib/motion';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { Picture } from '../components/Picture';
import { Modal } from '../components/Modal';
import { PremiumButton } from '../components/PremiumButton';
import { ArrowUpRight, CloseIcon } from '../components/Icons';
import './MenuShowcase.css';

export function MenuShowcase() {
  const { t } = useI18n();
  const [activeId, setActiveId] = useState<DishId>(DISHES[0].id);
  const [open, setOpen] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  const openDish = (id: DishId) => {
    setActiveId(id);
    setOpen(true);
  };

  // Mobile rail progress, written straight to the DOM to avoid re-renders while swiping.
  const onRailScroll = () => {
    const rail = railRef.current;
    const bar = progressRef.current;
    if (!rail || !bar) return;
    const max = rail.scrollWidth - rail.clientWidth;
    bar.style.transform = `scaleX(${max > 0 ? Math.max(0.08, rail.scrollLeft / max) : 1})`;
  };

  const active = DISHES.find((dish) => dish.id === activeId) ?? DISHES[0];

  return (
    <section id="menu" data-nav="menu" className="section menu" aria-labelledby="menu-title">
      <div className="container">
        <div className="menu__header">
          <SectionHeading index="02" eyebrow={t.menu.eyebrow} lines={t.menu.titleLines} accent={1} id="menu-title" />
          <Reveal className="menu__intro" delay={0.1}>
            <p className="lead">{t.menu.lead}</p>
            <p className="menu__note">{t.menu.note}</p>
          </Reveal>
        </div>

        <LayoutGroup id="menu">
          <div ref={railRef} className="menu__grid" onScroll={onRailScroll}>
            {DISHES.map((dish, index) => (
              <DishCard key={dish.id} dish={dish} index={index} onOpen={openDish} />
            ))}
          </div>
          <div className="menu__progress" aria-hidden="true">
            <span ref={progressRef} className="menu__progress-bar" />
          </div>

          <DishModal dish={active} open={open} onClose={() => setOpen(false)} />
        </LayoutGroup>
      </div>
    </section>
  );
}

function DishCard({ dish, index, onOpen }: { dish: Dish; index: number; onOpen: (id: DishId) => void }) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const copy = t.menu.dishes[dish.id];

  const tilt = (event: PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty('--tilt-x', `${(-y * 2.5).toFixed(2)}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${(x * 3).toFixed(2)}deg`);
  };
  const resetTilt = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <motion.article
      className={`dish dish--${index + 1}`}
      onPointerMove={tilt}
      onPointerLeave={resetTilt}
      initial={reduceMotion ? false : { opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.2, ease: EASE_OUT, delay: (index % 3) * 0.08 }}
    >
      <div className="dish__media media-frame" data-cursor="view">
        <motion.div layoutId={`dish-photo-${dish.id}`} className="dish__photo" transition={{ duration: 0.9, ease: EASE_OUT }}>
          <Picture photo={images[dish.id]} alt="" sizes="(min-width: 1024px) 42vw, (min-width: 768px) 46vw, 80vw" />
        </motion.div>
        <span className="dish__arrow" aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </div>
      <div className="dish__body">
        <p className="dish__meta">
          <span className="dish__index">{String(index + 1).padStart(2, '0')}</span>
          <span className="dish__category">{t.menu.categories[dish.category]}</span>
        </p>
        <h3 className="dish__name">
          <button
            type="button"
            className="dish__button"
            onClick={() => onOpen(dish.id)}
            aria-haspopup="dialog"
            aria-label={format(t.a11y.openDish, { title: copy.name })}
          >
            {copy.name}
          </button>
        </h3>
        <p className="dish__description">{copy.description}</p>
      </div>
    </motion.article>
  );
}

function DishModal({ dish, open, onClose }: { dish: Dish; open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const { openReservation } = useUI();
  const reduceMotion = useReducedMotion();
  const copy = t.menu.dishes[dish.id];

  const reserve = () => {
    onClose();
    openReservation();
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="dish-title">
      <div className="dish-modal">
        <button type="button" className="modal-close dish-modal__close" onClick={onClose} aria-label={t.a11y.close} data-autofocus>
          <CloseIcon />
        </button>
        <motion.div layoutId={`dish-photo-${dish.id}`} className="dish-modal__media" transition={{ duration: 0.9, ease: EASE_OUT }}>
          {/* The card's cached photograph first, so the expanding frame is never empty. */}
          <Picture photo={images[dish.id]} alt="" sizes="(min-width: 1024px) 42vw, (min-width: 768px) 46vw, 80vw" priority />
          <Picture photo={images[dish.id]} alt={copy.name} sizes="(min-width: 900px) 55vw, 100vw" priority />
        </motion.div>
        <motion.div
          className="dish-modal__body"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12, transition: { duration: 0.3 } }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.25 }}
        >
          <p className="eyebrow">{t.menu.categories[dish.category]}</p>
          <h2 id="dish-title" className="dish-modal__title display">
            {copy.name}
          </h2>
          <p className="dish-modal__description">{copy.description}</p>
          <p className="dish-modal__note">{t.menu.note}</p>
          <PremiumButton leadingIcon="calendar" onClick={reserve} hasPopup>
            {t.actions.reserve}
          </PremiumButton>
        </motion.div>
      </div>
    </Modal>
  );
}
