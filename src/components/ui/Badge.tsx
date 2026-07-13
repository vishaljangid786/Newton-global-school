import type { ReactNode } from "react";

type BadgeVariant = "accent" | "outline";

interface BadgeProps {
  children: ReactNode;
  /**
   * "accent" (default): amber pill for "New" tags and branch tags.
   * "outline": hairline pill for secondary meta (event categories), so two
   * badges side by side stay distinguishable.
   */
  variant?: BadgeVariant;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  accent: "bg-accent text-primary-dark",
  outline: "border border-border bg-bg text-text-muted",
};

/** Small mono, uppercase, letter-spaced pill. */
export default function Badge({
  children,
  variant = "accent",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-pill px-2.5 py-1 font-mono text-[0.625rem] font-medium uppercase leading-none tracking-[0.14em] ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
