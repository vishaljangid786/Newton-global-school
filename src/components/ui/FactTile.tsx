import type { ReactNode } from "react";

interface FactTileProps {
  /** Decorative inline SVG (aria-hidden wrapper is applied here). */
  icon?: ReactNode;
  value: string | number;
  label: string;
  className?: string;
}

/**
 * Quick-fact tile (design.md §5.1): icon + big value + label, e.g.
 * "Nursery – Grade 12 / Grades offered". Use in a 2×2 or 4-up grid.
 */
export default function FactTile({
  icon,
  value,
  label,
  className = "",
}: FactTileProps) {
  return (
    <div
      className={`rounded-card border border-border bg-bg p-6 text-center ${className}`}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-pill bg-primary/10 text-primary [&>svg]:h-6 [&>svg]:w-6"
        >
          {icon}
        </span>
      ) : null}
      <p className="font-heading text-2xl font-bold text-primary md:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-sm text-text-muted">{label}</p>
    </div>
  );
}
