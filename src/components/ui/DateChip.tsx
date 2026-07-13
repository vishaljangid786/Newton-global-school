import { dateChipParts, formatDate } from "@/lib/format";

interface DateChipProps {
  /** ISO date, e.g. "2026-07-13". */
  date: string;
  showYear?: boolean;
  className?: string;
}

/**
 * Compact day/month date chip used by NoticeRow and EventCard
 * (design.md §3.3). Screen readers get the full date via sr-only text.
 */
export default function DateChip({
  date,
  showYear = false,
  className = "",
}: DateChipProps) {
  const parts = dateChipParts(date);
  return (
    <time
      dateTime={date}
      className={`flex w-14 shrink-0 flex-col items-center justify-center rounded-card border border-primary/15 bg-primary/5 py-2 text-primary ${className}`}
    >
      <span aria-hidden="true" className="font-heading text-xl font-semibold leading-none">
        {parts.day}
      </span>
      <span
        aria-hidden="true"
        className="mt-1 font-mono text-[10px] font-medium uppercase leading-none tracking-[0.12em]"
      >
        {parts.month}
      </span>
      {showYear ? (
        <span aria-hidden="true" className="mt-1 text-[10px] leading-none text-primary/70">
          {parts.year}
        </span>
      ) : null}
      <span className="sr-only">{formatDate(date)}</span>
    </time>
  );
}
