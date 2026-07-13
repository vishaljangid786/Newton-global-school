import type { SocialLink } from "@/data/types";

const PATHS: Record<SocialLink["name"], string> = {
  Facebook:
    "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12Z",
  Instagram:
    "M12 2.2c3.2 0 3.58.01 4.85.07 3.25.15 4.73 1.66 4.88 4.88.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.22-1.63 4.73-4.88 4.88-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.25-.15-4.73-1.66-4.88-4.88C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85C2.42 3.93 3.9 2.42 7.15 2.27 8.42 2.21 8.8 2.2 12 2.2Zm0 3.68a6.12 6.12 0 1 0 0 12.24 6.12 6.12 0 0 0 0-12.24Zm0 2.2a3.92 3.92 0 1 1 0 7.84 3.92 3.92 0 0 1 0-7.84Zm6.4-2.72a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z",
  YouTube:
    "M23 12s0-3.29-.42-4.87a2.5 2.5 0 0 0-1.76-1.77C19.25 4.94 12 4.94 12 4.94s-7.25 0-8.82.42a2.5 2.5 0 0 0-1.76 1.77C1 8.71 1 12 1 12s0 3.29.42 4.87a2.5 2.5 0 0 0 1.76 1.77c1.57.42 8.82.42 8.82.42s7.25 0 8.82-.42a2.5 2.5 0 0 0 1.76-1.77C23 15.29 23 12 23 12ZM9.8 15.32V8.68L15.9 12l-6.1 3.32Z",
};

/**
 * Inline-SVG icon for a social platform. Decorative; pair it with an
 * accessible name (sr-only text or aria-label) on the surrounding link.
 */
export default function SocialIcon({
  name,
  className = "h-4 w-4",
}: {
  name: SocialLink["name"];
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d={PATHS[name]} fill="currentColor" />
    </svg>
  );
}
