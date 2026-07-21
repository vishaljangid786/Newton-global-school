import type { ReactNode } from "react";

type BadgeVariant = "accent" | "outline";

interface BadgeProps {
  children: ReactNode;
  /**
   * "accent" (default): tinted blue pill for "New" tags and branch tags.
   * "outline": hairline pill for secondary meta (event categories), so two
   * badges side by side stay distinguishable.
   */
  variant?: BadgeVariant;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  accent: "bg-primary-soft text-accent-ink",
  outline: "border border-border bg-surface text-text-muted",
};

/** Small bold sans, uppercase pill. */
export default function Badge({
  children,
  variant = "accent",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-[0.625rem] font-semibold uppercase leading-none tracking-[0.06em] ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
