import { useId, type CSSProperties } from "react";
import type { PlaceholderTone } from "@/data/types";

type Aspect = "16/9" | "4/3" | "1/1";

interface PlaceholderImageProps {
  /** Optional short label rendered inside the placeholder. */
  label?: string;
  /** Aspect ratio; ignored when `fill` is true. */
  aspect?: Aspect;
  /** Fill the nearest positioned parent (absolute inset-0). */
  fill?: boolean;
  /** Gradient variant so grids of placeholders look varied. */
  tone?: PlaceholderTone;
  className?: string;
}

/**
 * Decorative stand-in for site photos. Renders a muted, tonal gradient (kept
 * low-saturation so it reads as elegant rather than garish) with a fine dot
 * texture and an inset hairline frame; always aria-hidden.
 */
const GRADIENTS: Record<PlaceholderTone, string> = {
  primary:
    "linear-gradient(145deg, color-mix(in srgb, var(--color-primary) 90%, black), var(--color-primary-dark))",
  accent:
    "linear-gradient(145deg, color-mix(in srgb, var(--color-accent) 62%, #5c3a06), color-mix(in srgb, var(--color-accent) 30%, var(--color-primary-dark)))",
  mist: "linear-gradient(145deg, var(--color-bg-alt), color-mix(in srgb, var(--color-primary) 16%, var(--color-bg-alt)))",
  forest:
    "linear-gradient(145deg, color-mix(in srgb, var(--color-success) 60%, var(--color-primary-dark)), var(--color-primary-dark))",
  dusk: "linear-gradient(145deg, var(--color-primary-dark), color-mix(in srgb, var(--color-primary-dark) 62%, var(--color-accent)))",
  stone:
    "linear-gradient(145deg, color-mix(in srgb, var(--color-text-muted) 70%, var(--color-bg-alt)), color-mix(in srgb, var(--color-text-muted) 60%, var(--color-primary-dark)))",
};

/** Label color per tone — "mist" sits on a light background. */
const LABEL_CLASSES: Record<PlaceholderTone, string> = {
  primary: "text-white/85",
  accent: "text-white/90",
  mist: "text-primary/70",
  forest: "text-white/85",
  dusk: "text-white/85",
  stone: "text-white/90",
};

export default function PlaceholderImage({
  label,
  aspect = "16/9",
  fill = false,
  tone = "primary",
  className = "",
}: PlaceholderImageProps) {
  const patternId = useId();
  const style: CSSProperties = { backgroundImage: GRADIENTS[tone] };
  if (!fill) {
    style.aspectRatio = aspect.replace("/", " / ");
  }

  return (
    <div
      aria-hidden="true"
      style={style}
      className={`overflow-hidden ${
        fill ? "absolute inset-0 h-full w-full" : "relative w-full"
      } ${className}`}
    >
      {/* Fine dot texture */}
      <svg
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <pattern
            id={patternId}
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.5" cy="1.5" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${patternId})`}
          className={tone === "mist" ? "text-primary/12" : "text-white/12"}
        />
      </svg>
      {/* Soft corner highlight */}
      <div className="absolute -left-1/4 -top-1/3 h-2/3 w-2/3 rounded-full bg-white/10 blur-2xl" />
      {/* Inset hairline frame — "framed photograph" feel */}
      <div
        className={`pointer-events-none absolute inset-0 ring-1 ring-inset ${
          tone === "mist" ? "ring-primary/10" : "ring-white/15"
        }`}
      />
      {label ? (
        <span
          className={`absolute inset-0 flex items-center justify-center px-4 text-center font-mono text-[0.625rem] font-medium uppercase tracking-[0.2em] ${LABEL_CLASSES[tone]}`}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}
