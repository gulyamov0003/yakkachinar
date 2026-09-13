import type { GalleryFilter, ImageId } from './translations';

export type GalleryCategory = Exclude<GalleryFilter, 'all'>;

export interface GalleryItem {
  image: ImageId;
  category: GalleryCategory;
}

/** Twelve frames, four per category, interleaved so the "All" view alternates rhythmically. */
export const GALLERY: readonly GalleryItem[] = [
  { image: 'lounge', category: 'atmosphere' },
  { image: 'khachapuri', category: 'food' },
  { image: 'toast', category: 'moments' },
  { image: 'chandelier', category: 'atmosphere' },
  { image: 'shashlik', category: 'food' },
  { image: 'dinner', category: 'moments' },
  { image: 'stage', category: 'moments' },
  { image: 'banquet', category: 'atmosphere' },
  { image: 'cheesePlate', category: 'food' },
  { image: 'tableDetail', category: 'atmosphere' },
  { image: 'meatPlatter', category: 'food' },
  { image: 'celebrations', category: 'moments' },
];
