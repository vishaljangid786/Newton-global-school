import Image from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import Breadcrumbs, { type Crumb } from "@/components/ui/Breadcrumbs";

/* ——— Palette ————————————————————————————————————————————————
 * Taken from the school crest: navy #001344 with gold #a8802f. Tuned for
 * screen and written as literals at each call site — deliberately NOT CSS
 * custom properties, so a stale or half-loaded stylesheet can never leave a
 * gold button with no background.
 *
 *   gold        #a8802f   crest gold — dashes, rules, borders
 *   gold-bright #d6a53f   lifted gold — keyword runs and numerals on navy
 *   gold-ink    #87661f   gold darkened for text on white (5:1 contrast)
 *   gold-soft   #faf4e8   warm well — the testimonials band
 *   navy        #001344   section bands
 *   navy-deep   #000c2e   hero band
 * ——————————————————————————————————————————————————————————— */

/** A page image asset: a file in /public plus its intrinsic size and alt. */
export interface Img {
  readonly src: string;
  readonly w: number;
  readonly h: number;
  readonly alt: string;
}

/* ——— Rich text ——————————————————————————————————————————————— */

/** Emphasis treatments, so bold reads as bold on every surface. */
export const STRONG = {
  /** Body copy on light surfaces. */
  body: "font-bold text-ink",
  /** Body copy on the navy hero / CTA surfaces. */
  dark: "font-bold text-white",
  /** Keyword phrases inside an h1/h2 — heavier weight plus the crest gold. */
  headingLight: "font-bold text-[#87661f]",
  headingDark: "font-bold text-[#d6a53f]",
  /** Run-in title that opens a list item, before the document's " - ". */
  runIn: "font-heading font-bold text-ink",
};

/**
 * Render document copy: `**…**` runs become <strong>, everything else passes
 * through character-for-character.
 */
export function rich(text: string, strongClass: string = STRONG.body): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index} className={strongClass}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    )
  );
}


/* ——— Icons —————————————————————————————————————————————————— */

export type IconName =
  | "faculty"
  | "book"
  | "shield"
  | "target"
  | "chart"
  | "pin"
  | "classroom"
  | "flask"
  | "library"
  | "trophy"
  | "bus"
  | "monitor"
  | "cctv"
  | "droplet"
  | "medical"
  | "music"
  | "yoga"
  | "leaf"
  | "quote"
  | "calendar"
  | "check";

const ICON_PATHS: Record<IconName, ReactNode> = {
  faculty: (
    <>
      <path d="M15 19v-1.4a3.6 3.6 0 0 0-3.6-3.6H7.6A3.6 3.6 0 0 0 4 17.6V19" />
      <circle cx="9.5" cy="8" r="3.4" />
      <path d="M20 19v-1.4a3.6 3.6 0 0 0-2.7-3.5M15.2 4.9a3.4 3.4 0 0 1 0 6.2" />
    </>
  ),
  book: (
    <>
      <path d="M12 7.4C10.6 6 8.6 5.3 4.7 5.3v11.4c3.9 0 5.9.7 7.3 2.1" />
      <path d="M12 7.4c1.4-1.4 3.4-2.1 7.3-2.1v11.4c-3.9 0-5.9.7-7.3 2.1" />
      <path d="M12 7.4v11.4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.2 5.4 6v5.4c0 3.9 2.8 7.5 6.6 8.6 3.8-1.1 6.6-4.7 6.6-8.6V6L12 3.2Z" />
      <path d="m9.3 11.8 1.9 1.9 3.5-3.6" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="12" cy="12" r="1.1" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19.2h16M4 19.2V5" />
      <path d="m7.4 15.6 3.4-3.9 2.9 2.4 4.5-5.3" />
      <path d="M14.6 8.6h3.6v3.6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 20.8s6.6-5.9 6.6-10.4a6.6 6.6 0 1 0-13.2 0C5.4 14.9 12 20.8 12 20.8Z" />
      <circle cx="12" cy="10.2" r="2.4" />
    </>
  ),
  classroom: (
    <>
      <rect x="3.6" y="4.4" width="16.8" height="10.4" rx="1.4" />
      <path d="M8 8.4h8M8 11.2h5" />
      <path d="M12 14.8v4.4M9 19.2h6" />
    </>
  ),
  flask: (
    <>
      <path d="M9.4 3.2h5.2M10.4 3.2v6.4l-4.6 7.7A1.8 1.8 0 0 0 7.3 20h9.4a1.8 1.8 0 0 0 1.5-2.7l-4.6-7.7V3.2" />
      <path d="M8.2 15.4h7.6" />
    </>
  ),
  library: (
    <>
      <path d="M18.6 3.4H7.2a2.6 2.6 0 0 0-2.6 2.6v12a2.6 2.6 0 0 1 2.6-2.6h11.4V3.4Z" />
      <path d="M4.6 18a2.6 2.6 0 0 0 2.6 2.6h11.4v-4.2" />
      <path d="M8.8 7.4h5.6" />
    </>
  ),
  trophy: (
    <>
      <path d="M8.2 4h7.6v4.2a3.8 3.8 0 0 1-7.6 0V4Z" />
      <path d="M8.2 5.4H5.8A1.4 1.4 0 0 0 4.4 6.8a3.4 3.4 0 0 0 3.4 3.4M15.8 5.4h2.4a1.4 1.4 0 0 1 1.4 1.4 3.4 3.4 0 0 1-3.4 3.4" />
      <path d="M12 12v3.2M9.2 20h5.6l-.7-2.6h-4.2L9.2 20Z" />
    </>
  ),
  bus: (
    <>
      <path d="M4.4 7.2A2.8 2.8 0 0 1 7.2 4.4h9.6a2.8 2.8 0 0 1 2.8 2.8v8.4H4.4V7.2Z" />
      <path d="M4.4 9.6h15.2M12 9.6v6" />
      <circle cx="7.6" cy="17.6" r="1.6" />
      <circle cx="16.4" cy="17.6" r="1.6" />
    </>
  ),
  monitor: (
    <>
      <rect x="3.4" y="4.6" width="17.2" height="11" rx="1.6" />
      <path d="M8 8.4h5.6M8 11.6h3.4" />
      <path d="M12 15.6v3.6M8.8 19.2h6.4" />
    </>
  ),
  cctv: (
    <>
      <path d="m3.6 9.4 12.2-4 1.7 4.9-12.2 4-1.7-4.9Z" />
      <path d="M17.5 10.3 21 9.1" />
      <path d="M7.4 14.2v2.2a2.4 2.4 0 0 0 2.4 2.4h4" />
      <path d="M12 18.8h4.4" />
    </>
  ),
  droplet: (
    <>
      <path d="M12 3.4c3 3.8 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5.2 5-9Z" />
      <path d="M9.4 13a2.6 2.6 0 0 0 2.6 2.6" />
    </>
  ),
  medical: (
    <>
      <rect x="3.6" y="6.8" width="16.8" height="12.4" rx="2" />
      <path d="M9 6.8V5.4A1.6 1.6 0 0 1 10.6 3.8h2.8A1.6 1.6 0 0 1 15 5.4v1.4" />
      <path d="M12 10.4v5.2M9.4 13h5.2" />
    </>
  ),
  music: (
    <>
      <path d="M9.2 17.4V5.8l9.6-1.9v11.6" />
      <circle cx="6.8" cy="17.4" r="2.4" />
      <circle cx="16.4" cy="15.5" r="2.4" />
      <path d="m9.2 9.4 9.6-1.9" />
    </>
  ),
  yoga: (
    <>
      <circle cx="12" cy="4.6" r="1.8" />
      <path d="M12 8v5.2" />
      <path d="m8.6 20.2 3.4-4.6 3.4 4.6" />
      <path d="m6.8 10.4 5.2 2.2 5.2-2.2" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4C10.9 4 5 7.2 5 14a5 5 0 0 0 5 5c7 0 10-6.2 10-15Z" />
      <path d="M5.4 19.2c1.9-6 5.8-9.2 10.8-10.4" />
    </>
  ),
  quote: (
    <>
      <path d="M9.6 6.4C7 7.6 5.4 10 5.4 13v4.6h5.4V12H8.2c0-1.9.7-3.2 2.3-4l-.9-1.6Z" />
      <path d="M18 6.4c-2.6 1.2-4.2 3.6-4.2 6.6v4.6h5.4V12h-2.6c0-1.9.7-3.2 2.3-4L18 6.4Z" />
    </>
  ),
  check: (
    <>
      <path d="m4.8 12.4 4.6 4.6 9.8-9.8" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.8" y="5.4" width="16.4" height="14.8" rx="2" />
      <path d="M3.8 9.8h16.4M8.4 3.4v4M15.6 3.4v4" />
    </>
  ),
};

export function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {ICON_PATHS[name]}
    </svg>
  );
}


/** Photo with intrinsic dimensions — for images that size their own box. */
export function Photo({
  img,
  sizes,
  priority = false,
  className = "",
}: {
  img: Img;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={img.src}
      alt={img.alt}
      width={img.w}
      height={img.h}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}

/** Photo that fills its positioned parent — for framed / overlaid tiles. */
export function Cover({
  img,
  sizes,
  priority = false,
  decorative = false,
  className = "",
}: {
  img: Img;
  sizes?: string;
  priority?: boolean;
  /**
   * Set for a full-bleed wash behind a navy band. The photo carries no
   * information there — it is texture under a 95% overlay — so it is given an
   * empty alt instead of announcing "Campus buildings among autumn trees"
   * in the middle of the section.
   */
  decorative?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={img.src}
      alt={decorative ? "" : img.alt}
      aria-hidden={decorative || undefined}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}


/* ——— Shared section furniture ————————————————————————————————— */

/**
 * Page shell. Capped at 1600px (--container-content) with gutters that grow
 * on the way there, so the layout fills a laptop but does not sprawl on an
 * ultra-wide. Header and Footer use the same ladder, so every edge lines up.
 */
export const CONTAINER =
  "mx-auto w-full max-w-content px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20";
/**
 * One section fills the screen, so only one is in view at a time. svh rather
 * than vh keeps mobile browser chrome from shifting it, and min- (not fixed)
 * height lets the long sections — twelve facility tiles, the age table — grow
 * past the fold instead of clipping.
 */
export const SECTION =
  "flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center py-12 sm:py-14 lg:py-16 xl:py-20";
/** Soft, generously rounded card — the school-warm counterpart to a panel. */
export const CARD =
  "rounded-[1.25rem] border border-hairline bg-surface shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0";

/**
 * Rotating pastel tints for the feature tiles — the colour variety that makes
 * a school page feel like one. Each entry pairs an icon well with the border
 * the card takes on hover.
 */
export const TINTS = [
  {
    well: "bg-[#e7edf7] text-[#154a8a]",
    edge: "hover:border-[#c6d4ea]",
    bar: "border-t-[3px] border-t-[#154a8a]",
  },
  {
    well: "bg-[#faf0da] text-[#87661f]",
    edge: "hover:border-[#ecd9ac]",
    bar: "border-t-[3px] border-t-[#a8802f]",
  },
];

/** Gold pill CTA — the crest colour, used for every "apply / visit" action. */
export function GoldLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Btn href={href} tone="gold" className={className}>
      {children}
    </Btn>
  );
}


/**
 * Section header — a gold dash-led eyebrow above a Sora h2 whose keyword runs
 * carry the crest gold.
 */
export function SectionTitle({
  eyebrow,
  title,
  align = "left",
  width = "max-w-3xl",
  tone = "light",
  className = "",
}: {
  eyebrow: string;
  title: string;
  align?: "center" | "left";
  /** Measure of the heading block — narrow it for side-by-side split headers. */
  width?: string;
  /** "dark" flips the palette for the navy bands. */
  tone?: "dark" | "light";
  className?: string;
}) {
  const centered = align === "center";
  const dark = tone === "dark";
  const dash = (
    <span
      aria-hidden="true"
      className={`h-[3px] w-7 rounded-pill ${
        dark ? "bg-[#d6a53f]" : "bg-[#a8802f]"
      }`}
    />
  );
  return (
    <div
      className={`${centered ? "mx-auto text-center" : ""} ${width} ${className}`}
    >
      <p
        className={`eyebrow flex items-center gap-2.5 ${
          dark ? "text-[#d6a53f]" : "text-[#87661f]"
        } ${centered ? "justify-center" : ""}`}
      >
        {dash}
        {eyebrow}
        {centered ? dash : null}
      </p>
      <h2
        className={`mt-4 text-[clamp(1.3rem,1rem+0.9vw,2.05rem)] leading-[1.24] ${
          dark ? "text-white" : ""
        }`}
      >
        {rich(title, dark ? STRONG.headingDark : STRONG.headingLight)}
      </h2>
    </div>
  );
}

/* ——— Stage colours ————————————————————————————————————————————
 * School sites in the region give each class stage its own colour so a parent
 * can tell Nursery from Senior Secondary at a glance. Each entry pairs a solid
 * header band with the soft well and ink used for that stage's accents.
 * ——————————————————————————————————————————————————————————— */

export interface StageColour {
  /** Solid band behind a card header, white text on top. */
  band: string;
  /** Soft tint for icon wells and callouts. */
  well: string;
  /** Readable text colour on white for that stage. */
  ink: string;
  /**
   * The same colour as a group-hover utility. Written out in full because
   * Tailwind extracts class names statically — building one by interpolating
   * `ink` at runtime produces a class that was never compiled.
   */
  hoverInk: string;
  /** Coloured top edge, so the colour reads before the icon does. */
  bar: string;
  /** Border the card takes on hover. */
  edge: string;
}

export const STAGE_COLOURS: Record<string, StageColour> = {
  nursery: {
    band: "bg-[#a8802f]",
    well: "bg-[#faf0da] text-[#87661f]",
    ink: "text-[#87661f]",
    hoverInk: "group-hover:text-[#87661f]",
    bar: "border-t-[3px] border-t-[#a8802f]",
    edge: "hover:border-[#ecd9ac]",
  },
  primary: {
    band: "bg-[#154a8a]",
    well: "bg-[#e7edf7] text-[#154a8a]",
    ink: "text-[#154a8a]",
    hoverInk: "group-hover:text-[#154a8a]",
    bar: "border-t-[3px] border-t-[#154a8a]",
    edge: "hover:border-[#c6d4ea]",
  },
  secondary: {
    band: "bg-[#001344]",
    well: "bg-[#e2e7f2] text-[#001344]",
    ink: "text-[#001344]",
    hoverInk: "group-hover:text-[#001344]",
    bar: "border-t-[3px] border-t-[#001344]",
    edge: "hover:border-[#c2cbdd]",
  },
  "senior-secondary": {
    band: "bg-[#87661f]",
    well: "bg-[#f4ead3] text-[#6d5218]",
    ink: "text-[#6d5218]",
    hoverInk: "group-hover:text-[#6d5218]",
    bar: "border-t-[3px] border-t-[#87661f]",
    edge: "hover:border-[#e3cfa0]",
  },
};

/** Falls back to the crest gold for anything without its own stage colour. */
export const DEFAULT_COLOUR: StageColour = {
  band: "bg-[#a8802f]",
  well: "bg-[#faf4e8] text-[#87661f]",
  ink: "text-[#87661f]",
  hoverInk: "group-hover:text-[#87661f]",
  bar: "border-t-[3px] border-t-[#a8802f]",
  edge: "hover:border-[#ecd9ac]",
};

/* ——— Page hero ————————————————————————————————————————————————— */

/**
 * The masthead every page shares: a campus photo under a navy wash, gold rule,
 * and an optional cut-out beside the copy (the home page uses that slot).
 *
 * The type scale lives here and nowhere else. Each page having its own meant
 * three different scales drifted apart, and the largest overflowed a laptop
 * viewport once the browser was zoomed — so it is deliberately restrained and
 * steps up gently rather than tracking the breakpoint.
 */
export function PageHero({
  image,
  priority = false,
  crumbs,
  h1,
  sub,
  body,
  cta,
  ctaHref = "/admissions",
  secondaryCta,
  secondaryHref,
  cutout,
}: {
  image: Img;
  priority?: boolean;
  /** Breadcrumb trail after Home; omit on the home page itself. */
  crumbs?: Crumb[];
  h1: string;
  sub?: string;
  body?: string;
  cta?: string;
  ctaHref?: string;
  /** Optional second action beside the primary one. */
  secondaryCta?: string;
  secondaryHref?: string;
  /** Overrides the section photograph in the shaped frame. */
  cutout?: {
    src: string;
    w: number;
    h: number;
    alt: string;
    /** Set when the artwork already carries its own backdrop, so the
        decorative gold shape is suppressed rather than doubled up. */
    ownBackdrop?: boolean;
  };
}) {
  return (
    <section className="relative flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center overflow-hidden bg-surface pb-8 pt-4 sm:pb-10 sm:pt-6 lg:pb-14 lg:pt-8">
      <div className={`relative ${CONTAINER}`}>
        <div>
          <div className="relative grid items-center gap-8 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-7">
              {crumbs ? <Breadcrumbs items={crumbs} className="mb-4" /> : null}
              {/* Rule and sub-heading share a line, so the rule reads as an
                  eyebrow marker rather than floating on its own. */}
              <p className="flex items-start gap-2.5 text-[0.6875rem] font-semibold uppercase leading-[1.5] tracking-[0.1em] text-[#154a8a]">
                <span
                  aria-hidden="true"
                  className="mt-[0.45rem] h-[2px] w-8 shrink-0 rounded-pill bg-[#a8802f]"
                />
                {sub ? rich(sub, "font-bold") : null}
              </p>
              <h1 className="mt-4 text-[clamp(1.4rem,1rem+1.2vw,2.35rem)] leading-[1.2] text-ink">
                {rich(h1, "font-bold text-[#154a8a]")}
              </h1>
              {body ? (
                <p className="mt-3 max-w-2xl text-[clamp(0.82rem,0.75rem+0.18vw,0.9375rem)] leading-[1.8] text-text-muted">
                  {rich(body)}
                </p>
              ) : null}
              {cta ? (
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Btn href={ctaHref} tone="teal">
                    {cta}
                  </Btn>
                  {secondaryCta && secondaryHref ? (
                    <Btn href={secondaryHref} tone="outline">
                      {secondaryCta}
                    </Btn>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="relative md:col-span-5">
              {/*
                Blob and figure share one measure — sizing the blob off the
                column stretched it into a wide ellipse on wide screens.

                The radii are deliberately lopsided; values near 50% render as
                a plain circle. The gold sits offset behind the photograph.
              */}
              <div className="relative mx-auto w-full max-w-[14rem] sm:max-w-[17rem] md:max-w-[20rem] lg:max-w-[24rem] xl:max-w-[28rem] 2xl:max-w-[32rem]">
                {!cutout?.ownBackdrop && (
                <span
                  aria-hidden="true"
                  className={`absolute z-0 rounded-[62%_38%_34%_66%/44%_58%_42%_56%] bg-[image:linear-gradient(140deg,#e0b04e,#d6a53f)] ${
                    cutout
                      ? "left-1/2 top-[47%] h-[82%] w-[88%] -translate-x-1/2 -translate-y-1/2 rotate-[8deg] rounded-[58%_42%_39%_61%/49%_37%_63%_51%]"
                      : "-bottom-6 -right-6 h-[104%] w-[104%] rotate-[8deg] sm:-bottom-8 sm:-right-8"
                  }`}
                />
                )}
                {cutout ? (
                  /* A cut-out sits ON the gold with its transparency intact —
                     masking it into the blob would defeat the whole point. */
                  <Image
                    src={cutout.src}
                    alt={cutout.alt}
                    width={cutout.w}
                    height={cutout.h}
                    priority={priority}
                    sizes="(max-width: 768px) 70vw, (max-width: 1280px) 38vw, 32rem"
                    className="relative z-10 h-auto w-full object-contain"
                  />
                ) : (
                  <div className="relative z-10 aspect-square w-full overflow-hidden rounded-[62%_38%_34%_66%/44%_58%_42%_56%] shadow-frame">
                    <Cover
                      img={image}
                      priority={priority}
                      sizes="(max-width: 768px) 60vw, (max-width: 1280px) 30vw, 26rem"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



/* ——— Doodle wash ————————————————————————————————————————————————
 * A faint stationery pattern — pencil, book, ruler, star — behind light
 * sections. It is what stops a page of white cards reading like a brochure
 * for an accountancy firm. Inline SVG so it costs no request.
 * ——————————————————————————————————————————————————————————— */

export function DoodleWash({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        <pattern
          id="ngs-doodles"
          width="180"
          height="180"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-8)"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* pencil */}
            <path d="M18 40 34 24l7 7-16 16-9 2z" />
            <path d="M31 27l7 7" />
            {/* open book */}
            <path d="M104 34c-5-5-12-6-18-6v20c6 0 13 1 18 6 5-5 12-6 18-6V28c-6 0-13 1-18 6z" />
            <path d="M104 34v20" />
            {/* star */}
            <path d="M52 108l5 10 11 1-8 8 2 11-10-5-10 5 2-11-8-8 11-1z" />
            {/* ruler */}
            <path d="M120 104h44v18h-44z" />
            <path d="M129 104v6M138 104v6M147 104v6M156 104v6" />
            {/* apple */}
            <path d="M150 26c-4-4-11-3-14 2-3-5-10-6-14-2-5 5-2 15 6 20 3 2 6 2 8 0 2 2 5 2 8 0 8-5 11-15 6-20z" />
            <path d="M136 24c0-4 2-7 5-8" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ngs-doodles)" />
    </svg>
  );
}

/* ——— Buttons ————————————————————————————————————————————————
 * One button for the whole site. On hover a darker face wipes in from the
 * left and the label lifts a hair — no shine sweep, which read as gimmicky.
 *
 * The wipe animates `scale` from a left origin, so it is composited rather
 * than re-laid-out. `transition-transform` is the right utility here: in
 * Tailwind v4 it covers transform, translate, scale and rotate, whereas
 * naming `transform` in an arbitrary transition would animate nothing.
 * ——————————————————————————————————————————————————————————— */

export type BtnTone = "gold" | "teal" | "outline" | "ghost";

export const BTN_BASE =
  "group/btn relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-pill " +
  "font-bold tracking-tight " +
  "transition-[translate,box-shadow,color,border-color] duration-200 ease-out " +
  "hover:-translate-y-px active:translate-y-0 " +
  "motion-reduce:transition-none motion-reduce:hover:translate-y-0";

/**
 * Padding and type scale, deliberately separate from BTN_BASE. Two sets of
 * padding utilities in one class string are decided by the order Tailwind
 * happens to emit them, not by the order they are written — so the size is
 * picked here instead of being layered on top of a default.
 */
export const BTN_SIZE = {
  sm: "px-4 py-2 text-[clamp(0.75rem,0.71rem+0.1vw,0.8125rem)]",
  md: "px-5 py-2.5 text-[clamp(0.78rem,0.72rem+0.14vw,0.875rem)]",
  lg: "px-6 py-3 text-[clamp(0.78rem,0.72rem+0.14vw,0.875rem)]",
} as const;

/** face = resting colour, wipe = the shade that fills in on hover. */
const TONE: Record<BtnTone, { face: string; wipe: string }> = {
  gold: {
    face: "bg-[#a8802f] text-[#001344] shadow-[0_8px_18px_-10px_rgba(168,128,47,0.85)] hover:shadow-[0_14px_24px_-10px_rgba(168,128,47,0.9)]",
    /* lighter, not darker — navy on #8a6620 is only 3.4:1 */
    wipe: "bg-[#c19a45]",
  },
  teal: {
    face: "bg-[#154a8a] text-white shadow-[0_8px_18px_-10px_rgba(21,74,138,0.85)] hover:shadow-[0_14px_24px_-10px_rgba(21,74,138,0.9)]",
    wipe: "bg-[#0e3466]",
  },
  outline: {
    face: "border-2 border-[#154a8a] text-[#154a8a] hover:text-white",
    wipe: "bg-[#154a8a]",
  },
  ghost: {
    face: "border-2 border-white/45 text-white",
    wipe: "bg-white/15",
  },
};

export const BTN_TONE: Record<BtnTone, string> = {
  gold: TONE.gold.face,
  teal: TONE.teal.face,
  outline: TONE.outline.face,
  ghost: TONE.ghost.face,
};

/** The wiping face. Sits behind the label on its own layer. */
function Wipe({ tone }: { tone: BtnTone }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover/btn:scale-x-100 motion-reduce:hidden ${TONE[tone].wipe}`}
    />
  );
}

export function Btn({
  href,
  tone = "gold",
  children,
  className = "",
}: {
  href: string;
  tone?: BtnTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`${BTN_BASE} ${BTN_SIZE.md} ${BTN_TONE[tone]} ${className}`}>
      <Wipe tone={tone} />
      {children}
    </Link>
  );
}

/* ——— Wave divider ————————————————————————————————————————————
 * Organic edge between bands — softer than a straight seam, and the single
 * cheapest way to stop a page reading like a corporate template.
 * ——————————————————————————————————————————————————————————— */

export function Wave({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute inset-x-0 ${
        flip ? "bottom-0 rotate-180" : "top-0"
      } h-10 w-full sm:h-14 ${className}`}
    >
      <path
        fill="currentColor"
        d="M0 0h1440v22c-120 30-260 46-420 46-190 0-330-24-500-24S180 66 0 90V0Z"
      />
    </svg>
  );
}

/* ——— Checklist ————————————————————————————————————————————————
 * Ticked feature list — the device AIS runs beside its welcome photo.
 * ——————————————————————————————————————————————————————————— */

export function CheckList({
  items,
  strongClass,
  className = "",
}: {
  items: string[];
  strongClass?: string;
  className?: string;
}) {
  return (
    <ul className={`grid gap-3 sm:grid-cols-2 ${className}`}>
      {items.map((item) => (
        <li
          key={item.slice(0, 28)}
          className="flex items-start gap-3 rounded-card border border-hairline bg-surface p-4 shadow-card"
        >
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-[#154a8a] text-white"
          >
            <Icon name="check" className="h-3.5 w-3.5" />
          </span>
          <span className="text-[0.9375rem] leading-[1.7] text-text-muted">
            {rich(item, strongClass)}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ——— Stat counters ————————————————————————————————————————————
 * Big figures on a navy band. Values come from the document; nothing here
 * is invented.
 * ——————————————————————————————————————————————————————————— */

export function StatRow({
  stats,
  className = "",
}: {
  stats: ReadonlyArray<{ value: string; label: string }>;
  className?: string;
}) {
  return (
    <dl className={`grid gap-4 sm:grid-cols-3 lg:gap-5 ${className}`}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col-reverse rounded-card border border-white/12 bg-white/[0.07] px-5 py-7 text-center backdrop-blur-sm"
        >
          <dt className="mt-3 text-[0.8125rem] leading-[1.6] text-[#c2cfe4]">
            {rich(stat.label, STRONG.dark)}
          </dt>
          <dd className="font-heading text-[2.4rem] font-bold leading-none text-white lg:text-[2.75rem]">
            {stat.value.slice(0, -1)}
            <span className="text-[#d6a53f]">{stat.value.slice(-1)}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
