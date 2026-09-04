"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Transition delay in ms — stagger items in a grid (e.g. index * 100). */
  delay?: number;
}

/**
 * Fade-up-on-enter wrapper (design.md §7). Uses IntersectionObserver; content
 * shows immediately under prefers-reduced-motion or when the observer is
 * unavailable.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      /*
       * threshold 0 matters as much as the 0.12: a block taller than the
       * viewport — the gallery mosaic runs to ~9,500px — can never show 12%
       * of itself at once, so a lone percentage threshold would leave it
       * stuck at opacity 0 forever. Firing at 0 too means "any part of it has
       * come into view", which is what the animation actually wants.
       */
      { threshold: [0, 0.12], rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transition-[opacity,translate] duration-700 ease-out motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
