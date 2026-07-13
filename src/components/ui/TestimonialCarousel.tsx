"use client";

import { useState } from "react";
import PlaceholderImage from "./PlaceholderImage";
import { initials } from "@/lib/format";
import type { PlaceholderTone, Testimonial } from "@/data/types";

const AVATAR_TONES: PlaceholderTone[] = [
  "primary",
  "dusk",
  "forest",
  "accent",
  "stone",
  "mist",
];

interface TestimonialCarouselProps {
  items: Testimonial[];
  className?: string;
}

/**
 * Testimonial carousel (F11, design.md §4.1.7): prev/next buttons + dot
 * indicators, no auto-advance. The slide transition is disabled under
 * prefers-reduced-motion; changes are announced via a polite live region.
 */
export default function TestimonialCarousel({
  items,
  className = "",
}: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0);

  if (items.length === 0) return null;

  const goTo = (next: number) =>
    setIndex((next + items.length) % items.length);

  return (
    <div className={className}>
      <div className="overflow-hidden">
        <ul
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((testimonial, itemIndex) => {
            const current = itemIndex === index;
            return (
              <li
                key={testimonial.name}
                aria-hidden={!current}
                inert={!current}
                className="w-full shrink-0 px-1"
              >
                <figure className="mx-auto max-w-2xl text-center">
                  <span className="mx-auto block w-16 overflow-hidden rounded-pill">
                    <PlaceholderImage
                      aspect="1/1"
                      tone={AVATAR_TONES[itemIndex % AVATAR_TONES.length]}
                      label={initials(testimonial.name)}
                    />
                  </span>
                  <blockquote className="mt-4 text-base leading-relaxed text-text md:text-lg">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4">
                    <span className="block font-heading font-semibold text-text">
                      {testimonial.name}
                    </span>
                    <span className="block text-sm text-text-muted">
                      {testimonial.role}
                    </span>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing testimonial {index + 1} of {items.length}
      </p>

      {items.length > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous testimonial"
            className="flex h-10 w-10 items-center justify-center rounded-pill border border-border text-primary transition-colors hover:bg-bg-alt"
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

          <div className="flex items-center gap-1.5">
            {items.map((testimonial, dotIndex) => (
              <button
                key={testimonial.name}
                type="button"
                onClick={() => goTo(dotIndex)}
                aria-label={`Show testimonial ${dotIndex + 1} of ${items.length}`}
                aria-current={dotIndex === index ? "true" : undefined}
                className="group p-1"
              >
                <span
                  className={`block h-2.5 rounded-pill transition-all motion-reduce:transition-none ${
                    dotIndex === index
                      ? "w-6 bg-primary"
                      : "w-2.5 bg-border group-hover:bg-text-muted"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next testimonial"
            className="flex h-10 w-10 items-center justify-center rounded-pill border border-border text-primary transition-colors hover:bg-bg-alt"
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
        </div>
      ) : null}
    </div>
  );
}
