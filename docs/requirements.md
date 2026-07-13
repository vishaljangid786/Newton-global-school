# Project Requirements — Multi-Branch School Website

## 1. Project Overview

A public-facing website for **[School Name]**, a school group operating multiple
branches/campuses. The website presents the school group as one brand while giving
each branch its own dedicated section with branch-specific information (address,
staff, admissions, gallery, notices, events).

- **Project type:** Informational / marketing website with inquiry forms
- **Primary goal:** Help parents discover the school, compare branches, and start
  the admission process
- **Secondary goals:** Publish news, events, and notices; showcase facilities and
  achievements; provide downloadable documents (forms, calendars, syllabi)

## 2. Target Audience

| Audience | What they need |
|---|---|
| Prospective parents | Branch locations, fees info, admission process, facilities, contact |
| Current parents/students | Notices, events, calendars, downloads, contact details |
| Job seekers (teachers/staff) | Careers page, open positions, application form |
| General public / press | About the school, achievements, news |

## 3. Branches

The site must support **N branches** (start with placeholders; add/remove without
code changes to unrelated pages):

1. **[Branch 1 Name]** — [City / Area]
2. **[Branch 2 Name]** — [City / Area]
3. **[Branch 3 Name]** — [City / Area]

Each branch is a self-contained section: `/branches/<branch-slug>/...`

## 4. Site Structure (Pages)

### 4.1 Global pages (shared, school-group level)

| # | Page | Route | Purpose |
|---|------|-------|---------|
| 1 | Home | `/` | Brand introduction, branch selector, highlights, CTAs |
| 2 | About Us | `/about` | History, mission & vision, management, accreditations |
| 3 | Branches (listing) | `/branches` | Cards for every branch with map + quick facts |
| 4 | Academics | `/academics` | Curriculum overview, grade levels, teaching approach |
| 5 | Admissions | `/admissions` | Group-wide admission process, eligibility, FAQs, inquiry form |
| 6 | News & Events | `/news` | Blog-style list of news, events, announcements (all branches) |
| 7 | Gallery | `/gallery` | Photo/video gallery, filterable by branch and category |
| 8 | Careers | `/careers` | Open positions, culture, application form |
| 9 | Contact | `/contact` | Head-office contact, general inquiry form, branch contact links |
| 10 | Privacy Policy | `/privacy` | Legal |
| 11 | Terms of Use | `/terms` | Legal |
| 12 | 404 page | `*` | Friendly not-found page with navigation back |

### 4.2 Per-branch pages (template repeated for every branch)

| # | Page | Route | Purpose |
|---|------|-------|---------|
| 1 | Branch Home | `/branches/<slug>` | Branch hero, principal's message, quick facts, highlights |
| 2 | About the Branch | `/branches/<slug>/about` | Campus story, infrastructure, facilities |
| 3 | Academics | `/branches/<slug>/academics` | Grades offered, sections, curriculum, results |
| 4 | Faculty & Staff | `/branches/<slug>/faculty` | Principal + staff directory with photos |
| 5 | Admissions | `/branches/<slug>/admissions` | Branch-specific seats, fees info, dates, inquiry form |
| 6 | Facilities | `/branches/<slug>/facilities` | Labs, library, sports, transport, safety |
| 7 | Gallery | `/branches/<slug>/gallery` | Branch-specific photos/videos |
| 8 | Notices & Events | `/branches/<slug>/notices` | Notice board + upcoming events for this branch |
| 9 | Contact | `/branches/<slug>/contact` | Address, phone, email, map embed, timings, contact form |

> All branch pages share one layout template; only the data changes. Adding a new
> branch = adding a new data entry, not new page code.

## 5. Functional Requirements (Features)

### Must have (MVP)
- **F1. Branch selector** — prominent on Home and in the header nav (dropdown listing
  all branches); remembers last-visited branch (localStorage).
- **F2. Admission inquiry form** — name, parent name, phone, email, branch (dropdown),
  grade applying for, message. Client-side validation; submissions sent by email or
  stored (see tech stack).
- **F3. Notice board** — dated notices per branch; newest first; "New" badge for
  notices under 7 days old.
- **F4. Events listing** — upcoming/past events with date, branch tag, description,
  optional image.
- **F5. Photo gallery** — grid with lightbox; filter by branch and category
  (Sports, Annual Day, Classrooms, Trips…).
- **F6. Faculty directory** — cards with photo, name, designation, qualification.
- **F7. Downloads** — admission form PDF, academic calendar, fee structure, syllabus;
  listed per branch where applicable.
- **F8. Contact forms** — general (head office) and per-branch; spam-protected
  (honeypot field at minimum).
- **F9. Google Maps embed** — on every branch contact page and the branches listing.
- **F10. Global search** *(optional in MVP)* — search across pages, notices, news.

### Should have (Phase 2)
- **F11. Testimonials** — parent/alumni quotes, shown on Home and branch homes.
- **F12. FAQ accordion** — on Admissions pages.
- **F13. News/blog with categories** and per-branch filtering.
- **F14. Newsletter signup** (email capture).
- **F15. Achievements/results section** — toppers, awards, board results per branch.
- **F16. Announcement ticker/banner** — dismissible top bar for urgent notices.

### Could have (Future)
- **F17. Student/parent portal login** (fees, homework, attendance) — separate system,
  link only for now.
- **F18. Online fee payment** integration.
- **F19. Multi-language support** ([English] + [regional language]).
- **F20. CMS/admin panel** so non-technical staff can update notices, events, gallery.

## 6. Non-Functional Requirements

- **Responsive:** mobile-first; must work at 360px, 768px, 1024px, 1440px widths.
- **Performance:** Largest Contentful Paint < 2.5s on 4G; images lazy-loaded and
  compressed (WebP); Lighthouse performance ≥ 85.
- **SEO:** unique title/meta description per page; semantic HTML; Open Graph tags;
  sitemap.xml; schema.org `School` structured data per branch.
- **Accessibility:** WCAG 2.1 AA intent — keyboard navigable, alt text on all images,
  visible focus states, sufficient color contrast (≥ 4.5:1 body text).
- **Security:** HTTPS only; form validation on both client and server; no personal
  data stored in the browser beyond branch preference.
- **Browser support:** last 2 versions of Chrome, Edge, Firefox, Safari; no IE11.
- **Maintainability:** branch data lives in one data file/collection so adding a
  branch touches one place.

## 7. Content Requirements (to collect from the school)

- Logo (SVG/PNG), brand colors if any, tagline
- Per branch: name, address, phone, email, map link, principal name + photo +
  message, grades offered, facilities list, 10–20 photos, staff list
- School history, mission/vision, accreditation certificates
- Admission process steps, eligibility, required documents, key dates
- Downloadable PDFs (admission form, fee structure, calendar)

## 8. Recommended Tech Stack

**Option A (recommended for MVP): Static site**
- HTML + CSS + vanilla JavaScript (or a static site generator like **Astro**/**Next.js
  static export**)
- Branch content in JSON/Markdown data files → branch pages generated from one template
- Forms via a form service (Formspree/Web3Forms/Google Forms) — no backend needed
- Hosting: Netlify / Vercel / GitHub Pages (free tier is enough)

**Option B (if CMS needed from day one):**
- Next.js + headless CMS (Sanity/Strapi/Decap) so office staff can edit notices,
  events, and gallery without a developer.

## 9. Out of Scope (this phase)

- Student information system, LMS, attendance, exams
- Online payments
- Mobile app
- User accounts/authentication

## 10. Assumptions

- Content and photos will be provided by the school; placeholders used until then.
- Number of branches is small (2–10); all share one curriculum brand.
- English is the primary language for MVP.
- See [design.md](design.md) for page-by-page layout and visual specifications.
