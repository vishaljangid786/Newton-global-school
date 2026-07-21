export interface Stat {
  /** Display figure, e.g. "28+", "3", "3,000+". */
  value: string;
  label: string;
}

/** Render a stat figure, tinting a trailing "+" in brand blue. */
function StatValue({ value }: { value: string }) {
  if (value.endsWith("+")) {
    return (
      <>
        {value.slice(0, -1)}
        <span className="text-accent">+</span>
      </>
    );
  }
  return <>{value}</>;
}

interface StatsBandProps {
  /** Typically 4 stats: Years, Branches, Students, Faculty (design.md §4.1.5). */
  stats: Stat[];
  className?: string;
}

/**
 * Stat figures on a tinted blue panel — big Sora numerals with a blue "+",
 * uppercase micro-labels, hairline dividers between columns. A calm,
 * corporate moment between the light sections.
 */
export default function StatsBand({ stats, className = "" }: StatsBandProps) {
  return (
    <div className={`mx-auto max-w-content px-4 py-10 md:py-12 ${className}`}>
      <dl className="grid grid-cols-2 gap-y-10 rounded-[1.125rem] border border-[#e1e8f6] bg-panel px-6 py-10 md:grid-cols-4 md:gap-y-0 md:px-10">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`flex flex-col items-center text-center ${
              index > 0 ? "md:border-l md:border-[#dce4f2]" : ""
            }`}
          >
            <dd className="font-heading text-4xl font-semibold leading-none text-ink md:text-[2.75rem]">
              <StatValue value={stat.value} />
            </dd>
            <dt className="mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#6c7789]">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
