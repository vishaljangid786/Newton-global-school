"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { GalleryItem } from "@/data/types";
import { youTubeEmbedUrl, youTubeWatchUrl } from "@/lib/youtube";

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

/** Play triangle, used on every video tile and nowhere else. */
function PlayBadge({ big = false }: { big?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-pill bg-[#001344]/55 text-white ring-1 ring-white/40 backdrop-blur-[2px] transition duration-300 group-hover:scale-110 group-hover:bg-[#8a6620] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
        big ? "h-16 w-16" : "h-11 w-11"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className={big ? "ml-1 h-7 w-7" : "ml-0.5 h-5 w-5"}>
        <path d="M8 5.5v13l11-6.5z" />
      </svg>
    </span>
  );
}

/** Photos / Videos / All — the top-level split above the category chips. */
type MediaTab = "All" | "Photos" | "Videos";

export default function MosaicGallery({ items }: { items: GalleryItem[] }) {
  const [tab, setTab] = useState<MediaTab>("All");
  const [active, setActive] = useState<string>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const counts = useMemo(() => {
    const videos = items.filter((i) => i.mediaType === "video").length;
    return { all: items.length, videos, photos: items.length - videos };
  }, [items]);

  /*
   * The media tab narrows first, and the category chips count within it — so
   * "Sports 3" under Videos means three sports videos, not three sports
   * photographs of which none is a video.
   */
  const inTab = useMemo(
    () =>
      tab === "All"
        ? items
        : items.filter((i) =>
            tab === "Videos" ? i.mediaType === "video" : i.mediaType !== "video",
          ),
    [items, tab],
  );

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of inTab) map.set(item.category, (map.get(item.category) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [inTab]);
  /*
   * Rendering all 156 tiles at once put ~1,500 srcset URLs and 156 <img>
   * elements into one document. The whole set still filters and paginates
   * client-side; only the slice on screen is mounted.
   */
  const PAGE = 40;
  const [limit, setLimit] = useState(PAGE);

  const shown = useMemo(
    () => (active === "All" ? inTab : inTab.filter((i) => i.category === active)),
    [inTab, active],
  );
  const visible = useMemo(() => shown.slice(0, limit), [shown, limit]);

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
      if (event.key === "Escape") {
        setLightbox(null);
        return;
      }
      /*
       * Left/Right belong to the video player while it has focus — they seek
       * five seconds, which is what someone pressing them on a playing clip
       * means. Paging to the next item at the same time would rip the video
       * out from under them. Photographs keep the old behaviour.
       */
      const target = event.target as HTMLElement | null;
      if (target && target.closest("video, iframe")) return;
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
        setLimit(PAGE);
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
      {/* ——— Photos / Videos tabs ———
          Only rendered once there is something in both columns: a school with
          no videos yet should not be shown an empty Videos tab, and one with
          only videos does not need a Photos tab either. */}
      {counts.videos > 0 && counts.photos > 0 ? (
        <div
          role="tablist"
          aria-label="Filter by media type"
          className="mx-auto mb-6 flex w-fit items-center gap-1 rounded-pill border border-hairline bg-bg-alt p-1"
        >
          {(
            [
              ["All", counts.all],
              ["Photos", counts.photos],
              ["Videos", counts.videos],
            ] as const
          ).map(([name, count]) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={tab === name}
              onClick={() => {
                setTab(name);
                /* The chosen category may not exist inside the new tab. */
                setActive("All");
                setLightbox(null);
                setLimit(PAGE);
              }}
              className={`inline-flex items-center gap-2 rounded-pill px-5 py-2 text-[0.8125rem] font-bold transition duration-200 sm:text-sm ${
                tab === name
                  ? "bg-[#001344] text-white shadow-card"
                  : "text-text-muted hover:text-[#87661f]"
              }`}
            >
              {name === "Videos" ? (
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor">
                  <path d="M8 5.5v13l11-6.5z" />
                </svg>
              ) : null}
              {name}
              <span
                className={`rounded-pill px-1.5 py-0.5 text-[0.65rem] leading-none ${
                  tab === name ? "bg-[#d6a53f] text-[#001344]" : "bg-surface text-faint"
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {/* ——— Filter rail ——— */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {chip("All", inTab.length, active === "All")}
        {categories.map(([name, count]) => chip(name, count, active === name))}
      </div>

      {/* ——— The mosaic ——— */}
      <ul className="mt-9 grid auto-rows-[9rem] grid-cols-2 gap-2.5 [grid-auto-flow:dense] sm:auto-rows-[11rem] sm:grid-cols-4 sm:gap-3 lg:auto-rows-[12rem] lg:grid-cols-6">
        {visible.map((item, index) => (
          <li
            key={item.id}
            className={`group relative overflow-hidden rounded-[1.1rem] bg-bg-alt shadow-card ${SHAPES[index % SHAPES.length]}`}
          >
            <button
              type="button"
              onClick={() => setLightbox(index)}
              className="absolute inset-0 h-full w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#d6a53f]"
              aria-label={`${item.mediaType === "video" ? "Play video" : "Open photo"}: ${item.caption}`}
            >
              {/*
                A video with no poster (an uploaded clip whose cover image was
                left blank) previews as the <video> element itself at
                preload="metadata" — the browser pulls a frame, not the file.
                Everything else, photographs and YouTube alike, has a still.
              */}
              {item.mediaType === "video" && !item.imageUrl ? (
                <video
                  src={item.videoUrl}
                  muted
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                  className="h-full w-full bg-bg-alt object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              ) : (
                <Image
                  src={item.imageUrl ?? ""}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
                  className="img-skeleton object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              )}
              {item.mediaType === "video" ? <PlayBadge /> : null}
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
          {tab === "Videos"
            ? "No videos in this category yet."
            : "No photographs in this category yet."}
        </p>
      ) : null}

      {visible.length < shown.length ? (
        <div className="mt-9 text-center">
          <button
            type="button"
            onClick={() => setLimit((n) => n + PAGE)}
            className="inline-flex items-center gap-2 rounded-pill border-2 border-[#a8802f] px-6 py-3 text-[0.9375rem] font-bold text-[#87661f] transition duration-200 hover:bg-[#faf4e8]"
          >
            Show more
            <span className="text-[0.8125rem] font-semibold text-faint">
              {visible.length} / {shown.length}
            </span>
          </button>
        </div>
      ) : null}

      {/*
        * ——— Lightbox ———
        * Portalled to <body> on purpose. This component renders inside a
        * <Reveal>, which animates `translate` — and a transformed ancestor
        * becomes the containing block for `position: fixed`, so an overlay
        * left in place here sizes itself to the 9,000px mosaic instead of the
        * viewport. Escaping to <body> is the only reliable fix.
        */}
      {/* `current` is only set by a click, so this never runs during SSR. */}
      {current
        ? createPortal(
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

            {/* w-full matters: the figure is a flex item under `items-center`, so
                without it it shrinks to its caption and the picture with it. */}
            <figure className="flex h-full w-full max-w-5xl flex-col items-center justify-center">
              <div className="relative min-h-0 w-full flex-1">
                {/*
                  Three players, one slot.

                  YouTube goes in an iframe on the -nocookie host, and only
                  once the tile has been opened — an iframe rendered with the
                  grid would have every video on the page contacting YouTube
                  before anyone pressed anything.

                  An uploaded clip gets the browser's own <video> controls.
                  `key` is the item id so that moving to the next video swaps
                  the source instead of leaving the previous one playing: React
                  would otherwise reuse the element and keep its media state.
                */}
                {current.mediaType === "video" && current.videoSource === "youtube" && current.videoUrl ? (
                  <iframe
                    key={current.id}
                    src={youTubeEmbedUrl(current.videoUrl)}
                    title={current.caption}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="absolute inset-0 h-full w-full rounded-[0.75rem] border-0 bg-black"
                  />
                ) : current.mediaType === "video" && current.videoUrl ? (
                  <video
                    key={current.id}
                    src={current.videoUrl}
                    poster={current.imageUrl}
                    controls
                    autoPlay
                    playsInline
                    className="absolute inset-0 h-full w-full rounded-[0.75rem] bg-black object-contain"
                  />
                ) : (
                  <Image
                    src={current.imageUrl ?? ""}
                    alt={current.caption}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />
                )}
              </div>
              <figcaption className="mt-4 max-w-2xl text-center">
                <span className="block text-[0.6875rem] font-bold uppercase tracking-[0.09em] text-[#d6a53f]">
                  {current.category}
                </span>
                <span className="mt-1 block text-sm text-white">{current.caption}</span>
                {current.mediaType === "video" && current.videoSource === "youtube" && current.videoUrl ? (
                  <a
                    href={youTubeWatchUrl(current.videoUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-[0.75rem] font-semibold text-[#d6a53f] underline underline-offset-2 hover:text-white"
                  >
                    Watch on YouTube
                  </a>
                ) : null}
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
        </div>,
            document.body,
          )
        : null}
    </div>
  );
}
