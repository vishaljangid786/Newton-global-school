import ButtonLink from "./Button";

interface CTABandProps {
  /** e.g. "Admissions open for 2026-27". */
  title: string;
  subtitle?: string;
  /** Eyebrow above the title. */
  eyebrow?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

/**
 * Inset rounded CTA card on deep navy with a single radial glow in the
 * corner — the deliberate dark counterpoint to the light sections. Centered
 * content, gradient CTA. Renders an h2, so use one per section context.
 */
export default function CTABand({
  title,
  subtitle,
  eyebrow = "Enrolment open",
  ctaLabel = "Apply for Admission",
  ctaHref = "/admissions",
  className = "",
}: CTABandProps) {
  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 py-10 md:py-14 ${className}`}>
      <div className="relative overflow-hidden rounded-xl bg-dark px-6 py-12 text-center text-white md:px-12 md:py-14">
        {/* Corner glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-pill bg-[radial-gradient(circle,rgba(110,142,242,0.28),transparent_70%)]"
        />
        <div className="relative">
          <p className="eyebrow inline-flex items-center gap-2 text-[#a9bbf2]">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-pill bg-[#6e8ef2]"
            />
            {eyebrow}
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-[1.9rem] leading-[1.1] text-white md:text-[2.375rem]">
            {title}
          </h2>
          {subtitle ? (
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-[#b4bdcf]">
              {subtitle}
            </p>
          ) : null}
          <ButtonLink href={ctaHref} variant="accent" className="mt-7">
            {ctaLabel}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
