import Breadcrumbs, { type Crumb } from "./Breadcrumbs";

interface PageHeroProps {
  /** Page h1 — exactly one PageHero per inner page. */
  title: string;
  subtitle?: string;
  /** Optional mono eyebrow pill above the title, e.g. "Admissions Open 2026-27". */
  badge?: string;
  /** Breadcrumb trail after Home; omit to hide breadcrumbs. */
  breadcrumbs?: Crumb[];
}

/**
 * Inner-page masthead — editorial treatment: a warm-paper band with faint
 * architectural pinstripes, breadcrumbs, an optional eyebrow pill, a large
 * serif h1 and a muted subtitle. Replaces the old solid-blue banner.
 */
export default function PageHero({
  title,
  subtitle,
  badge,
  breadcrumbs,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-hairline bg-bg-alt">
      {/* Faint vertical pinstripes on the right (architectural accent) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-2/5 md:block"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 46px, color-mix(in srgb, var(--color-primary) 7%, transparent) 46px 47px)",
          maskImage: "linear-gradient(90deg, transparent, black)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, black)",
        }}
      />
      <div className="relative mx-auto max-w-content px-4 py-12 md:py-16">
        {breadcrumbs ? (
          <Breadcrumbs items={breadcrumbs} tone="dark" className="mb-6" />
        ) : null}
        {badge ? (
          <p className="eyebrow mb-5 inline-flex items-center gap-2 rounded-pill border border-accent/40 bg-accent/10 px-3 py-1.5 text-accent-ink">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-pill bg-accent" />
            {badge}
          </p>
        ) : null}
        <h1 className="max-w-3xl text-[2rem] leading-[1.06] md:text-[3.25rem]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}
