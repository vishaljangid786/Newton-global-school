import type { CSSProperties } from "react";
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
 * Decorative stand-in for site photos. Renders a modern mesh gradient —
 * 2–3 layered radial color washes over a base tint — with a soft corner
 * glow; always aria-hidden. Swap for real photography via next/image later
 * without changing call sites.
 */
const MESHES: Record<PlaceholderTone, string> = {
  primary:
    "radial-gradient(at 20% 15%, color-mix(in srgb, var(--color-primary) 80%, white) 0, transparent 55%), radial-gradient(at 85% 90%, color-mix(in srgb, var(--color-accent) 35%, var(--color-primary-dark)) 0, transparent 60%), linear-gradient(145deg, var(--color-primary), var(--color-primary-dark))",
  accent:
    "radial-gradient(at 15% 20%, color-mix(in srgb, var(--color-accent) 60%, white) 0, transparent 55%), radial-gradient(at 90% 85%, var(--color-primary-dark) 0, transparent 65%), linear-gradient(145deg, #6e8ef2, #4c6fe6)",
  mist: "radial-gradient(at 25% 20%, white 0, transparent 55%), radial-gradient(at 85% 80%, color-mix(in srgb, var(--color-primary) 18%, var(--color-bg-alt)) 0, transparent 60%), linear-gradient(145deg, var(--color-bg-alt), #e3e9f5)",
  forest:
    "radial-gradient(at 20% 15%, color-mix(in srgb, var(--color-success) 70%, white) 0, transparent 55%), radial-gradient(at 85% 90%, var(--color-primary-dark) 0, transparent 65%), linear-gradient(145deg, color-mix(in srgb, var(--color-success) 65%, var(--color-primary-dark)), var(--color-primary-dark))",
  dusk: "radial-gradient(at 80% 15%, color-mix(in srgb, var(--color-accent) 45%, var(--color-primary)) 0, transparent 55%), radial-gradient(at 15% 85%, var(--color-primary) 0, transparent 60%), linear-gradient(145deg, var(--color-primary-dark), #1e1b4b)",
  stone:
    "radial-gradient(at 20% 20%, color-mix(in srgb, var(--color-text-muted) 45%, white) 0, transparent 55%), radial-gradient(at 85% 85%, var(--color-primary-dark) 0, transparent 65%), linear-gradient(145deg, color-mix(in srgb, var(--color-text-muted) 75%, var(--color-bg-alt)), color-mix(in srgb, var(--color-text-muted) 55%, var(--color-primary-dark)))",
};

/** Label color per tone — "mist" sits on a light background. */
const LABEL_CLASSES: Record<PlaceholderTone, string> = {
  primary: "text-white/90",
  accent: "text-white/90",
  mist: "text-primary/70",
  forest: "text-white/90",
  dusk: "text-white/90",
  stone: "text-white/90",
};

export default function PlaceholderImage({
  label,
  aspect = "16/9",
  fill = false,
  tone = "primary",
  className = "",
}: PlaceholderImageProps) {
  const style: CSSProperties = { backgroundImage: MESHES[tone] };
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
      {/* Soft corner glow */}
      <div className="absolute -left-1/4 -top-1/3 h-2/3 w-2/3 rounded-full bg-white/15 blur-3xl" />
      {label ? (
        <span
          className={`absolute inset-0 flex items-center justify-center px-4 text-center text-xs font-semibold ${LABEL_CLASSES[tone]}`}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}
