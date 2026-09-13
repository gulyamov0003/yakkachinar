import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { GalleryFilter } from '../data/translations';

export interface LightboxState {
  /** Index within the currently filtered gallery. */
  index: number;
  /** Index whose tile morphs into the viewer (-1 once the visitor navigates). */
  shared: number;
}

interface UIValue {
  reservationOpen: boolean;
  openReservation: () => void;
  closeReservation: () => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  galleryFilter: GalleryFilter;
  setGalleryFilter: (filter: GalleryFilter) => void;
  lightbox: LightboxState | null;
  setLightbox: (state: LightboxState | null) => void;
  /** Open the full-screen viewer on a gallery category from anywhere on the page. */
  openGallery: (filter: GalleryFilter) => void;
  /** True once the preloader has lifted — the hero sequence and navigation start from here. */
  introReady: boolean;
  setIntroReady: (ready: boolean) => void;
}

const UIContext = createContext<UIValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [reservationOpen, setReservationOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState<GalleryFilter>('all');
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [introReady, setIntroReady] = useState(false);

  const openReservation = useCallback(() => {
    setMenuOpen(false);
    setLightbox(null);
    setReservationOpen(true);
  }, []);
  const closeReservation = useCallback(() => setReservationOpen(false), []);
  const openGallery = useCallback((filter: GalleryFilter) => {
    setGalleryFilter(filter);
    setLightbox({ index: 0, shared: -1 });
  }, []);

  const value = useMemo<UIValue>(
    () => ({
      reservationOpen,
      openReservation,
      closeReservation,
      menuOpen,
      setMenuOpen,
      galleryFilter,
      setGalleryFilter,
      lightbox,
      setLightbox,
      openGallery,
      introReady,
      setIntroReady,
    }),
    [reservationOpen, openReservation, closeReservation, menuOpen, galleryFilter, lightbox, openGallery, introReady],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIValue {
  const value = useContext(UIContext);
  if (!value) throw new Error('useUI must be used inside <UIProvider>');
  return value;
}
