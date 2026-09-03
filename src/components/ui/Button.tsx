import Link from "next/link";
import type { ReactNode } from "react";
import {
  BTN_BASE,
  BTN_TONE,
  type BtnTone,
} from "@/components/site/school-kit";

export type ButtonVariant = "primary" | "accent" | "outline";
export type ButtonSize = "md" | "sm";

/*
 * The older pages and every form submit button come through here. Rather than
 * keep a second look alive, these map onto the shared tones in the school kit,
 * so a button on /careers or in the enquiry form behaves like one on the home
 * page. Native <button> elements get the lift and shadow but not the sheen,
 * which needs an extra child element.
 */
const VARIANT_TONE: Record<ButtonVariant, BtnTone> = {
  primary: "teal",
  accent: "gold",
  outline: "outline",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "px-6 py-3",
  sm: "px-5 py-2.5",
};

/** Class string for button-styled elements (native <button>, form submits). */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md"
): string {
  return `${BTN_BASE} ${BTN_TONE[VARIANT_TONE[variant]]} ${SIZE_CLASSES[size]}`;
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
