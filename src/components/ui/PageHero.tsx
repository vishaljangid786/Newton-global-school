import Breadcrumbs, { type Crumb } from "./Breadcrumbs";
import PlaceholderImage from "./PlaceholderImage";

interface PageHeroProps {
  /** Page h1 — exactly one PageHero per inner page. */
  title: string;
  subtitle?: string;
  /** Optional eyebrow above the title, e.g. "Admissions Open 2026-27". */
  badge?: string;
  /** Breadcrumb trail after Home; omit to hide breadcrumbs. */
  breadcrumbs?: Crumb[];
}

/**
 * Inner-page masthead — the home hero's framed treatment at masthead scale:
 * a rounded image card on the deep blue gradient with a left-to-right dark
 * wash, light breadcrumbs, an optional eyebrow, a white Sora h1 and a soft
 * subtitle, all inside the tinted band.
 */
export default function PageHero({
  title,
  subtitle,
  badge,
  breadcrumbs,
}: PageHeroProps) {
  return (
    <section className="border-b border-[#e6ebf2] bg-bg-alt">
      <div className="mx-auto max-w-content px-4 pb-10 pt-8 md:pt-10">
        <div className="relative overflow-hidden rounded-lg border border-[#e1e7f0] shadow-frame">
          <PlaceholderImage fill tone="dusk" />
          {/* Left-to-right dark wash so the copy stays readable */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(16,24,44,0.84),rgba(16,24,44,0.5)_56%,rgba(16,24,44,0.12))]"
          />
          <div className="relative max-w-3xl px-6 py-12 md:px-14 md:py-16">
            {breadcrumbs ? (
              <Breadcrumbs items={breadcrumbs} tone="light" className="mb-5" />
            ) : null}
            {badge ? (
              <p className="eyebrow mb-4 flex items-center gap-2.5 text-[#a9c0f5]">
                <span
                  aria-hidden="true"
                  className="h-3.5 w-3.5 rounded-[4px] bg-[#6e8ef2]"
                />
                {badge}
              </p>
            ) : null}
            <h1 className="max-w-3xl text-[2.125rem] leading-[1.07] text-white md:text-[2.75rem]">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#d5dcea] md:text-lg">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
