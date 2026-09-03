"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { GalleryItem } from "@/data/types";

/**
 * Tile shapes repeat on a 12-step cycle. Two big squares, a couple of wide
 * panoramas and a tall portrait per cycle break the grid up, and `auto-flow:
 * dense` lets smaller tiles back-fill the gaps those leave behind — so the
 * mosaic stays tight however many photographs a filter leaves on screen.
 */
const SHAPES = [
  "sm:col-span-2 sm:row-span-2",
  "",
  "",
  "sm:col-span-2",
  "",
  "sm:row-span-2",
  "",
  "sm:col-span-2 sm:row-span-2",
  "",
  "",
  "sm:col-span-2",
  "",
] as const;

export default function MosaicGallery({ items }: { items: GalleryItem[] }) {
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [items]);

  const [active, setActive] = useState<string>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const shown = useMemo(
    () => (active === "All" ? items : items.filter((i) => i.category === active)),
    [items, active],
  );

  const move = useCallback(
    (delta: number) =>
      setLightbox((current) =>
        current === null ? null : (current + delta + shown.length) % shown.length,
      ),
    [shown.length],
  );

  /* Arrow keys page through the lightbox; Esc closes it. */
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    /* Freeze the page behind the overlay. */
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [lightbox, move]);

  const chip = (label: string, count: number, on: boolean) => (
    <button
      key={label}
      type="button"
      onClick={() => {
        setActive(label);
        setLightbox(null);
      }}
      aria-pressed={on}
      className={`group inline-flex items-center gap-2 rounded-pill border-2 px-4 py-2 text-[0.8125rem] font-bold transition duration-200 sm:text-sm ${
        on
          ? "border-[#a8802f] bg-[#001344] text-white"
          : "border-hairline bg-surface text-text-muted hover:border-[#a8802f] hover:text-[#87661f]"
      }`}
    >
      {label}
      <span
        className={`rounded-pill px-1.5 py-0.5 text-[0.65rem] leading-none ${
          on ? "bg-[#d6a53f] text-[#001344]" : "bg-bg-alt text-faint"
        }`}
      >
        {count}
      </span>
    </button>
  );

  const current = lightbox === null ? null : shown[lightbox];

  return (
    <div>
      {/* ——— Filter rail ——— */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {chip("All", items.length, active === "All")}
        {categories.map(([name, count]) => chip(name, count, active === name))}
      </div>

      {/* ——— The mosaic ——— */}
      <ul className="mt-9 grid auto-rows-[9rem] grid-cols-2 gap-2.5 [grid-auto-flow:dense] sm:auto-rows-[11rem] sm:grid-cols-4 sm:gap-3 lg:auto-rows-[12rem] lg:grid-cols-6">
        {shown.map((item, index) => (
          <li
            key={item.id}
            className={`group relative overflow-hidden rounded-[1.1rem] bg-bg-alt shadow-card ${SHAPES[index % SHAPES.length]}`}
          >
            <button
              type="button"
              onClick={() => setLightbox(index)}
              className="absolute inset-0 h-full w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#d6a53f]"
              aria-label={`Open photo: ${item.caption}`}
            >
              <Image
                src={item.imageUrl ?? ""}
                alt={item.caption}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
                className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              {/* Caption rides up out of the bottom edge on hover. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,19,68,0.92),rgba(0,19,68,0.15)_45%,transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
              />
              <span className="absolute inset-x-0 bottom-0 translate-y-3 p-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none">
                <span className="block text-[0.6875rem] font-bold uppercase tracking-[0.09em] text-[#d6a53f]">
                  {item.category}
                </span>
                <span className="mt-1 block text-[0.8125rem] font-semibold leading-snug text-white">
                  {item.caption}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {shown.length === 0 ? (
        <p className="mt-10 text-center text-sm text-text-muted">
          No photographs in this category yet.
        </p>
      ) : null}

      {/* ——— Lightbox ——— */}
      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.caption}
          className="fixed inset-0 z-[100] flex flex-col bg-[#000c2e]/95 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 text-white sm:px-6">
            <span className="text-[0.8125rem] font-semibold text-[#c2cfe4]">
              {(lightbox ?? 0) + 1} / {shown.length}
            </span>
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="flex h-10 w-10 items-center justify-center rounded-pill border border-white/25 transition-colors hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-3 sm:px-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous photo"
              className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-pill border border-white/25 text-white transition-colors hover:bg-white/10 sm:left-5"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                <path d="m15 18-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <figure className="flex h-full max-h-full flex-col items-center justify-center">
              <div className="relative h-full max-h-[72vh] w-full max-w-5xl">
                <Image
                  src={current.imageUrl ?? ""}
                  alt={current.caption}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>
              <figcaption className="mt-4 max-w-2xl text-center">
                <span className="block text-[0.6875rem] font-bold uppercase tracking-[0.09em] text-[#d6a53f]">
                  {current.category}
                </span>
                <span className="mt-1 block text-sm text-white">{current.caption}</span>
              </figcaption>
            </figure>

            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next photo"
              className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-pill border border-white/25 text-white transition-colors hover:bg-white/10 sm:right-5"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                <path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
