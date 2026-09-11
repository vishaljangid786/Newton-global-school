"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { Btn, CONTAINER, Icon, type IconName, rich, STRONG } from "@/components/site/school-kit";

/**
 * The home page masthead: a navy panel carrying the copy, a warm gold-lit
 * panel carrying the pupil, and badges floating over the seam between them.
 *
 * Its own component rather than a variant of PageHero. PageHero is the shared
 * masthead for around twenty inner pages, and a coloured ground and a
 * full-bleed figure would have dragged all of them along.
 *
 * The copy is the same wording, in the same order, at the same type scale as
 * before — only the palette flipped for the dark ground.
 */

export interface HighlightChip {
  icon: IconName;
  label: string;
  /** Shown in the popover on hover or focus. */
  detail: string;
  /** Placement within the figure column. */
  place: string;
}

/* ——— School motifs ————————————————————————————————————————————
 * Pencil, books, ruler, globe, flask, paint palette — hand-drawn in a single
 * gold stroke, scattered around the figure. A school masthead that is only a
 * photograph and a gradient could belong to a bank; these are what say "this
 * is a school" before a word of the copy has been read.
 *
 * All six are `aria-hidden` decoration on a 24-unit grid, so they scale off
 * one `className` and carry no meaning a screen reader has to wade through.
 * ——————————————————————————————————————————————————————————— */

type MotifName = "pencil" | "books" | "ruler" | "globe" | "flask" | "palette";

const MOTIF_PATHS: Record<MotifName, React.ReactNode> = {
  pencil: (
    <>
      <path d="M3.6 20.4l1.1-4.3L15.9 4.9a2 2 0 0 1 2.8 0l1.4 1.4a2 2 0 0 1 0 2.8L8.9 20.4l-5.3 0Z" />
      <path d="M14.6 6.2l4.2 4.2M4.7 16.1l4.2 4.3" />
    </>
  ),
  books: (
    <>
      <path d="M4 5.2h4.6a2 2 0 0 1 2 2v11a1.6 1.6 0 0 0-1.6-1.6H4Z" />
      <path d="M20 5.2h-4.6a2 2 0 0 0-2 2v11a1.6 1.6 0 0 1 1.6-1.6H20Z" />
      <path d="M12 8.4v9.6" />
    </>
  ),
  ruler: (
    <>
      <rect x="2.6" y="8.4" width="18.8" height="7.2" rx="1.2" />
      <path d="M6.6 8.4v2.8M10.2 8.4v4M13.8 8.4v2.8M17.4 8.4v4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M3.4 12h17.2" />
      <path d="M12 3.4a13 13 0 0 1 0 17.2 13 13 0 0 1 0-17.2Z" />
    </>
  ),
  flask: (
    <>
      <path d="M9.4 3.2h5.2M10.4 3.2v6.4l-4.6 7.7A1.8 1.8 0 0 0 7.3 20h9.4a1.8 1.8 0 0 0 1.5-2.7l-4.6-7.7V3.2" />
      <path d="M8.2 15.4h7.6" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3.4a8.6 8.6 0 0 0 0 17.2c1.2 0 1.8-.8 1.8-1.7 0-1.1-.9-1.5-.9-2.5 0-.8.7-1.4 1.6-1.4h1.6a4.5 4.5 0 0 0 4.5-4.5c0-3.9-3.9-7.1-8.6-7.1Z" />
      <circle cx="7.7" cy="11.2" r="1.1" />
      <circle cx="10.4" cy="7.4" r="1.1" />
      <circle cx="15.2" cy="7.8" r="1.1" />
    </>
  ),
};

/**
 * Where each motif sits and how it is turned.
 *
 * Positions are percentages of the FIGURE box, not of the whole column, and
 * every one is negative on its own side — so the six sit just outside the
 * turning rings and ring the pupil. Hung off the column instead they drifted
 * into the empty navy between the copy and the figure and read as clutter
 * floating in the middle of the masthead rather than as the school's own
 * furniture arranged around him.
 *
 * Each gets its own float delay so the six never bob in unison.
 */
const MOTIFS: ReadonlyArray<{
  name: MotifName;
  place: string;
  size: string;
  rotate: string;
  delay: string;
}> = [
  { name: "pencil", place: "-left-[13%] top-[4%]", size: "h-8 w-8 lg:h-11 lg:w-11", rotate: "rotate-[14deg]", delay: "0s" },
  { name: "books", place: "-right-[12%] top-[2%]", size: "h-8 w-8 lg:h-11 lg:w-11", rotate: "-rotate-[10deg]", delay: "-1.4s" },
  { name: "ruler", place: "-left-[19%] top-[40%]", size: "h-8 w-8 lg:h-11 lg:w-11", rotate: "-rotate-[24deg]", delay: "-0.7s" },
  { name: "globe", place: "-right-[18%] top-[36%]", size: "h-9 w-9 lg:h-12 lg:w-12", rotate: "rotate-[6deg]", delay: "-2.8s" },
  { name: "flask", place: "-left-[11%] bottom-[14%]", size: "h-8 w-8 lg:h-10 lg:w-10", rotate: "rotate-[10deg]", delay: "-3.5s" },
  { name: "palette", place: "-right-[9%] bottom-[10%]", size: "h-8 w-8 lg:h-11 lg:w-11", rotate: "-rotate-[8deg]", delay: "-2.1s" },
];

function Motif({
  name,
  place,
  size,
  rotate,
  delay,
}: {
  name: MotifName;
  place: string;
  size: string;
  rotate: string;
  delay: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ animationDelay: delay }}
      className={`ngs-float pointer-events-none absolute z-0 ${place}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${size} ${rotate} text-[#d6a53f]/60 drop-shadow-[0_2px_10px_rgba(0,6,26,0.65)]`}
      >
        {MOTIF_PATHS[name]}
      </svg>
    </span>
  );
}

export default function HomeHero({
  h1,
  sub,
  body,
  cta,
  ctaHref,
  secondaryCta,
  secondaryHref,
  cutout,
  chips,
}: {
  h1: string;
  sub?: string;
  body?: string;
  cta?: string;
  ctaHref: string;
  secondaryCta?: string;
  secondaryHref?: string;
  cutout: { src: string; w: number; h: number; alt: string };
  chips: readonly HighlightChip[];
}) {
  return (
    /*
     * Sized by its contents, not by the viewport.
     *
     * This was `min-h-[calc(100svh-var(--header-h))]` — the same rule that was
     * pulled out of every other band on the site, and it failed here for the
     * same reason plus one more: svh tracks the VIEWPORT, so it grows when the
     * browser is zoomed out. At 33% zoom the viewport is ~2700 CSS px tall, so
     * the masthead became 2700px tall, the copy floated in the middle of an
     * empty navy field and the pupil sat a full screen below it. The hero is
     * now as tall as the copy and the figure make it, on every screen and at
     * every zoom level.
     */
    <section className="relative flex flex-col overflow-hidden bg-[#001344] text-white">
      {/* ——— Ground ——— */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,#000c2e_0%,#001344_46%,#062a63_100%)]"
      />
      {/* Two slow blooms so the navy is never a flat wall of colour. */}
      <span
        aria-hidden="true"
        className="ngs-aurora pointer-events-none absolute -left-1/4 top-[-30%] h-[80vh] w-[80vh] rounded-pill bg-[radial-gradient(circle,rgba(21,74,138,0.55),transparent_66%)] blur-3xl"
      />
      <span
        aria-hidden="true"
        style={{ animationDelay: "-11s" }}
        className="ngs-aurora pointer-events-none absolute -right-[12%] top-[-18%] h-[72vh] w-[72vh] rounded-pill bg-[radial-gradient(circle,rgba(214,165,63,0.30),transparent_64%)] blur-3xl"
      />
      <span
        aria-hidden="true"
        style={{ animationDelay: "-6s" }}
        className="ngs-aurora pointer-events-none absolute right-[8%] bottom-[-30%] h-[60vh] w-[60vh] rounded-pill bg-[radial-gradient(circle,rgba(21,74,138,0.5),transparent_62%)] blur-3xl"
      />
      {/* Ruled paper, not graph paper: the wide horizontal rule with a single
          margin line down the left is a school exercise book, and it reads as
          one even at 4% opacity. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(214,165,63,0.10)_1px,transparent_1px)] [background-size:100%_2.25rem,100%_100%] [background-position:0_0,4.5rem_0] [mask-image:radial-gradient(circle_at_50%_45%,#000_35%,transparent_80%)]"
      />

      {/*
        The split starts at lg, not md. At 768 the figure column was 5/12 of
        768px — about 300px — so the pupil was shrunk into a corner, his motifs
        were sliced off by the section edge, and he still overlapped the chip
        row beside him. lg is also exactly where the floating chips take over
        from the inline ones, so the two halves of the design now switch at the
        same breakpoint instead of fighting each other for 256px.
      */}
      <div className={`relative flex flex-1 flex-col ${CONTAINER} pb-0 pt-10 sm:pt-12 lg:pt-14`}>
        {/* The figure is the last item in both layouts and its artwork is
            masked to fade into the navy at its own foot, so the container
            takes no bottom padding — the crop lands on the section's edge and
            the pupil reads as standing on it. */}
        <div className="grid w-full flex-1 items-center gap-10 lg:grid-cols-12 lg:gap-10">
          {/* ——— Copy ——— */}
          <div className="lg:col-span-7 lg:flex lg:flex-col lg:justify-center lg:pb-16 xl:col-span-6">
            {/*
              The words live in their own <span>. `rich()` returns a LIST of
              nodes — one per `**bold**` run — and dropping that list straight
              into a flex row made every run a separate flex item: the eyebrow
              broke into two columns with a 10px gap stranded mid-sentence and
              "RBSE EDUCATION" marooned on its own line. One child, one flex
              item, one sentence that wraps like a sentence.
            */}
            <p
              style={{ animationDelay: "0.05s" }}
              className="ngs-rise flex items-start gap-2.5 text-[0.6875rem] font-semibold uppercase leading-[1.6] tracking-[0.14em] text-[#d6a53f] sm:text-[0.75rem]"
            >
              <span
                aria-hidden="true"
                className="mt-[0.5rem] h-[2px] w-8 shrink-0 rounded-pill bg-[#d6a53f]"
              />
              <span className="min-w-0">{sub ? rich(sub, "font-bold") : null}</span>
            </p>
            <h1
              style={{ animationDelay: "0.16s" }}
              className="ngs-rise mt-5 text-[clamp(1.75rem,1.1rem+2.4vw,3.75rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-white"
            >
              {rich(h1, STRONG.headingDark)}
            </h1>
            {body ? (
              <p
                style={{ animationDelay: "0.28s" }}
                className="ngs-rise mt-5 max-w-xl text-[clamp(0.875rem,0.82rem+0.28vw,1.0625rem)] leading-[1.8] text-[#c2cfe4]"
              >
                {rich(body, "font-bold text-white")}
              </p>
            ) : null}
            {cta ? (
              <div
                style={{ animationDelay: "0.4s" }}
                className="ngs-rise mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
              >
                <Btn href={ctaHref} tone="gold">
                  {cta}
                </Btn>
                {secondaryCta && secondaryHref ? (
                  <Btn href={secondaryHref} tone="light">
                    {secondaryCta}
                  </Btn>
                ) : null}
              </div>
            ) : null}

            {/*
              The same three highlights the desktop floats beside the figure.
              They used to be `hidden lg:block` and nothing replaced them, so
              every phone visitor lost the curriculum, safety and transport
              lines entirely — the three things a parent actually scans for.
              Below xl they become a plain wrapping row under the buttons.

              xl, not lg. The floating version needs clear navy either side of
              the pupil to land on; at 1024 the figure column is 5/12 of the
              width and the badges came down on his shoulder and his chest.
              1280 is the first width where they have somewhere to sit.
            */}
            <ul
              style={{ animationDelay: "0.52s" }}
              className="ngs-rise mt-8 flex flex-wrap gap-2 xl:hidden"
            >
              {chips.map((chip) => (
                <li key={chip.label}>
                  <span className="flex items-center gap-2 rounded-pill border border-white/20 bg-white/10 py-1.5 pl-1.5 pr-3 text-[0.75rem] font-bold text-white backdrop-blur-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-pill bg-[#d6a53f] text-[#001344]">
                      <Icon name={chip.icon} className="h-3.5 w-3.5" />
                    </span>
                    {chip.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ——— Figure ———
              The artwork is cropped at its own bottom edge — the pupil's legs
              run off the file — so it is anchored flush to the foot of the
              section. The crop then lands on the section's own edge and reads
              as standing on it rather than stopping in mid-air. */}
          <div className="relative flex items-end justify-center self-end lg:col-span-5 xl:col-span-6">
            {/*
              Two boxes, not one. The outer box is the badge field and fills
              the column; the inner one holds the figure and its rings. Hanging
              the badges off the figure instead meant they sat outside the
              column and were sliced off by the section's overflow-hidden, and
              shrinking the figure to make room only left it stranded in empty
              navy. This way the figure stays large and the badges still have
              somewhere to sit.
            */}
            <div className="relative w-full max-w-[16rem] sm:max-w-[18rem] md:max-w-[22rem] lg:max-w-[32rem] xl:max-w-[40rem] 2xl:max-w-[44rem]">
              <div className="relative mx-auto flex w-full items-end justify-center lg:w-[74%] xl:w-[66%] 2xl:w-[62%]">
                {/* Pencil, books, ruler, globe, flask, palette — the school
                    furniture, ringed around the pupil rather than on him. */}
                {MOTIFS.map((motif) => (
                  <Motif key={motif.name} {...motif} />
                ))}

                {/* Glow, then two rings turning against each other. */}
                <span
                  aria-hidden="true"
                  className="absolute bottom-[8%] left-1/2 aspect-square w-[104%] -translate-x-1/2 rounded-pill bg-[radial-gradient(circle_at_50%_52%,rgba(255,214,138,0.80)_0%,rgba(224,176,78,0.55)_38%,rgba(190,140,50,0.18)_62%,rgba(190,140,50,0)_74%)] blur-[2px]"
                />
                <span
                  aria-hidden="true"
                  className="ngs-spin-slow absolute bottom-[8%] left-1/2 aspect-square w-[94%] -translate-x-1/2 rounded-pill border border-dashed border-white/20"
                />
                <span
                  aria-hidden="true"
                  className="ngs-spin-rev absolute bottom-[8%] left-1/2 aspect-square w-[110%] -translate-x-1/2 rounded-pill border border-white/10"
                />

                <Image
                  src={cutout.src}
                  alt={cutout.alt}
                  width={cutout.w}
                  height={cutout.h}
                  preload
                  sizes="(max-width: 768px) 62vw, (max-width: 1280px) 34vw, 29rem"
                  /* The artwork ends mid-thigh, so meeting the section edge
                     squarely left a guillotine line across the trousers. Fading
                     the last stretch into the navy lets him emerge from it
                     instead of being cut off by it. */
                  className="ngs-rise-figure relative z-10 h-auto w-full select-none object-contain drop-shadow-[0_28px_40px_rgba(0,6,26,0.55)] [mask-image:linear-gradient(to_bottom,#000_84%,rgba(0,0,0,0.55)_94%,transparent_100%)]"
                />
              </div>

              {chips.map((chip, index) => (
                <Chip key={chip.label} chip={chip} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * A floating highlight. It drifts on its own, lifts under the pointer, and
 * opens a one-line popover. Keyboard users get the same popover on focus.
 */
function Chip({ chip, index }: { chip: HighlightChip; index: number }) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`absolute z-20 hidden xl:block ${chip.place}`}
      style={{ animationDelay: `${index * 0.9}s` }}
    >
      <div className="ngs-float">
        <button
          type="button"
          aria-describedby={open ? id : undefined}
          aria-expanded={open}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onClick={() => setOpen((value) => !value)}
          className="flex items-center gap-2 rounded-pill border border-white/25 bg-white/12 py-2 pl-2 pr-3.5 text-[0.75rem] font-bold text-white shadow-frame backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-[#d6a53f]/70 hover:bg-white/20 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-pill bg-[#d6a53f] text-[#001344]">
            <Icon name={chip.icon} className="h-3.5 w-3.5" />
          </span>
          {chip.label}
        </button>

        <span
          id={id}
          role="tooltip"
          className={`pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-52 -translate-x-1/2 rounded-[0.875rem] border border-white/15 bg-white px-3.5 py-2.5 text-[0.75rem] font-medium leading-[1.6] text-ink shadow-frame transition duration-200 motion-reduce:transition-none ${
            open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
          }`}
        >
          {chip.detail}
        </span>
      </div>
    </div>
  );
}
