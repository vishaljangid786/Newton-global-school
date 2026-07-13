# Sunrise Editorial — Design Language

The visual system the site is built in. It keeps the brand **navy + amber**
palette from [design.md](design.md) §2.1 but re-skins everything else into a
warm, editorial, prestige-institution look. This is a *synthesis* of four
directions: serif editorial voice, minimal whitespace, warm boutique base, and
architectural grid/mono accents.

## Voice

- **Serif display** (Fraunces, variable, optical sizing) for all headings and
  numerals — the elegant, distinctive signature.
- **Sans body** (Inter) for running text.
- **Monospace** (IBM Plex Mono) for eyebrows, labels, breadcrumbs, dates, stats
  and other meta — the architectural accent. Reusable `.eyebrow` class in
  `globals.css` (uppercase, letter-spaced, small).

## Palette (tokens in `src/app/globals.css`)

| Token | Value | Role |
|---|---|---|
| `--color-primary` | `#1E3A8A` | Navy — brand, headings-on-dark, buttons |
| `--color-primary-dark` | `#16276B` | Footer, dark bands, hovers |
| `--color-accent` | `#F59E0B` | Amber — CTAs, rules, "New" tags |
| `--color-accent-ink` | `#7A4D06` | Amber darkened for text on paper (≥4.5:1) |
| `--color-bg` | `#FBFAF6` | **Warm paper** — page base (was stark white) |
| `--color-bg-alt` | `#F2ECE0` | **Warm sand** — alternating sections, mastheads |
| `--color-text` | `#1C1B17` | Warm ink |
| `--color-text-muted` | `#6D685C` | Warm gray |
| `--color-border` | `#DDD6C6` | Hairline / input border |
| `--color-hairline` | `#E7E1D4` | Lighter rules |

The navy-on-cream contrast (not navy-on-white) is what reads as elegant.

## Surfaces & shape

- **Hairline-first:** structure comes from 1px borders and rules, not drop
  shadows. `--shadow-card` is barely-there; cards use `border border-border`.
- **Crisp edges:** `--radius-card` is 4px (was 8px). Pills stay fully round.
- **Hover:** cards lift 1px and firm their border to `primary/30`.

## Section patterns

- **Section heading** (`SectionHeading`): mono eyebrow with a short amber rule,
  serif title, muted subtitle. **Left-aligned by default** (editorial); pass
  `align="center"` for centered contexts.
- **Page masthead** (`PageHero`): warm-sand band with faint vertical pinstripes,
  breadcrumbs, optional eyebrow pill, large serif h1. (Replaced the old solid
  blue banner.)
- **Stats** (`StatsBand`): large serif numerals over sand, separated by hairline
  rules — no solid colour band.
- **CTA** (`CTABand`): full-bleed navy band with mono eyebrow + serif heading —
  a deliberate dark counterpoint to the paper sections.
- **Placeholders** (`PlaceholderImage`): muted, low-saturation tonal gradients
  with a fine dot texture and an inset hairline "frame"; mono caption.

## Rhythm

- Section vertical padding `py-10 md:py-16` (or larger on hero/CTA).
- Alternate `bg-bg` (paper) and `bg-bg-alt` (sand) between major sections.
- Respect `prefers-reduced-motion` (all reveal/hover motion already guards it).

## What did NOT change

- The navy + amber brand hues, the information architecture, all page content and
  data, and the accessibility (§8) / SEO (§9) rules from design.md.
