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
 * Section heading — the school treatment: a gold dash-rule eyebrow,
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
    <span aria-hidden="true" className="h-[3px] w-7 rounded-pill bg-[#a8802f]" />
  );
  return (
    <div
      className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-3xl"} ${className}`}
    >
      {overline ? (
        <p
          className={`eyebrow flex items-center gap-2.5 text-[#87661f] ${
            centered ? "justify-center" : ""
          }`}
        >
          {dash}
          {overline}
          {centered ? dash : null}
        </p>
      ) : null}
      <h2 className="mt-4 text-[1.5rem] leading-[1.2] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.25rem]">
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
