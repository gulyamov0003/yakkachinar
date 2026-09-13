import type { Language } from './translations';

/**
 * Verified business facts only. Anything not listed here (opening hours, capacity,
 * prices per dish, performers, awards) is intentionally absent from the site.
 */

export interface ReviewQuote {
  /** Guest name exactly as published with the original review. */
  author: string;
  /** Link to the original public review. */
  sourceUrl: string;
  /** The quote in all three languages; keep the original wording in its source language. */
  text: Record<Language, string>;
}

const PLUS_CODE = 'HQ44+GV';
const MAP_QUERY = encodeURIComponent(`${PLUS_CODE}, Dushanbe, Tajikistan`);

export const restaurant = {
  name: 'Yakkachinar',
  rating: 4.5,
  ratingMax: 5,
  /** Displayed as "840+". */
  reviewCount: 840,
  /** Approximate Instagram audience, displayed as "145K+". */
  instagramFollowers: 145_000,
  priceRange: { min: 100, max: 250, currency: 'TJS' },
  phone: {
    display: '+992 00 060 0400',
    href: 'tel:+992000600400',
  },
  instagram: {
    handle: '@yakkachinar.tj',
    url: 'https://www.instagram.com/yakkachinar.tj/',
  },
  plusCode: PLUS_CODE,
  maps: {
    placeUrl: `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`,
    reviewsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Yakkachinar Dushanbe')}`,
    embedUrl: (hl: string) => `https://www.google.com/maps?q=${MAP_QUERY}&z=16&hl=${hl}&output=embed`,
  },
  /**
   * Verified guest quotes. Leave empty until the owner supplies real, attributable reviews —
   * the Reviews section shows rating statistics only while this list is empty.
   */
  reviewQuotes: [] as ReviewQuote[],
} as const;
