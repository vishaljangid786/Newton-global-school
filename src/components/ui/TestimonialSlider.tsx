"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { initials } from "@/lib/format";
import type { PublicTestimonial } from "@/lib/testimonials-store";

/**
 * Testimonial slider — two quotes in view on a wide screen, one on a phone,
 * advancing a whole page at a time.
 *
 * The track is exactly as wide as its viewport and the slides overflow it, so
 * one page is always `translateX(-100%)` no matter how many slides fit. That
 * keeps the maths independent of the breakpoint: the only thing JavaScript
 * needs to know about `perView` is how many dots to draw.
 *
 * Autoplay stops on hover, on focus, when the tab is hidden and whenever the
 * reader has asked for reduced motion.
 */

const ROLE_LABEL: Record<PublicTestimonial["role"], string> = {
  student: "Student",
  parent: "Parent",
  teacher: "Teacher",
};

const AUTOPLAY_MS = 7000;
/** Ignore a drag shorter than this — it was a tap, not a swipe. */
const SWIPE_THRESHOLD_PX = 48;

export default function TestimonialSlider({
  items,
  autoplay = true,
  className = "",
}: {
  items: PublicTestimonial[];
  autoplay?: boolean;
  className?: string;
}) {
  const baseId = useId();
  const [page, setPage] = useState(0);
  const [perView, setPerView] = useState(1);
  const [paused, setPaused] = useState(false);
  const dragStart = useRef<number | null>(null);

  /* perView is only ever read for the dot count and the aria bookkeeping.
     Starting at 1 matches the server render, and page 0 is translateX(0)
     either way, so there is nothing for hydration to disagree about. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const sync = () => setPerView(mq.matches ? 2 : 1);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const pageCount = Math.max(1, Math.ceil(items.length / perView));
  /* A narrowing viewport can leave the stored page past the end. Clamping on
     render rather than in an effect avoids a second render pass. */
  const current = Math.min(page, pageCount - 1);

  /*
   * How many slides the track is shifted by, which is not simply
   * `current * perView`: an odd number of quotes would leave the final page
   * half empty, a lone card against a gap. Clamping the offset to the last
   * full view slides that page back by one instead, so the end of the list
   * always looks like every other page. The last two pages then share a
   * slide, which is what a scroll container does when it hits its end.
   */
  const maxOffset = Math.max(0, items.length - perView);
  const offset = Math.min(current * perView, maxOffset);
  /* The track is exactly one view wide, so one slide is 100%/perView. */
  const translatePct = (offset / perView) * 100;

  const goTo = useCallback(
    (next: number) => setPage(((next % pageCount) + pageCount) % pageCount),
    [pageCount]
  );

  useEffect(() => {
    if (!autoplay || paused || pageCount < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(
      () => setPage((shown) => (shown + 1) % pageCount),
      AUTOPLAY_MS
    );
    return () => window.clearInterval(timer);
  }, [autoplay, paused, pageCount]);

  if (items.length === 0) return null;

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(current + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(current - 1);
    }
  };

  return (
    <div
      className={className}
      role="group"
      aria-roledescription="carousel"
      aria-label="What families say about Newton Global School"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/*
        * The clip box, not the track, carries the bleed. The slides pad
        * themselves to make the gutter between cards, so without this the
        * outer two would sit a gutter's width inside the section's own edge.
        * Widening the clip box instead of narrowing the track keeps the two
        * exactly the same width — which is what makes one page always equal
        * translateX(-100%), whatever the breakpoint. Putting the negative
        * margin on the track breaks that: the track overhangs the clip box
        * and every page drifts by the overhang.
        *
        * `overflow-x: clip` rather than `hidden`, because hidden on one axis
        * forces the other to `auto` and the box would then crop the cards'
        * shadows into a hard horizontal line. Clip leaves the y axis genuinely
        * visible, so a shadow can fall outside the box while the neighbouring
        * slide is still hidden.
        */}
      <div
        className="-mx-1.5 overflow-x-clip overflow-y-visible sm:-mx-2"
        onPointerDown={(event) => {
          dragStart.current = event.clientX;
        }}
        onPointerUp={(event) => {
          const start = dragStart.current;
          dragStart.current = null;
          if (start === null) return;
          const moved = event.clientX - start;
          if (Math.abs(moved) < SWIPE_THRESHOLD_PX) return;
          goTo(moved < 0 ? current + 1 : current - 1);
        }}
        onPointerCancel={() => {
          dragStart.current = null;
        }}
      >
        <ul
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          id={`${baseId}-track`}
          style={{ transform: `translateX(-${translatePct}%)` }}
        >
          {items.map((item, index) => {
            const onCurrentPage = index >= offset && index < offset + perView;
            return (
              <li
                key={item.id}
                aria-hidden={!onCurrentPage}
                inert={!onCurrentPage}
                className="w-full shrink-0 px-1.5 sm:px-2 lg:w-1/2"
              >
                <TestimonialCard item={item} lift={false} />
              </li>
            );
          })}
        </ul>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing page {current + 1} of {pageCount}
      </p>

      {pageCount > 1 ? (
        <div className="mt-9 flex items-center justify-center gap-5">
          <SliderButton
            direction="prev"
            onClick={() => goTo(current - 1)}
            label="Previous testimonials"
          />

          <div className="flex items-center gap-1.5">
            {Array.from({ length: pageCount }, (_, dot) => (
              <button
                key={dot}
                type="button"
                onClick={() => goTo(dot)}
                aria-label={`Show testimonials page ${dot + 1} of ${pageCount}`}
                aria-current={dot === current ? "true" : undefined}
                aria-controls={`${baseId}-track`}
                className="group p-1"
              >
                <span
                  className={`block h-2 rounded-pill transition-all duration-300 motion-reduce:transition-none ${
                    dot === current
                      ? "w-7 bg-[#a8802f]"
                      : "w-2 bg-[#a8802f]/30 group-hover:bg-[#a8802f]/60"
                  }`}
                />
              </button>
            ))}
          </div>

          <SliderButton
            direction="next"
            onClick={() => goTo(current + 1)}
            label="Next testimonials"
          />
        </div>
      ) : null}
    </div>
  );
}

function SliderButton({
  direction,
  onClick,
  label,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-pill border border-[#a8802f]/35 bg-surface text-[#87661f] shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-[#a8802f] hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d={direction === "prev" ? "M14.5 6 9 12l5.5 6" : "M9.5 6 15 12l-5.5 6"}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/**
 * One quote. Exported so the listing page can lay the same card out in a grid
 * without the slider around it.
 */
export function TestimonialCard({
  item,
  lift = true,
}: {
  item: PublicTestimonial;
  /**
   * Lift and deepen the shadow on hover. Off inside the slider: the clip box
   * can only spare a gutter's width sideways, and a raised shadow is wider
   * than that, so it would be sliced into a visible seam down the outermost
   * card. In a plain grid nothing clips it.
   */
  lift?: boolean;
}) {
  return (
    <figure
      className={`flex h-full flex-col rounded-[1.25rem] border border-[#a8802f]/20 bg-surface p-7 shadow-card transition duration-300 sm:p-8 ${
        lift
          ? "hover:-translate-y-1 hover:border-[#a8802f]/45 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          : "hover:border-[#a8802f]/45"
      }`}
    >
      <span
        aria-hidden="true"
        className="block font-heading text-[3.25rem] font-bold leading-[0.55] text-[#a8802f]/30"
      >
        &ldquo;
      </span>

      <blockquote className="mt-5 flex-1 text-[clamp(0.9375rem,0.9rem+0.25vw,1.125rem)] leading-[1.75] text-ink">
        {item.quote}
      </blockquote>

      <figcaption className="mt-7 flex items-center gap-3.5 border-t border-[#a8802f]/15 pt-5">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-[#faf4e8] font-heading text-sm font-bold text-[#87661f] ring-2 ring-[#a8802f]/25"
        >
          {initials(item.authorName)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[0.9375rem] font-bold text-ink">
            {item.authorName}
          </span>
          <span className="block truncate text-[0.8125rem] text-text-muted">
            {[ROLE_LABEL[item.role], item.roleDetail, item.branchName]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
