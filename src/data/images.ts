import type { Photo } from '../lib/image';
import type { DishId, ImageId, PhotoKey, Translation } from './translations';

/**
 * Photography registry — one entry per image slot used on the site.
 *
 * ⚠ Every entry below is a TEMPORARY royalty-free placeholder from Unsplash (free licence),
 * chosen to match the art direction until Yakkachinar's own photographs are supplied.
 * To use a real photo: add it to /public/images (ideally 2400px wide WebP/AVIF) and replace
 * the entry with `{ src: '/images/hero.webp', ratio: 1.5 }` — keep the key, and update the
 * matching alt text in translations.ts (`photos`), or the dish name for dish photos.
 */
const placeholder = (id: string, ratio: number, focus?: string): Photo => ({
  src: `https://images.unsplash.com/${id}`,
  ratio,
  focus,
  placeholder: true,
});

export const images: Record<ImageId, Photo> = {
  // Atmosphere & interiors
  hero: placeholder('photo-1552960226-639240203497', 1.5, '50% 45%'),
  experienceMain: placeholder('photo-1767277680127-dc94441d576c', 0.75),
  experienceDetail: placeholder('photo-1767050190883-29d644fa5b99', 0.75),
  lounge: placeholder('photo-1748551204300-f227d5af350f', 1.5),
  chandelier: placeholder('photo-1657763889328-094813fd2cbc', 0.667),
  banquet: placeholder('photo-1559753217-bbb7d4ffc9d5', 1.331),
  tableDetail: placeholder('photo-1782686223394-af72f7de562c', 0.8),
  reservation: placeholder('photo-1781955781178-6ea29c66e860', 1.5),

  // Entertainment & moments
  entertainment: placeholder('photo-1579539760267-b2e78d9d735e', 1.5, '80% 72%'),
  stage: placeholder('photo-1415201364774-f6f0bb35f28f', 1.5),
  toast: placeholder('photo-1584718068111-45d34a4784d8', 1.5),
  dinner: placeholder('photo-1778694277039-5cbf0b9a1fcf', 1.5),

  // Events
  weddings: placeholder('photo-1780542900375-0cf459e38fbb', 1.499),
  celebrations: placeholder('photo-1576349548941-e889fef3747b', 1.5),
  privateEvents: placeholder('photo-1731045972288-ec01422bc002', 1.5),
  specialOccasions: placeholder('photo-1782686197550-879b6fcb51b1', 0.667, '50% 40%'),
  gatherings: placeholder('photo-1777576507185-07fcd1d7a29c', 1.5),

  // Dishes
  cheesePlate: placeholder('photo-1589881133595-a3c085cb731d', 0.8),
  khachapuri: placeholder('photo-1746185601009-3ddac4b23121', 1.511),
  cheeseSticks: placeholder('photo-1778449665117-2c607bbc7415', 1.5),
  chickenSteak: placeholder('photo-1784902540562-9b048bde9ace', 1.5),
  olivier: placeholder('photo-1757715375767-35ddb5ca9118', 1.5),
  meatPlatter: placeholder('photo-1678572823447-45fc146df43c', 1.5),
  pickles: placeholder('photo-1562346816-9d0bdd559ec1', 0.8),
  greenBorscht: placeholder('photo-1613478881379-175a54184a27', 1.505),
  shashlik: placeholder('photo-1747253255646-3bffa4565a7a', 1.5),
};

/** Localised alternative text for any image slot. Dish photos use the dish name. */
export function photoAlt(t: Translation, id: ImageId): string {
  return id in t.menu.dishes ? t.menu.dishes[id as DishId].name : t.photos[id as PhotoKey];
}
