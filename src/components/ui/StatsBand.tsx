export interface Stat {
  /** Display figure, e.g. "28+", "3", "3,000+". */
  value: string;
  label: string;
}

interface StatsBandProps {
  /** Typically 4 stats: Years, Branches, Students, Faculty (design.md §4.1.5). */
  stats: Stat[];
  className?: string;
}

/**
 * Stat figures set as large serif numerals over warm sand, separated by
 * hairline rules (the "gap-px on a hairline bed" trick) — editorial, no band
 * of solid colour, no animation.
 */
export default function StatsBand({ stats, className = "" }: StatsBandProps) {
  return (
    <div className={`border-y border-hairline bg-bg-alt ${className}`}>
      <dl className="mx-auto grid max-w-content grid-cols-2 gap-px bg-hairline md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center bg-bg-alt px-4 py-12 text-center md:py-16"
          >
            <dd className="font-heading text-4xl font-semibold text-primary md:text-5xl">
              {stat.value}
            </dd>
            <dt className="eyebrow mt-3 text-text-muted">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
