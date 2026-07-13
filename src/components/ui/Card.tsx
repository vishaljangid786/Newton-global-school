import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  /** Hover lift + firmer border/shadow — for clickable cards. */
  hoverLift?: boolean;
  /**
   * No default padding (image cards run the image edge-to-edge); add "p-6"
   * via className for a plain padded card.
   */
  className?: string;
}

/**
 * Card primitive — paper surface framed by a hairline border with a
 * barely-there shadow (editorial: structure from rules, not drop shadows).
 */
export default function Card({
  children,
  hoverLift = false,
  className = "",
}: CardProps) {
  return (
    <div
      className={`overflow-hidden rounded-card border border-border bg-bg shadow-card ${
        hoverLift
          ? "transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
