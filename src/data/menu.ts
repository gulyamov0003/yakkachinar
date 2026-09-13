import type { DishCategory, DishId } from './translations';

export interface Dish {
  id: DishId;
  category: DishCategory;
}

/**
 * Dishes photographed at Yakkachinar. Names and descriptions live in translations.ts.
 * No prices or ingredients are listed on purpose — the restaurant's current menu is the source of truth.
 * Order matters: it drives the editorial layout (feature, pair, trio, wide + pair).
 */
export const DISHES: readonly Dish[] = [
  { id: 'cheesePlate', category: 'coldStarters' },
  { id: 'khachapuri', category: 'bakery' },
  { id: 'shashlik', category: 'grill' },
  { id: 'cheeseSticks', category: 'hotStarters' },
  { id: 'greenBorscht', category: 'soups' },
  { id: 'olivier', category: 'salads' },
  { id: 'meatPlatter', category: 'coldStarters' },
  { id: 'chickenSteak', category: 'mains' },
  { id: 'pickles', category: 'coldStarters' },
];
