"use client";

import { useEffect, useState } from "react";

/**
 * Thin progress bar pinned under the header. Reads scroll position against
 * the article element rather than the whole document, so it reaches 100% at
 * the end of the text and not somewhere inside the footer.
 */
export default function ReadingProgress({ targetId }: { targetId: string }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const start = target.offsetTop;
      const span = target.offsetHeight - window.innerHeight;
      if (span <= 0) {
        setPct(0);
        return;
      }
      const seen = (window.scrollY - start) / span;
      setPct(Math.min(100, Math.max(0, seen * 100)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[3px] bg-transparent"
    >
      <div
        className="h-full origin-left bg-[#d6a53f] transition-[width] duration-75 ease-linear"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
