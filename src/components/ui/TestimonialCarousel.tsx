"use client";

import { useState } from "react";
import { initials } from "@/lib/format";
import type { Testimonial } from "@/data/types";

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
                <figure className="mx-auto max-w-3xl px-2 text-center md:px-6">
                  <div
                    aria-hidden="true"
                    className="font-heading text-6xl leading-[0.6] text-[#c6d2f0]"
                  >
                    &ldquo;
                  </div>
                  <blockquote className="mt-5 font-heading text-lg font-medium leading-normal tracking-[-0.01em] text-text md:text-2xl">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-7 flex items-center justify-center gap-3.5">
                    <span
                      aria-hidden="true"
                      className="flex h-12 w-12 items-center justify-center rounded-[0.75rem] bg-[image:var(--gradient-brand)] font-heading text-base font-semibold text-white"
                    >
                      {initials(testimonial.name)}
                    </span>
                    <span className="text-left">
                      <span className="block text-[0.9375rem] font-semibold text-ink">
                        {testimonial.name}
                      </span>
                      <span className="block text-sm text-faint">
                        {testimonial.role}
                      </span>
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
            className="flex h-10 w-10 items-center justify-center rounded-pill border border-border bg-surface text-primary transition-colors hover:border-primary/40 hover:bg-primary-soft"
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
            className="flex h-10 w-10 items-center justify-center rounded-pill border border-border bg-surface text-primary transition-colors hover:border-primary/40 hover:bg-primary-soft"
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
