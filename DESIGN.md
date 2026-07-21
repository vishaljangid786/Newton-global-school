# Newton Global School — "Newton Modern" Design Specification

A complete, self-contained spec of the site's visual system. Everything needed
to implement this design is in this file — exact values, component blueprints,
and rules. Stack assumption: Tailwind CSS v4 (tokens via `@theme`), but the
values are framework-agnostic.

---

## 1. Design personality

Clean, confident, modern edtech. White base, deep-navy brand, amber as the
single energy color. Big friendly type, soft depth (layered shadows + blur),
generously rounded surfaces, gradients used sparingly and deliberately.
Trustworthy-institutional, but warm — this is a school for children, not a
bank.

**Never:** cream/beige backgrounds, serif display fonts, monospace labels,
sharp 2–4px corners, hairline-only cards, solid flat color bands, top utility
bars above the nav.

---

## 2. Design tokens

### 2.1 Color

| Token | Hex | Role |
|---|---|---|
| `primary` | `#1E3A8A` | Navy — brand, links, active states, solid buttons |
| `primary-dark` | `#16276B` | Footer, gradient stop, hover deepening |
| `primary-soft` | `#EEF3FF` | Tinted washes — eyebrow pills, active nav, icon wells, chips |
| `accent` | `#F59E0B` | Amber — CTAs, badges, glow accents, focus rings |
| `accent-ink` | `#92400E` | Amber darkened for text on white (≥4.5:1 contrast) |
| `bg` | `#FFFFFF` | Page base |
| `bg-alt` | `#F5F7FB` | Cool mist — alternating sections, page mastheads |
| `text` | `#0F172A` | Ink (slate-900) |
| `text-muted` | `#5B6577` | Secondary text, cool gray |
| `border` | `#E5E9F2` | Input borders |
| `hairline` | `#EEF1F7` | Lighter rules/dividers |
| `success` | `#15803D` | Success states |
| `error` | `#B91C1C` | Error states |

**Brand gradient** (the signature surface — hero, stats band, CTA card,
primary buttons, stepper markers):

```css
--gradient-brand: linear-gradient(115deg, #16276B 0%, #1E3A8A 55%, #3452B4 100%);
```

Amber is never used as a background wash for whole sections — only as pills
(`accent/15`), glows (`accent/25` blurred), and the solid CTA button.

### 2.2 Typography

| Role | Font | Weight | Details |
|---|---|---|---|
| Headings + numerals | **Plus Jakarta Sans** (variable) | 700 | `letter-spacing: -0.02em` (h1: `-0.025em`), `line-height: 1.12` |
| Body | **Inter** | 400/500/600 | `line-height: 1.65` |
| Monospace | none on the public site | — | (system mono only inside admin textareas) |

Both from Google Fonts, self-hosted (next/font). Fallback stack:
`system-ui, sans-serif`.

Type scale (rem):
- Display h1 (home hero): `2.5` mobile → `4` desktop, `line-height 1.05`
- Page h1 (mastheads): `2.125` → `3.375`, `line-height 1.06`
- Section h2: `1.75` → `2.375`, `line-height 1.1`
- Card h3: `1.125`–`1.25`, weight 600–700
- Body: `1`; small/meta: `0.875` / `0.75`

**Eyebrow label** (section overlines, badges above titles): `0.75rem`,
weight 600, uppercase, `letter-spacing: 0.08em`, Plus Jakarta Sans — always
inside a tinted pill: `bg primary-soft`, `text primary`, `padding 8px 14px`,
fully rounded, with a 6px amber dot before the text.

### 2.3 Shape & depth

| Token | Value | Used on |
|---|---|---|
| `radius-card` | `16px` | Cards, panels, images |
| `radius-lg` | `24px` | CTA card, gallery tiles, hero panels |
| `radius-pill` | `999px` | Buttons, chips, badges, nav states, avatars |
| input radius | `12px` | Form fields, selects |
| `shadow-card` | `0 1px 2px rgba(15,23,42,.06), 0 8px 24px -12px rgba(15,23,42,.12)` | Resting cards |
| `shadow-card-hover` | `0 24px 48px -20px rgba(30,58,138,.25)` | Lifted cards (navy-tinted) |
| button glow (navy) | `0 10px 24px -10px rgba(30,58,138,.55)` | Primary buttons |
| button glow (amber) | `0 10px 24px -10px rgba(245,158,11,.55)` | Accent buttons |

Structure comes from **depth, not borders**: cards use a whisper border
`rgba(0,0,0,0.05)` + `shadow-card`. Never a visible 1px gray frame as the
primary structure.

**Glow orbs** — the decorative motif on dark/gradient surfaces: absolutely
positioned circles, 256–448px, `bg accent/25` or `white/10`, `blur(64px)`
(`blur-3xl`), overflowing the container edges, `pointer-events: none`,
`aria-hidden`.

**Glass** — `background: rgba(255,255,255,0.7)` + `backdrop-blur(24px)` for
the sticky header; `rgba(255,255,255,0.1)` + border `white/15` +
`backdrop-blur(4px)` for chips/cards on dark gradients.

### 2.4 Layout

- Content container: `max-width 1200px`, `padding-inline 16px`, centered.
- Section rhythm: `padding-block 40px` mobile → `64px` desktop (heroes and
  CTAs larger).
- Alternate section backgrounds: white → cool mist (`#F5F7FB`) → white…
- Breakpoints: sm `480px`, md `768px`, lg `1024px`, xl `1280px`.
- Card grids: `gap 24px`; gallery `gap 12–16px`.

---

## 3. Core components

### 3.1 Buttons

All buttons: pill shape, weight 600, `transition 200ms`, hover lifts
`-2px` (`translateY`), active returns to 0. Sizes: md `padding 12px 28px`
/ `15px` text; sm `padding 10px 20px` / `14px` text.

- **Primary**: brand-gradient background, white text, navy glow shadow;
  hover: brightness 110% + deeper glow.
- **Accent** (Apply/Admission CTAs ONLY): solid amber `#F59E0B`, dark navy
  text, amber glow shadow; hover: 90% opacity.
- **Ghost/outline**: white bg, `border` color border, navy text; hover:
  `primary-soft` bg, `primary/30` border.
- **Glass** (on dark gradients): `white/10` bg, `white/20` border, white
  text, `backdrop-blur`; hover `white/20`.

### 3.2 Cards

White surface, `radius 16px`, whisper border `black/5`, `shadow-card`.
Clickable cards: hover lifts `-6px` with `shadow-card-hover` and border
`primary/20`, 300ms; card images zoom to `scale(1.05)` over 500ms inside an
`overflow-hidden` wrapper. Respect `prefers-reduced-motion` (disable
transform transitions).

Content cards (news/blog/branch): image top (16:9), `padding 24px` body,
meta row (small gray date + badge), h3 title (hover → navy), 3-line clamped
excerpt, "Read more →" navy semibold link pinned to the bottom.

### 3.3 Badges & chips

- **Badge accent**: `bg accent/15`, `text accent-ink`, pill, `10px`
  semibold uppercase, `padding 4px 10px`.
- **Badge outline**: white bg, `border` border, muted text — for secondary
  meta so two badges side by side stay distinguishable.
- **Date chip**: 56px wide column, `radius 12px`, `bg primary-soft`, border
  `primary/10`, navy text — bold `20px` day over `10px` semibold uppercase
  month.
- **Filter chips**: pills; active = solid navy + white text + navy glow;
  idle = `bg-alt`, hover `primary-soft`.

### 3.4 Header (site chrome)

Single sticky glass bar (NO utility bar above it):
`position sticky top 0`, `bg white/70`, `backdrop-blur 24px`,
transparent bottom border that becomes `hairline` + soft shadow after 8px of
scroll. Contents, one row (`padding-block 12px`):

- Logo left (~40–48px tall, links home).
- Center nav, desktop only — **max 7 links** (About, Branches, Academics,
  News, Blog, Gallery, Contact). No "Home" (logo covers it), no "Admissions"
  (CTA covers it). Links: `14px` medium, pill hover (`bg-alt`), active state
  = `primary-soft` pill with navy semibold text.
- Right: optional compact "★ Campus name" pill (`primary-soft`, xl screens
  only), then amber pill CTA **"Apply Now"** with amber glow.
- Mobile: hamburger → right slide-in drawer (320px, rounded left edge 24px,
  white, full 9-link list including Home and Admissions, amber CTA pinned at
  bottom). Focus-trapped, Esc closes, body scroll locked.

### 3.5 Footer

Navy `primary-dark`, light text, with a 4px gradient top edge
(`amber → navy → amber`). Four columns (1200px container, `padding-block
48px`): brand (white logo panel, tagline, social icons in `white/10`
circular chips), Quick Links, Branches, Head Office (address, phone, email,
hours). Column headings: `12px` semibold uppercase `white/60`. Links
`white/75` → white underline on hover. Bottom strip: `border-top white/10`,
centered `12px` copyright.

### 3.6 Page masthead (inner pages)

Cool-mist band (`bg-alt`), bottom hairline, `padding-block 48–64px`. Two
soft glow blobs (navy/10 top-right, amber/10 bottom-center-right, blurred
64px). Contents: breadcrumbs (small, `Home / Section / Page`, current page
darker), optional amber eyebrow pill (`bg accent/15`, `text accent-ink`,
amber dot), bold h1 (`2.125→3.375rem`), muted subtitle (max 42rem).

### 3.7 Home hero

Full-bleed brand-gradient section, white text, `padding-block 80px →
128px`. Glow orbs: amber/25 top-right (448px), white/10 bottom-left (384px).
Stack, left-aligned:

1. Glass eyebrow pill (white/10 bg, white/15 border, amber text + dot)
2. Display h1 (max-width 56rem)
3. Lead paragraph `18px`, `white/85`, max-width 42rem
4. Button row: glass button ("Explore Branches") + accent button ("Apply for
   Admission")
5. Glass stat chips row (`Est. 1998` · `3 Campuses` · `Jaipur, Rajasthan`):
   pills of `white/10` bg, `white/15` border, `12px` semibold `white/85`

### 3.8 Section heading block

Eyebrow pill (see 2.2) → `margin-top 20px` h2 → optional muted subtitle
(max-width 42rem). Left-aligned by default; centered variant for symmetric
contexts. Every major section starts with one.

### 3.9 Stats band

Full-bleed brand-gradient band with glow orbs. Inside the container: 2×2
(mobile) / 4-up (desktop) grid of **glass cards** (`white/10` bg, `white/15`
border, `radius 16px`, `backdrop-blur`, `padding-block 32–40px`, centered):
bold white numeral `36→48px` over an uppercase eyebrow-style label
`white/70`.

### 3.10 CTA band

NOT full-bleed: an **inset rounded card** (`radius 24px`) on the brand
gradient with glow orbs (amber/25, white/10), `shadow-card-hover`, inside
the 1200px container with `padding-block 40–64px` around it. Card padding
`48px 24px` → `64px 48px`. Left: white eyebrow pill (`white/15` bg, amber
text), white h2 (`1.9→2.6rem`), `white/75` subtitle. Right (bottom-aligned
on desktop): accent button.

### 3.11 Image placeholders

Until real photography exists: **mesh gradients** — 2–3 layered radial
color washes over a linear base, per tone (navy, amber, mist, forest, dusk,
stone), plus one soft white corner glow (`white/15`, blurred). Small white
semibold caption centered. Always `aria-hidden`. 16:9, 4:3 or 1:1. Swappable
for `next/image` photos without changing layout.

Example (navy tone):

```css
background-image:
  radial-gradient(at 20% 15%, color-mix(in srgb, #1E3A8A 80%, white) 0, transparent 55%),
  radial-gradient(at 85% 90%, color-mix(in srgb, #F59E0B 35%, #16276B) 0, transparent 60%),
  linear-gradient(145deg, #1E3A8A, #16276B);
```

### 3.12 Other components

- **Stepper** (admission process): numbered circles (40px) on the brand
  gradient with navy glow, hairline connectors; horizontal on desktop,
  vertical on mobile.
- **Accordion** (FAQs): one white rounded-16 card with `shadow-card`; rows
  divided by hairlines, `padding-inline 20px`; +/− indicator in a 28px
  circle — idle `primary-soft`/navy, open solid navy/white. One open at a
  time; ArrowUp/Down/Home/End move focus between headers.
- **Testimonial carousel**: single centered card (rounded-16, soft shadow,
  `padding 40px`), avatar circle, quote, name/role. Prev/next in white
  circular shadowed buttons; dots — active is a navy 24px pill, idle 10px
  dots. No auto-advance.
- **Notice row**: date chip left; title + optional "NEW" accent badge +
  branch outline badge; muted excerpt; hairline between rows.
- **Forms**: labels `14px` medium; inputs `radius 12px`, `border` color,
  white bg, `padding 12–14px`, focus border `primary/40`; errors in
  `error/5` bg + `error/30` border rounded panels; success likewise in
  green.
- **Map panel** (no iframe): mist panel with decorative street-grid SVG
  pattern (navy/10), navy pin in a circle, name + address, navy pill "Open
  in Google Maps ↗" button.

---

## 4. Page section patterns

Home page order: gradient hero → campus cards (3-up) → "Why choose us"
icon cards (4-up, mist bg, icons in `primary-soft` circular wells) → about
split (image + text, white) → stats band → news cards (3-up, mist) →
testimonial carousel (white) → gallery teaser grid (mist) → CTA card.

Inner pages: masthead → alternating white/mist sections, each opened by a
section-heading block → CTA card near the end (admissions-focused).

---

## 5. Motion

- Scroll-reveal: sections/cards fade-up ~24px over 500–600ms with 80–120ms
  stagger inside grids (IntersectionObserver, fire once).
- Hover: cards lift −6px (300ms), buttons lift −2px (200ms), card images
  zoom 1.05 (500ms), color transitions 200ms.
- `prefers-reduced-motion: reduce` → all transforms/transitions disabled;
  smooth-scroll off. Non-negotiable.

## 6. Accessibility rules (carry over unchanged)

- Focus visible everywhere: `outline: 2px solid #F59E0B; outline-offset: 2px`
  — never removed.
- Text contrast ≥ 4.5:1 (use `accent-ink`, not raw amber, for amber text on
  white; `white/75` minimum on navy).
- One h1 per page; heading levels never skip; landmarks (`header`, `main`,
  `footer`, labeled `nav`s); skip-to-content link as first focusable.
- Dialogs (drawer, lightbox): focus trap, Esc closes, scroll lock, focus
  returns to the trigger.
- Decorative SVGs/placeholders `aria-hidden`; icon-only buttons get
  `aria-label`; current nav link gets `aria-current="page"`.
- Selection color: amber at 28% over text color.

## 7. Admin dashboard (separate scope)

The admin (`/admin`) intentionally does NOT use this identity. It remaps the
same token names to: white/slate-50 surfaces, slate-900/500 text, blue-600
(`#2563EB`) primary, Inter for everything (no display font), radii pinned to
12px. Dark slate-900 sidebar with blue active accents. Public-site changes
must never leak into it (scope tokens under an `.admin-scope` wrapper class).

---

## 8. Quick checklist for any new screen

1. White or mist background — never cream, never gray-800.
2. Section starts with an eyebrow pill + bold Jakarta heading.
3. Cards: rounded-16, soft shadow, whisper border, hover lift.
4. Exactly one amber solid element competing for attention per viewport
   (the CTA); everything else navy/neutral.
5. Dark moments (hero/stats/CTA) use the brand gradient + glow orbs +
   glass, never flat navy.
6. Pills for anything interactive-small (buttons, chips, badges, nav).
7. Focus rings, reduced-motion guards, aria labels — always.
