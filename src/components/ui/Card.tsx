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
 * Card primitive — white surface with a hairline border and a whisper
 * shadow (corporate: structure from rules, depth kept faint).
 */
export default function Card({
  children,
  hoverLift = false,
  className = "",
}: CardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-card border border-hairline bg-surface shadow-card ${
        hoverLift
          ? "transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
