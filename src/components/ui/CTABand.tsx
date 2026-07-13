import ButtonLink from "./Button";

interface CTABandProps {
  /** e.g. "Admissions open for 2026-27". */
  title: string;
  subtitle?: string;
  /** Mono eyebrow above the title. */
  eyebrow?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

/**
 * Full-bleed navy band with a mono eyebrow, serif heading and accent CTA —
 * a deliberate dark counterpoint to the surrounding paper sections. Renders
 * an h2, so use one per section context.
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
    <div
      className={`relative overflow-hidden bg-primary-dark text-white ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(110deg, var(--color-primary-dark) 0%, var(--color-primary) 60%, color-mix(in srgb, var(--color-accent) 30%, var(--color-primary)) 100%)",
        }}
      />
      {/* Faint vertical pinstripes */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 52px, rgba(255,255,255,0.05) 52px 53px)",
        }}
      />
      <div className="relative mx-auto flex max-w-content flex-col items-start gap-8 px-4 py-14 md:flex-row md:items-end md:justify-between md:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow flex items-center gap-2.5 text-accent">
            <span aria-hidden="true" className="h-px w-6 bg-accent" />
            {eyebrow}
          </p>
          <h2 className="mt-4 text-[1.9rem] leading-[1.08] text-white md:text-[2.6rem]">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-4 max-w-xl leading-relaxed text-white/75">
              {subtitle}
            </p>
          ) : null}
        </div>
        <ButtonLink href={ctaHref} variant="accent" className="shrink-0">
          {ctaLabel}
        </ButtonLink>
      </div>
    </div>
  );
}
