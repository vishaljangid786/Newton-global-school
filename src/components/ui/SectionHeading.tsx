interface SectionHeadingProps {
  /** Small uppercase eyebrow label above the h2, led by a dash line. */
  overline?: string;
  title: string;
  subtitle?: string;
  /** "left" (default — editorial) or "center". */
  align?: "center" | "left";
  className?: string;
}

/**
 * Section heading — corporate treatment: a dash-line eyebrow in brand blue,
 * a Sora display title, and an optional muted subtitle. Left aligned by
 * default; pass align="center" for centered contexts (the dash mirrors on
 * both sides when centered).
 */
export default function SectionHeading({
  overline,
  title,
  subtitle,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";
  const dash = (
    <span aria-hidden="true" className="h-px w-6 bg-primary/35" />
  );
  return (
    <div
      className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-3xl"} ${className}`}
    >
      {overline ? (
        <p
          className={`eyebrow flex items-center gap-2.5 text-primary ${
            centered ? "justify-center" : ""
          }`}
        >
          {dash}
          {overline}
          {centered ? dash : null}
        </p>
      ) : null}
      <h2 className="mt-4 text-[1.75rem] leading-[1.15] md:text-[2.125rem]">
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`mt-3 text-[0.96875rem] leading-relaxed text-text-muted ${
            centered ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
