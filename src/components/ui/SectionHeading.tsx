import { SectionTitle } from "@/components/site/school-kit";

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
 * Section heading for the branch pages, Careers, Contact and News.
 *
 * This is a thin wrapper over SectionTitle rather than a second implementation
 * of the same thing. The two used to draw their own h2 and had drifted apart —
 * this one rendered at 36px against 29-32px everywhere else — so the heading a
 * visitor sees depended on which page they were on. Delegating means there is
 * one h2 in the codebase and they cannot diverge again.
 *
 * The API is kept as it was (`overline`, `subtitle`) because thirty-odd call
 * sites use it; only the rendering moved.
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
    <div className={className}>
      <SectionTitle
        eyebrow={overline}
        title={title}
        align={align}
        width={centered ? "max-w-2xl" : "max-w-3xl"}
      />
      {subtitle ? (
        <p
          className={`mt-3 text-[0.96875rem] leading-relaxed text-text-muted ${
            centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
