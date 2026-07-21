# "Newton Modern" — UI Redesign Plan

Replaces the **Sunrise Editorial** design language (warm paper, serif Fraunces,
mono eyebrows, hairline-first surfaces) with a contemporary, high-polish look.
Information architecture, content, data, routes, accessibility and SEO rules
are all **unchanged** — this is a pure visual-layer redesign.

Because every color/radius/shadow/font lives as a Tailwind v4 `@theme` token in
`src/app/globals.css` and all pages compose the shared kit in
`src/components/ui/`, ~80% of the redesign lands via tokens + ~10 primitive
components. Page files need only light touch-ups.

> Per `AGENTS.md`: read the relevant guides in `node_modules/next/dist/docs/`
> before writing any code (this Next version has breaking changes).

---

## 1. Design direction

Clean, confident, "modern edtech" — white base, deep-navy brand retained,
amber kept as the energy color, big friendly type, soft depth (layered
shadows + blur), rounded surfaces, gradient accents used sparingly.

What gets removed:
- Warm cream/sand paper backgrounds (biggest "old" signal)
- Serif display font (Fraunces) and IBM Plex Mono eyebrows/meta
- 4px crisp corners + hairline-only structure
- Pinstripe textures, top utility bar, framed-photograph placeholders

## 2. Token changes (`src/app/globals.css` `@theme`)

| Token | Old (Editorial) | New (Modern) |
|---|---|---|
| `--color-bg` | `#fbfaf6` warm paper | `#ffffff` |
| `--color-bg-alt` | `#f2ece0` warm sand | `#f5f7fb` cool mist (slate-blue tint) |
| `--color-text` | `#1c1b17` warm ink | `#0f172a` slate-900 |
| `--color-text-muted` | `#6d685c` warm gray | `#5b6577` cool gray |
| `--color-border` | `#ddd6c6` | `#e5e9f2` |
| `--color-hairline` | `#e7e1d4` | `#eef1f7` |
| `--color-primary` | `#1e3a8a` | keep `#1e3a8a` (brand) + new `--color-primary-soft: #eef3ff` for tinted chips/washes |
| `--color-primary-dark` | `#16276b` | keep — dark bands/footer |
| `--color-accent` | `#f59e0b` | keep (brand); `--color-accent-ink` recheck contrast on white |
| `--radius-card` | `0.25rem` | `1rem` (16px) |
| `--radius-lg` | `0.75rem` | `1.5rem` (24px — heroes, CTA card, gallery tiles) |
| `--shadow-card` | barely-there 1px | layered soft: `0 1px 2px rgba(15,23,42,.06), 0 8px 24px -12px rgba(15,23,42,.12)` |
| `--shadow-card-hover` | — | deeper lift: `0 24px 48px -20px rgba(30,58,138,.25)` |

New tokens: `--gradient-brand` (navy → indigo → amber glow) for hero/CTA
surfaces, and a `--color-glass` (white/70) for the blurred header.

## 3. Typography (`src/app/layout.tsx` + base styles)

- **Drop** Fraunces and IBM Plex Mono entirely.
- **Headings:** `Plus Jakarta Sans` (next/font, variable, weights 600–800) —
  geometric, friendly, very "now". (Alternates: Sora, Manrope.)
- **Body:** keep Inter.
- Headings: `font-weight: 700`, `letter-spacing: -0.025em`, `line-height 1.1`.
- `.eyebrow` reworked: small **sans** semibold uppercase, `tracking 0.08em`,
  primary color, usually inside a tinted pill (`bg-primary-soft`) — no more
  mono + amber rule line.

## 4. Component kit (`src/components/ui/`)

Primitives (restyle in place — public API/props unchanged):

- **Button** — pill shape (`rounded-pill`); primary becomes a navy→indigo
  gradient with soft colored shadow; accent stays amber (dark text); outline →
  quiet "ghost" (tinted hover). Slight scale/translate on hover, keep
  `active:translate-y-px` and reduced-motion guards.
- **Card** — `rounded-2xl`, borderless (or 1px `border-black/5`), layered
  `shadow-card`; hoverLift = -4px translate + `shadow-card-hover`.
- **SectionHeading** — pill eyebrow, bigger bolder title (up to `text-4xl`),
  keep left-default alignment.
- **PageHero** — white → `bg-alt` gradient with two soft radial glow blobs
  (primary/accent at low opacity) instead of pinstripes; bolder h1; breadcrumb
  restyled as chips.
- **StatsBand** — flip from sand+hairlines to a dark navy gradient band with
  glassy stat cards (white/10, backdrop-blur, `rounded-2xl`), big bold sans
  numerals in white, amber accents.
- **CTABand** — becomes an inset **rounded gradient card** (max-w-content,
  `rounded-[--radius-lg]`, brand gradient + soft glow orbs) rather than a
  full-bleed flat band.
- **PlaceholderImage** — replace flat gradient + dots with modern **mesh
  gradients** (2–3 layered radial color stops per tone), remove the inset
  hairline frame and mono caption (caption → small medium-weight sans).
  Tones/API unchanged so all call sites keep working.
- **Badge / DateChip / Stepper / Accordion / NoticeRow / Breadcrumbs /
  FactTile** — inherit new radius/shadow/eyebrow styles; Accordion gets a
  rounded container with dividers; Stepper gets filled circular markers.
- **TestimonialCarousel** — larger rounded cards, soft shadow, modern quote
  mark, pill dots.
- **Card variants** (BranchCard, NewsCard, BlogCard, EventCard, FacultyCard,
  GalleryGrid) — inherit Card changes; image area gets subtle zoom-on-hover
  (`scale-105`, reduced-motion safe); category/date chips restyled.

## 5. Site chrome (`src/components/layout/`)

- **Header** — remove the top utility bar (phone/email move to footer +
  mobile drawer). Single glass sticky bar: `bg-white/70 backdrop-blur-xl`,
  bottom hairline appears on scroll (existing `scrolled` state). Active nav
  link = tinted pill (`bg-primary-soft text-primary`). CTA = pill accent
  button. Drawer: rounded links, same focus-trap logic untouched.
- **Footer** — keep `primary-dark` but add a subtle top gradient edge,
  looser spacing, social icons in soft circular chips; add the phone/email
  from the removed utility bar.
- **NotificationBanner** — slimmer, tinted (`bg-primary-soft`), pill dismiss.

## 6. Page-level touch-ups (light)

- **Home hero (`src/app/page.tsx`)** — the one real page rewrite: brand
  gradient + glow-orb background (no more flat navy + placeholder), bolder
  headline, pill CTAs, and the mono meta row becomes floating glass stat
  chips. Optionally add real photography later via `next/image`.
- Other pages keep their structure; sweep for hard-coded editorial classnames
  (`font-mono`, `tracking-[0.18em]`, pinstripe styles) and section
  `bg-bg`/`bg-bg-alt` alternation (now white ↔ cool mist — still works).
- **Gallery** — larger gap + `rounded-2xl` tiles, hover zoom.

## 7. Admin dashboard

Already a clean slate/blue system via `.admin-scope` token remap — verify it
still looks right after the base-token changes (it overrides most tokens, so
impact is minimal). Optionally bump its `--radius-card` to `0.75rem` to match.

## 8. Out of scope (this pass)

- Dark mode (tokens make it easy later; not now)
- Real photography / CMS-managed images (PlaceholderImage API is kept so
  images can be swapped in later)
- Any data, routing, backend, or admin-functionality changes

## 9. Implementation order & verification

1. **Tokens + fonts** — globals.css `@theme` + layout.tsx font swap (biggest
   visual shift, mechanically safe)
2. **Primitives** — Button, Card, SectionHeading, `.eyebrow`
3. **Chrome** — Header, Footer, PageHero, StatsBand, CTABand, banner
4. **Content components** — cards, placeholders, carousel, small parts
5. **Home hero + page sweep** — remove editorial-specific classnames
6. **Docs** — update `docs/design-language.md` to describe the new system

Verify after each phase: `npm run dev`, click through home / about /
admissions / a branch / news / blog / gallery / admin, check mobile drawer,
focus states and reduced-motion; finish with `npm run lint` and `npm run build`.
