import Link from "next/link";
import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "accent" | "outline";
export type ButtonSize = "md" | "sm";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  // primary: navy bg + white text; accent: Apply/Admission CTAs only
  // (amber bg, dark text); outline: hairline that firms up to navy on hover.
  primary: "bg-primary text-white hover:bg-primary-dark",
  accent: "bg-accent text-primary-dark hover:bg-accent/90",
  outline:
    "border border-border bg-transparent text-primary hover:border-primary hover:bg-primary/5",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "px-6 py-3 text-[0.9375rem]",
  sm: "px-4 py-2.5 text-sm",
};

/** Class string for button-styled elements (native <button>, form submits). */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md"
): string {
  return `inline-flex items-center justify-center gap-2 rounded-card font-semibold tracking-tight transition duration-200 active:translate-y-px motion-reduce:active:translate-y-0 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]}`;
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
