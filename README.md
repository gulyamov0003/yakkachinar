# Yakkachinar — website concept

A cinematic, trilingual (Тоҷикӣ · Русский · English) website concept for **Yakkachinar / Яккачинар**, a restaurant and entertainment venue in Dushanbe, Tajikistan.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # translation audit → type check → production build in dist/
npm run preview    # serve the production build on http://localhost:4173
npm run i18n:check # translation audit only
npm run logo       # rebuild public/brand/* and the favicons from the official logo (Python 3 + Pillow)
```

Stack: Vite 8 · React 19 · TypeScript 7 · Motion (animation) · Lenis (smooth scroll) · Three.js (lazy-loaded 3D logo medallion). Fonts are self-hosted through Fontsource: **Cormorant** (display) and **Inter Tight** (UI/body) — both verified to contain the Tajik letters Ғ Ӣ Қ Ӯ Ҳ Ҷ.

## Where things live

```
src/
  data/
    translations.ts   every visible string, in tj / ru / en (typed; a missing key fails the build)
    restaurant.ts     verified facts: rating, phone, Plus Code, Instagram, map links, review quotes
    menu.ts           dishes shown in "Signature Selection" and their categories
    gallery.ts        gallery frames and categories
    images.ts         photography registry (one entry per image slot)
    navigation.ts     navigation order
  i18n/               language provider (detection, switching, scroll preservation) and typesetting
  components/         Navbar, BrandLogo, LanguageSwitcher, PremiumButton, CustomCursor, ThreeScene,
                      LogoMedallion, Modal, …
  sections/           Hero, Experience, MenuShowcase, Gallery, Entertainment, Events, Reviews,
                      Instagram, Location, ReservationCTA, Footer
  lib/                motion tokens, scroll helpers, image URLs, preloader
assets/brand/logo_yakkachinar.jpg   the official logo exactly as supplied (source for npm run logo)
scripts/build-logo.py           isolates the circular crest and builds every logo file
scripts/check-translations.ts   translation audit
design-system/yakkachinar/MASTER.md   design tokens and rules
```

## The logo

The brand mark is the official Yakkachinar crest, used exactly as supplied — it is never redrawn. `npm run logo` only cuts the circle out of the square source image and resamples it: transparent WebP sizes for the interface, a gold-only mask for light sweeps, colour / roughness-metalness / relief maps for the 3D medallion, and the favicons. It appears in the navigation, mobile menu, preloader, hero (WebGL medallion on desktop, CSS medallion on touch screens), reservation dialog, footer, and as faint watermarks in the mobile menu and reviews.

The supplied file is 150 × 150 px, so the largest renderings (the hero medallion, the watermarks) are upscaled and slightly soft; replacing `assets/brand/logo_yakkachinar.jpg` with a larger export of the same artwork and running `npm run logo` sharpens every use at once. If the replacement is framed differently, re-measure `CENTER` and `RADIUS` at the top of the script.

## Editing text

All copy is in `src/data/translations.ts`. Each language is edited independently; headlines use `titleLines` so every language can choose its own line breaks. `npm run i18n:check` fails on missing or empty strings, mismatched `{placeholders}`, Latin text inside Tajik/Russian copy, Cyrillic inside English copy, Russian-only letters (щ ц ы ь) in Tajik, or Tajik-only letters in Russian. At runtime, an empty string shows as a visible `⟦lang:path⟧` marker instead of silently falling back to another language.

## Replacing the placeholder photographs

**Every photo currently on the site is a temporary, royalty-free Unsplash placeholder** — none of them show Yakkachinar. To use the restaurant's own photography:

1. Put the file in `public/images/` (landscape ~2400px wide, WebP or AVIF).
2. In `src/data/images.ts`, replace the entry, e.g. `hero: { src: '/images/hero.webp', ratio: 1.5 }`. Keep the key. For several pre-generated widths use `src: '/images/hero-{w}.webp'` with files for 480, 720, 1080, 1440, 1920 and 2560.
3. Update that photo's alt text in `translations.ts` → `photos` (dish photos use the dish name).
4. For the hero, update the `<link rel="preload">` in `index.html`.

## Facts policy

Only supplied facts are shown: Google rating 4.5 (840+ reviews), 100–250 TJS per person, phone, Plus Code HQ44+GV, Instagram @yakkachinar.tj (~145K followers), open every day, live music and entertainment programmes, weddings and celebrations. Opening hours, prices per dish, ingredients, capacity, performers, awards and testimonials are intentionally absent. Verified guest quotes can be added to `restaurant.reviewQuotes`; the Reviews section shows them only when the list is not empty. Reservations are handled by phone — no booking system is implied.

## Accessibility & motion

Semantic landmarks, skip link, keyboard-operable language switcher, menus and dialogs (focus trap, Escape, focus return), visible focus rings, translated accessible labels, `lang` attributes (Tajik = `tg`). With `prefers-reduced-motion`, parallax, pinned scroll scenes, smooth scrolling and entrance animations are disabled and content is shown immediately. Add `?motion=reduce` to the URL to preview that mode (handy for accessibility reviews and static screenshots); `?lang=tj`, `?lang=ru` or `?lang=en` opens a specific language. The custom cursor, magnetic buttons and WebGL logo medallion are desktop-only; touch screens get a lightweight CSS medallion. With reduced motion the logo preloader is skipped and the medallion is a still frame.

## Implementation notes

- Scroll-linked `opacity` and `clip-path` use function transforms (`useTransform(progress, fn)`). With array mappings Motion hands them to a native ViewTimeline, which reported wrong progress inside the sticky entertainment scene.
- Image reveals animate an inner mask rather than the observed element: IntersectionObserver treats a fully clipped element as invisible, so a `whileInView` on it would never fire.
- Counters lay out their final value invisibly underneath the animated digits, so counting never shifts the layout.
