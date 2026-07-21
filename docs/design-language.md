# Newton Corporate Light — Design Language

The visual system the site is built in ("Complete design overhaul", July 2026).
A light, corporate look on a near-white cloud base: royal-blue brand, hairline
borders instead of heavy shadows, Sora display type, dash-line eyebrows and two
deliberate dark counterpoints (the CTA card and the footer). (Replaced the
earlier "Newton Modern" navy + amber system.)

## Voice

- **Display sans** (Sora, 500/600) for all headings and numerals —
  semibold (600), tight tracking (−0.02em; −0.03em on h1).
- **Sans body** (Instrument Sans, 400/500/600) for running text.
- **Eyebrows** are small semibold uppercase labels with wide tracking
  (0.14em) in brand blue, led by a 26px dash line (`SectionHeading`; the dash
  mirrors on both sides when centered). Reusable `.eyebrow` class in
  `globals.css`. No monospace anywhere on the public site.

## Palette (tokens in `src/app/globals.css`)

| Token | Value | Role |
|---|---|---|
| `--color-primary` | `#3E62D6` | Royal blue — links, solid buttons, active states |
| `--color-primary-dark` | `#2C49A8` | Hovers, accent-ink |
| `--color-primary-soft` | `#EAF0FE` | Tinted washes — chips, icon wells |
| `--color-accent` | `#4C6FE6` | Gradient start; dots, "+" marks, glows |
| `--color-bg` | `#F8FAFC` | Page base (cloud) |
| `--color-bg-alt` | `#F4F7FB` | Hero band, tinted wells |
| `--color-surface` | `#FFFFFF` | Cards, panels, inputs |
| `--color-panel` | `#EFF3FC` | Tinted stats panel |
| `--color-text` | `#26303F` | Body ink |
| `--color-ink` | `#1B2536` | Headings, strong text |
| `--color-text-muted` | `#54606F` | Secondary copy |
| `--color-faint` | `#8791A0` | Meta lines, uppercase micro-labels |
| `--color-border` | `#E1E7F0` | Input/card borders |
| `--color-hairline` | `#EAEEF3` | Section rules, card borders |
| `--color-dark` | `#1E2A44` | CTA card |
| `--color-footer` | `#161F33` | Footer |

`--gradient-brand` (135°, `#4C6FE6 → #6E8EF2`) is the shared gradient for the
Apply buttons, testimonial initials tile and gallery CTA.

## Surfaces & shape

- **Hairline-first:** structure comes from 1px hairline borders and section
  rules (`border-hairline`); shadows are a whisper (`--shadow-card`, 4%
  opacity). Framed feature images use `--shadow-frame`.
- **Radii:** buttons/chips 9px (`--radius-btn`), cards 14px (`--radius-card`),
  hero frame & gallery tiles 16px (`--radius-lg`), CTA card 22px
  (`--radius-xl`). Filter chips and dots stay pills.
- **Hover:** cards lift −1px with a deeper shadow; card images zoom subtly
  (`scale-105`); buttons darken (solid) or brighten (gradient).
- **Sections** sit on the shared cloud base and are separated by hairline
  `border-t` rules rather than alternating background colors.

## Section patterns

- **Section heading** (`SectionHeading`): dash-line eyebrow in blue, Sora
  title, muted subtitle. Left-aligned by default; `align="center"` mirrors
  the dash. Split headers (heading left, short lede right) are composed at
  the call site (see home).
- **Page masthead** (`PageHero`): soft blue-tinted band (`bg-bg-alt`) closed
  by a hairline, breadcrumbs, optional dash eyebrow, large Sora h1.
- **Home / branch hero**: a framed image card (rounded 16px, hairline border,
  frame shadow) with a left-to-right dark wash (`rgba(16,24,44,…)`) and white
  copy; home adds a 4-up white fact strip below the frame.
- **Stats** (`StatsBand`): tinted blue panel (`--color-panel`, 18px radius),
  big Sora numerals with a blue "+", uppercase micro-labels, hairline column
  dividers.
- **CTA** (`CTABand`): centered deep-navy card (`--color-dark`, 22px radius)
  with a single radial glow in the corner and a gradient CTA button.
- **Testimonials** (`TestimonialCarousel`): borderless centered Sora quote
  with an oversized light-blue “ glyph and a 48px gradient initials tile.
- **Gallery teaser** (home): 3-column mosaic with tall corner tiles, white
  category chips (top-left) and gradient-scrim captions (bottom).
- **Placeholders** (`PlaceholderImage`): mesh gradients recalibrated to the
  blue palette. API kept so real photography can be swapped in later.

## Rhythm

- Section vertical padding `py-12 md:py-14` (heroes and CTAs slightly more).
- One shared container: `max-w-content` (1160px) with `px-4`.
- Respect `prefers-reduced-motion` (all reveal/hover/zoom motion guards it).

## Chrome

- **Header:** sticky `bg-bg/90 backdrop-blur`, hairline bottom border, quiet
  muted nav links (active = blue semibold), blue-dot campus quick link,
  gradient "Apply Now" button.
- **Footer:** deep navy (`--color-footer`), 4 columns, white column headings,
  `#9CA6B8` body, periwinkle (`#8FA6F2`) hover/emphasis links.

## Admin

The dashboard keeps its own self-contained slate + blue system via the
`.admin-scope` token remap in `globals.css` (body sans only, tighter radii —
`--radius-card`/`--radius-lg` pinned to 0.75rem).

## What did NOT change

- The information architecture, all page content and data, and the
  accessibility (§8) / SEO (§9) rules from design.md.
