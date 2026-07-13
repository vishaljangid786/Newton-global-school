interface SectionHeadingProps {
  /** Small mono eyebrow label above the h2. */
  overline?: string;
  title: string;
  subtitle?: string;
  /** "left" (default — editorial) or "center". */
  align?: "center" | "left";
  className?: string;
}

/**
 * Section heading — editorial treatment: a monospace eyebrow with a short
 * accent rule, a serif (Fraunces) title, and an optional subtitle. Left
 * aligned by default; pass align="center" for centered contexts.
 */
export default function SectionHeading({
  overline,
  title,
  subtitle,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-3xl"} ${className}`}
    >
      {overline ? (
        <p
          className={`eyebrow flex items-center gap-2.5 text-accent-ink ${
            centered ? "justify-center" : ""
          }`}
        >
          <span aria-hidden="true" className="h-px w-6 bg-accent" />
          {overline}
        </p>
      ) : null}
      <h2 className="mt-4 text-[1.75rem] leading-[1.1] md:text-[2.25rem]">
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`mt-4 text-base leading-relaxed text-text-muted ${
            centered ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
