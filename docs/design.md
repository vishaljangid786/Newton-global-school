# Design Specification — Multi-Branch School Website

This document is the build blueprint: every page below is specified section-by-section,
top to bottom. Build pages exactly from these specs. Functional scope lives in
[requirements.md](requirements.md).

---

## 1. Design Principles

1. **Trustworthy & warm** — parents are choosing where to send their child; the design
   should feel established, safe, and friendly (not corporate, not childish).
2. **One brand, many branches** — global pages carry the group identity; branch pages
   reuse the same layout with a branch name/label so users always know where they are.
3. **Content first** — real photos of the school beat stock imagery; short paragraphs;
   scannable sections.
4. **Mobile-first** — most parents will browse on phones.

---

## 2. Visual Identity

### 2.1 Color Palette

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#1E3A8A` (deep blue) | Header, buttons, headings, links |
| `--color-primary-dark` | `#16276B` | Button hover, footer background |
| `--color-accent` | `#F59E0B` (amber) | CTAs, badges, highlights, "New" tags |
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-bg-alt` | `#F3F6FB` | Alternating section backgrounds, cards |
| `--color-text` | `#1F2937` | Body text |
| `--color-text-muted` | `#6B7280` | Captions, meta info, dates |
| `--color-success` | `#15803D` | Form success messages |
| `--color-error` | `#B91C1C` | Form validation errors |

> Swap primary/accent for the school's brand colors when available; keep contrast
> ratios ≥ 4.5:1 for text.

### 2.2 Typography

- **Headings:** "Poppins" (fallback: system-ui, sans-serif) — weights 600/700
- **Body:** "Inter" (fallback: system-ui, sans-serif) — weights 400/500
- Scale (desktop → mobile):
  - `h1` 40px → 28px · `h2` 32px → 24px · `h3` 24px → 20px
  - body 16px · small/meta 14px · line-height 1.6 for body, 1.2 for headings

### 2.3 Spacing, Radius, Shadow

- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 px
- Section vertical padding: 64px desktop, 40px mobile
- Border radius: 8px (cards, inputs), 999px (pills/badges)
- Card shadow: `0 2px 8px rgba(16, 24, 40, 0.08)`; hover: lift + slightly stronger shadow

### 2.4 Imagery

- Real campus photos, landscape 16:9 for heroes/cards, 1:1 for staff portraits
- Every image has descriptive `alt` text; lazy-load everything below the fold

---

## 3. Layout System

- **Max content width:** 1200px, centered, 16px side padding on mobile
- **Grid:** 12-column on desktop; cards typically 3-up (desktop) → 2-up (tablet) → 1-up (mobile)
- **Breakpoints:** `sm` 480px · `md` 768px · `lg` 1024px · `xl` 1280px

### 3.1 Header (all pages)

- Top utility bar (desktop only): phone number, email, social icons — primary-dark bg
- Main bar: logo left · nav center/right · **"Admissions Open — Apply"** accent button
- Nav items: Home · About · **Branches ▾** (dropdown listing every branch) ·
  Academics · Admissions · News & Events · Gallery · Contact
- On branch pages, show a **branch context bar** under the header:
  `You are viewing: [Branch Name] — [Switch branch ▾]`
- Mobile: hamburger → full-height slide-in drawer; branches as an expandable group
- Header is sticky; adds shadow after scrolling 8px

### 3.2 Footer (all pages)

4 columns (stacked on mobile), primary-dark background, light text:
1. Logo + 2-line about + social icons
2. Quick links (About, Admissions, Careers, Gallery, Privacy, Terms)
3. **Branches** — link to every branch home
4. Head office contact + phone + email
Bottom strip: © year, school name, "All rights reserved."

### 3.3 Shared Components

| Component | Spec |
|---|---|
| Button (primary) | Primary bg, white text, 12px 24px padding, radius 8px |
| Button (accent/CTA) | Accent bg, dark text — used for Apply/Admission CTAs only |
| Card | White bg, radius 8px, shadow, 24px padding; image cards: image top, text below |
| Section heading | Small accent overline label + h2 + optional 1-line subtitle, centered |
| Badge | Pill, accent bg — used for "New", branch tags, event categories |
| Breadcrumbs | On all inner pages: Home / Section / Page |
| Form input | 1px `#D1D5DB` border, radius 8px, 12px padding; error state: red border + message below |
| Accordion | Border-bottom rows, + / − toggle icon, one open at a time |
| Lightbox | Fullscreen overlay for gallery images, arrow navigation, Esc to close |
| Notice row | Date chip (day/month) left, title + excerpt right, "New" badge if < 7 days |
| Map embed | Google Maps iframe, 16:9, radius 8px |

---

## 4. Page Specifications — Global Pages

### 4.1 Home `/`

1. **Hero** — full-width photo with dark gradient overlay; h1 tagline
   ("Shaping Bright Futures Since [Year]"), 1-line subtext, two buttons:
   *Explore Branches* (primary) + *Apply for Admission* (accent).
2. **Branch selector strip** — "Find your nearest campus": one card per branch
   (photo, name, area, "Visit branch →"); horizontally scrollable on mobile.
3. **Why choose us** — 4 icon cards (e.g., Experienced Faculty, Safe Campus,
   Modern Labs, Sports & Arts).
4. **About preview** — image left, text right: 2 short paragraphs + "Read more" link.
5. **Stats band** — primary bg, 4 counters: Years, Branches, Students, Faculty.
6. **Latest news & events** — 3 most recent cards (image, date, branch badge, title).
7. **Testimonials** — carousel of 3 quotes (photo, name, "Parent, [Branch]").
8. **Gallery teaser** — 6-image mosaic + "View full gallery" button.
9. **CTA band** — accent/primary gradient: "Admissions open for [Year]" + Apply button.

### 4.2 About Us `/about`

1. Page hero (short banner: title + breadcrumbs — same pattern on all inner pages)
2. Our story — text + founding photo
3. Mission & Vision — two side-by-side cards
4. Core values — 4–6 icon chips
5. Management/leadership — cards (photo, name, role, 2-line bio)
6. Accreditations & affiliations — logo row
7. CTA band → Admissions

### 4.3 Branches Listing `/branches`

1. Page hero: "Our Campuses"
2. Optional combined map showing all branch pins
3. One **large card per branch**: photo, name, address, grades offered,
   phone, two buttons — *Visit Branch Page* (primary), *Get Directions* (link)
4. Comparison table (optional): branch × grades offered × key facilities

### 4.4 Academics `/academics`

1. Page hero
2. Curriculum overview ([CBSE/ICSE/State Board] — placeholder)
3. Grade levels — 3 cards: Pre-Primary, Primary, Secondary (ages, focus)
4. Teaching methodology — alternating image/text rows (2–3)
5. Beyond academics — sports, arts, clubs icon grid
6. Downloads: syllabus / academic calendar buttons

### 4.5 Admissions `/admissions`

1. Page hero with "Admissions Open" badge
2. **Process steps** — numbered horizontal stepper (Inquire → Visit → Register →
   Assessment → Confirm)
3. Eligibility & documents — two-column checklist
4. Key dates table
5. **Inquiry form** (F2 in requirements) — 2-column desktop, stacked mobile;
   success state replaces form with a thank-you message
6. FAQ accordion (8–10 questions)
7. Contact strip: "Prefer to talk? Call [phone]"

### 4.6 News & Events `/news`

1. Page hero
2. Filter row: All | News | Events | Notices + branch dropdown
3. Card grid, newest first (image, date, branch badge, title, excerpt)
4. Pagination or "Load more"
- **Detail page** `/news/<slug>`: title, date, branch badge, hero image, rich text,
  back link

### 4.7 Gallery `/gallery`

1. Page hero
2. Filter chips: category (All, Sports, Annual Day, Classrooms, Trips) + branch dropdown
3. Masonry/grid of thumbnails → lightbox on click
4. Optional video section (embedded YouTube)

### 4.8 Careers `/careers`

1. Page hero: "Teach with us"
2. Why work here — 3 benefit cards
3. Open positions — accordion rows (title, branch, type) → details + Apply button
4. Application form: name, email, phone, position, branch, resume upload note/link

### 4.9 Contact `/contact`

1. Page hero
2. Head office card: address, phone, email, hours + map embed
3. Branch contact quick-cards linking to each branch contact page
4. General inquiry form

### 4.10 404

Centered: large "404", friendly line ("This page seems to be on holiday."),
buttons → Home, Branches, Contact.

---

## 5. Page Specifications — Branch Template

> One template, rendered per branch from data. `<slug>` = branch URL name.
> Every branch page shows the branch context bar (§3.1) and branch-scoped breadcrumbs.

### 5.1 Branch Home `/branches/<slug>`

1. Hero — branch photo, h1 "[School Name], [Branch Name]", area subtitle,
   buttons: *Admissions* (accent) + *Contact Us*
2. Quick facts row — 4 tiles: Grades offered, Students, Established, Campus size
3. Principal's message — portrait left, message + name/designation right
4. Highlights — 3–4 cards (facilities, results, activities)
5. Latest branch notices — 3 notice rows + "All notices →"
6. Mini gallery — 4 images + link to branch gallery
7. Map + address strip + CTA band

### 5.2 About `/branches/<slug>/about`
Campus story · infrastructure photos (2-up) · facilities icon grid · achievements list

### 5.3 Academics `/branches/<slug>/academics`
Grades & sections table · curriculum notes · results/toppers section (optional) ·
downloads (branch calendar/syllabus)

### 5.4 Faculty `/branches/<slug>/faculty`
Principal feature card, then staff grid — photo (1:1), name, designation,
qualification; filter by department if > 12 staff

### 5.5 Admissions `/branches/<slug>/admissions`
Seats/grades open table · branch-specific dates · fee structure download ·
inquiry form (branch preselected in dropdown) · FAQ accordion

### 5.6 Facilities `/branches/<slug>/facilities>`
Alternating image/text rows: Library, Labs, Sports, Transport, Safety & CCTV,
Medical room — each with 2–3 line description

### 5.7 Gallery `/branches/<slug>/gallery`
Same as global gallery but pre-filtered to this branch

### 5.8 Notices & Events `/branches/<slug>/notices`
Tabbed: **Notices** (notice rows, newest first) | **Events** (upcoming then past,
event cards with date chips)

### 5.9 Contact `/branches/<slug>/contact`
Two-column: contact details card (address, phone, email, office hours,
transport info) + contact form · full-width map embed below

---

## 6. Branch Data Model

All branch pages render from one data entry per branch (JSON/Markdown/CMS):

```json
{
  "slug": "city-center",
  "name": "City Center Campus",
  "area": "MG Road, [City]",
  "address": "…",
  "phone": "+91-…",
  "email": "citycenter@school.example",
  "mapEmbedUrl": "…",
  "established": 2005,
  "grades": "Nursery – Grade 12",
  "principal": { "name": "…", "photo": "…", "message": "…" },
  "quickFacts": { "students": 1200, "campusSize": "3 acres" },
  "facilities": ["Library", "Science Labs", "…"],
  "heroImage": "…",
  "galleryCategoryKey": "city-center"
}
```

Notices, events, news, and gallery items each carry a `branch` field (`"all"` or a
branch slug) so global pages aggregate and branch pages filter.

---

## 7. Interactions & States

- **Sticky header** with scroll shadow; smooth-scroll for in-page anchors
- **Hover:** cards lift 2px; links underline; buttons darken 8%
- **Focus:** 2px accent outline on all interactive elements (never remove outlines)
- **Forms:** validate on blur + on submit; disable submit while sending; show inline
  success/error; never clear user input on failure
- **Reveal animations:** subtle fade-up on section entry (respect
  `prefers-reduced-motion`)
- **Empty states:** notices/events lists show a friendly "No notices yet" message

---

## 8. Accessibility Checklist (apply to every page)

- One `h1` per page; heading levels never skip
- All images have `alt`; decorative images `alt=""`
- Nav dropdowns usable by keyboard (Enter/Escape/arrows)
- Form inputs have visible `<label>`s (no placeholder-only labels)
- Color is never the only signal (badges also have text)
- Lightbox and mobile drawer trap focus and close on Esc

## 9. SEO per Page

- Title pattern — global: `Page | [School Name]`; branch: `Page | [Branch Name] | [School Name]`
- Unique meta description (≤ 155 chars) per page
- `schema.org/School` JSON-LD on each branch home with address/phone/geo
- `sitemap.xml` including all branch routes; canonical URLs

## 10. Asset Checklist (needed before build)

- [ ] Logo SVG (light + dark variants)
- [ ] Hero photos: 1 global + 1 per branch (≥ 1920px wide)
- [ ] 10–20 gallery photos per branch, categorized
- [ ] Principal + staff portraits (square)
- [ ] PDFs: admission form, fee structure, academic calendar
- [ ] Favicon + social share (OG) image 1200×630
