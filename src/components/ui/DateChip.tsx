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
      className={`flex w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-primary/10 bg-primary-soft py-2 text-primary ${className}`}
    >
      <span aria-hidden="true" className="font-heading text-xl font-semibold leading-none">
        {parts.day}
      </span>
      <span
        aria-hidden="true"
        className="mt-1 text-[10px] font-semibold uppercase leading-none tracking-[0.06em]"
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
