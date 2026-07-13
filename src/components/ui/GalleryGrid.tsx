"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import PlaceholderImage from "./PlaceholderImage";
import { branches } from "@/data/branches";
import { branchLabel } from "@/lib/format";
import type { BranchSlug, GalleryItem } from "@/data/types";

const CATEGORY_FILTERS = [
  "All",
  "Sports",
  "Annual Day",
  "Classrooms",
  "Trips",
] as const;
type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

interface GalleryGridProps {
  items: GalleryItem[];
  /** Show the campus dropdown (global gallery). Ignored when fixedBranch set. */
  showBranchFilter?: boolean;
  /** Pre-filter to one branch (branch gallery pages, design.md §5.7). */
  fixedBranch?: BranchSlug;
}

/**
 * Filterable photo grid with lightbox (F5, design.md §4.7, §3.3): category
 * chips + optional branch dropdown; clicking a tile opens a fullscreen
 * lightbox with prev/next arrows, Esc to close, focus trap and scroll lock.
 */
export default function GalleryGrid({
  items,
  showBranchFilter = false,
  fixedBranch,
}: GalleryGridProps) {
  const branchSelectId = useId();
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [branchFilter, setBranchFilter] = useState<BranchSlug | "all">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const visible = useMemo(() => {
    const activeBranch = fixedBranch ?? (branchFilter === "all" ? null : branchFilter);
    return items.filter(
      (item) =>
        (activeBranch === null || item.branch === activeBranch) &&
        (category === "All" || item.category === category)
    );
  }, [items, fixedBranch, branchFilter, category]);

  const openLightbox = (index: number) => {
    triggerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setLightboxIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    triggerRef.current?.focus();
  }, []);

  return (
    <div>
      {/* Filter row */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <div
          role="group"
          aria-label="Filter photos by category"
          className="flex flex-wrap gap-2"
        >
          {CATEGORY_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              aria-pressed={category === filter}
              onClick={() => setCategory(filter)}
              className={`rounded-pill px-4 py-1.5 text-sm transition-colors ${
                category === filter
                  ? "bg-accent font-semibold text-primary-dark"
                  : "bg-bg-alt font-medium text-text hover:bg-border/50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {showBranchFilter && !fixedBranch ? (
          <div className="flex items-center gap-2">
            <label
              htmlFor={branchSelectId}
              className="text-sm font-medium text-text"
            >
              Campus
            </label>
            <select
              id={branchSelectId}
              value={branchFilter}
              onChange={(event) =>
                setBranchFilter(event.target.value as BranchSlug | "all")
              }
              className="rounded-card border border-border bg-bg px-3 py-2 text-sm text-text"
            >
              <option value="all">All campuses</option>
              {branches.map((branch) => (
                <option key={branch.slug} value={branch.slug}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <p className="mt-6 rounded-card bg-bg-alt px-6 py-10 text-center text-sm text-text-muted">
          No photos match these filters yet. Try a different category.
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => openLightbox(index)}
                className="group block w-full rounded-card text-left"
              >
                <span className="block overflow-hidden rounded-card">
                  <PlaceholderImage
                    aspect="4/3"
                    tone={item.tone}
                    className="transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </span>
                <span className="mt-2 block text-sm font-medium text-text transition-colors group-hover:text-primary">
                  {item.caption}
                </span>
                <span className="sr-only"> — open in photo viewer</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p role="status" className="sr-only">
        {visible.length} photos shown
      </p>

      {lightboxIndex !== null && visible[lightboxIndex] ? (
        <Lightbox
          items={visible}
          index={lightboxIndex}
          onNavigate={setLightboxIndex}
          onClose={closeLightbox}
        />
      ) : null}
    </div>
  );
}

/* ————————————————— Lightbox (internal) ————————————————— */

interface LightboxProps {
  items: GalleryItem[];
  index: number;
  onNavigate: (nextIndex: number) => void;
  onClose: () => void;
}

function Lightbox({ items, index, onNavigate, onClose }: LightboxProps) {
  const item = items[index];
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const multiple = items.length > 1;

  /* Scroll lock + initial focus (design.md §8). */
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const goPrev = () => onNavigate((index - 1 + items.length) % items.length);
  const goNext = () => onNavigate((index + 1) % items.length);

  /* Esc closes, arrows navigate, Tab is trapped inside the dialog. */
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (multiple && event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
      return;
    }
    if (multiple && event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
      return;
    }
    if (event.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const arrowClasses =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-white/10 text-white transition-colors hover:bg-white/25";

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo viewer: ${item.caption}`}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[70] flex flex-col bg-black/90 p-4"
    >
      <div className="flex items-center justify-between text-white">
        <p className="text-sm text-white/80">
          {index + 1} of {items.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          aria-label="Close photo viewer"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-pill bg-white/10 transition-colors hover:bg-white/25"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="m6 6 12 12M18 6 6 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div
        className="flex min-h-0 flex-1 items-center justify-center gap-2 sm:gap-4"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        {multiple ? (
          <button
            type="button"
            aria-label="Previous photo"
            onClick={goPrev}
            className={arrowClasses}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M14.5 6 9 12l5.5 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}

        <figure className="w-full max-w-3xl">
          <div className="overflow-hidden rounded-card">
            <PlaceholderImage
              aspect="16/9"
              tone={item.tone}
              label={item.category}
            />
          </div>
          <figcaption className="mt-3 text-center text-sm text-white">
            {item.caption}
            <span className="mt-1 block text-xs text-white/60">
              {item.category} · {branchLabel(item.branch)}
            </span>
          </figcaption>
        </figure>

        {multiple ? (
          <button
            type="button"
            aria-label="Next photo"
            onClick={goNext}
            className={arrowClasses}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M9.5 6 15 12l-5.5 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
      </div>

      <p className="sr-only" aria-live="polite">
        Photo {index + 1} of {items.length}: {item.caption}
      </p>
    </div>
  );
}
