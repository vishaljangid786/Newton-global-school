import Link from "next/link";
import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "accent" | "outline";
export type ButtonSize = "md" | "sm";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  // primary: solid royal blue; accent: Apply/Admission CTAs only (brand
  // gradient); outline: quiet white button that tints blue on hover.
  primary: "bg-primary text-white hover:bg-primary-dark",
  accent:
    "bg-[image:var(--gradient-brand)] text-white hover:brightness-[1.06]",
  outline:
    "border border-border bg-surface text-text hover:border-primary/40 hover:text-primary",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "px-6 py-3 text-[0.9375rem]",
  sm: "px-5 py-2.5 text-sm",
};

/** Class string for button-styled elements (native <button>, form submits). */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md"
): string {
  return `inline-flex items-center justify-center gap-2 rounded-btn font-semibold tracking-tight transition duration-200 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]}`;
}

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Render a plain <a> with target="_blank" + rel security attributes. */
  external?: boolean;
  className?: string;
}

/** Link styled as a button. */
export default function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  className = "",
}: ButtonLinkProps) {
  const classes = `${buttonClasses(variant, size)} ${className}`;
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
