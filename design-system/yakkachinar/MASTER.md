# Yakkachinar — Design System (Master)

Global source of truth for UI decisions. Page-specific overrides go in `pages/<page>.md` and win over this file (none yet).

Built with the **ui-ux-pro-max** skill as a starting point, then art-directed to the client brief (dark luxury hospitality). Kept from the skill: premium dark + gold palette logic, the Cormorant "Luxury Serif" pairing idea, UX guidance (reduced motion, text reflow, image optimisation, lazy loading) and the pre-delivery checklist. Rejected as off-brief: the "Liquid Glass" style and feature-grid landing pattern.

## Direction

Dark · cinematic · warm · editorial · VIP · modern Central Asian. Photography leads; gold is an accent, never a surface. No neon, no glassmorphism panels, no bounce.

## Color tokens (`src/styles/global.css`)

| Token | Value | Use |
|---|---|---|
| `--ink-950` | `#080706` | deepest background, hero base |
| `--ink-900` | `#0C0B09` | page background |
| `--ink-850` / `--ink-800` / `--ink-700` | `#110F0C` / `#16130F` / `#262019` | surfaces, dialogs |
| `--espresso` | `#1B1511` | menu band |
| `--wine-900` / `--wine-800` | `#1A0A0D` / `#2A0F15` | burgundy glows |
| `--ivory` | `#F2EBDF` | primary text (~16:1 on ink-900) |
| `--ivory-soft` | ivory @ 80% | body copy |
| `--ivory-muted` | ivory @ 62% | labels, notes (≥ 4.5:1) |
| `--gold` | `#C9A96E` | active nav, rules, icons, CTA details |
| `--gold-bright` | `#E7D2A4` | italic accent lines, hover |
| `--gold-deep` | `#9C7C48` | icon on ivory buttons |
| `--line` / `--line-strong` | ivory @ 12% / 26% | hairlines |

## Typography

- **Display:** Cormorant (variable 300–700, italic) — headlines, wordmark, numerals.
- **UI / body:** Inter Tight (variable) — body, navigation, buttons, labels.
- Both self-hosted via Fontsource and verified in the browser to include Tajik Cyrillic (Ғ Ӣ Қ Ӯ Ҳ Ҷ). Manrope was rejected because it lacks those letters.
- Fluid scale: `--fs-display`, `--fs-h2`, `--fs-h3`, `--fs-lead`; body 16px / 1.7; labels 12px uppercase, +0.2em tracking.
- Headlines use per-language line breaks (`titleLines`), `text-wrap: balance`, and reveal masks with extra room for descenders and Tajik macrons.
- Wordmarks and the location city name are sized with container query units (`cqi`) so they fill their column exactly and never wrap, in any language.
- Editorial typesetting: one- and two-letter words bind to the next word; numbers bind to units; Russian decimal comma (4,5) in TJ/RU.

## Layout

- Container: `min(100% − 2 × gutter, 1600px)`, gutter `clamp(1.25rem, 4.2vw, 4.75rem)`.
- Section rhythm: `clamp(5.5rem, 9vw, 9.5rem)`.
- No fixed heights around text; grid tracks use `minmax(0, 1fr)`.
- Verified without overflow at 320, 375, 430, 768, 1024, 1280, 1440, 1920 in TJ, RU and EN.
- Full desktop navigation from 1280px (tightened tracking up to 1499px); below that a full-screen menu.

## Components

- **PremiumButton** — one physical control for every CTA. Solid: warm ivory lit from above, gold rises from below on hover. Outline: smoked glass with a gradient gold hairline. Hover lifts the surface 3px, deepens the shadow, brightens the frame and passes one light sweep; press sinks it 1px. Magnetic pull ≤ 6px × 4px on fine pointers only. Icons carry meaning: calendar = reserve, phone = call, navigation arrow = directions, Instagram = profile, arrow = explore, arrow-up-right = opens another site. At ≤ 400px (≤ 480px inside the reservation dialog) padding and tracking tighten and icon-led buttons drop the trailing arrow, so every label stays on one line from 360px in all three languages.
- **Interactive details** — gold hairline previews under inactive nav links, language codes and gallery filters (the active state is always stronger); round glass close / previous / next controls that lift, turn or nudge their icon and press; photographs brighten slightly and scale ≤ 5% on hover; cards lift 4px with a tilt of at most 3°.
- LanguageSwitcher (compact TJ/RU/EN with gold underline; pill variant with native names) · Navbar (logo + wordmark; transparent → blurred ink with hairline; scrollspy dot) · MobileMenu (circular clip reveal, logo watermark) · CustomCursor (VIEW / EXPLORE labels) · Modal (focus trap, inert background, scroll lock) · GalleryLightbox (expands from the tile, cached tile shown instantly, arrows, keys, swipe) · SectionHeading (index, drawn gold rule, label, masked title lines) · ImageReveal · RevealLines · Counter · Stars · Marquee · BrandLogo · LogoMedallion · ThreeScene.

## Motion

- Easing `cubic-bezier(0.16, 1, 0.3, 1)` and `cubic-bezier(0.22, 1, 0.36, 1)`; no overshoot, no bounce, nothing flashes.
- 0.35s micro-interactions · 0.8–1.3s reveals · 1.6–2.6s cinematic moments.
- Preloader: the logo on ink with one gold light sweep, lifted after ~1s (hard cap 1.3s); skipped with reduced motion.
- Hero depth, back to front: photograph → shade → grain → copy → logo medallion → navigation, each drifting a different distance with the pointer and on scroll.
- `prefers-reduced-motion`: no parallax, no pinned scenes, no smooth-scroll, no preloader, final states shown immediately.

## Logo

The official Yakkachinar crest (black enamel, gold crown, laurel and monogram) is the only brand mark. Use the files generated by `npm run logo` from `assets/brand/logo_yakkachinar.jpg`; never redraw, recolour, stretch or crop into it, and never place it on a square background. Use it where the brand is meant — navigation, preloader, hero medallion, reservation dialog, footer — plus at most two faint watermarks; decorative separators are ornaments, not logos. Its light sweep is masked to the gold artwork and plays once on arrival (a slow loop only in the hero). In 3D it stays a medallion: slow float, a gentle tilt of at most ~14° and a few degrees of drift, never a spin.

## Imagery

Full-bleed cinematic crops, dark gradients and vignette; registry in `src/data/images.ts`. Current photos are Unsplash placeholders until Yakkachinar supplies its own.

## Content rules

Only verified facts. No invented hours, dish prices, ingredients, capacity, performers, awards or testimonials. Reservations by phone.

## Pre-delivery checklist

- SVG icons only, no emoji
- Visible focus states; dialogs, menus and language switcher keyboard-operable
- Text contrast ≥ 4.5:1
- `prefers-reduced-motion` respected
- No horizontal scroll 320–1920 px in all three languages
- Touch targets ≥ 44px
