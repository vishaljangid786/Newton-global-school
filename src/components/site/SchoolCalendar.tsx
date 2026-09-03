"use client";

import { useEffect, useMemo, useState } from "react";

/** Sunday-first, matching how a wall calendar is read here. */
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

interface Cursor {
  year: number;
  month: number;
}

/**
 * The month grid. The server hands down today's date so the first paint
 * matches what the browser will render — computing `new Date()` in both places
 * would disagree either side of midnight and trip a hydration error. Once
 * mounted we re-read the visitor's own clock and correct the view if their
 * local date really is a different day.
 */
export default function SchoolCalendar({
  initial,
  todayIso,
}: {
  initial: Cursor;
  todayIso: string;
}) {
  const [cursor, setCursor] = useState<Cursor>(initial);
  const [today, setToday] = useState(todayIso);

  useEffect(() => {
    const now = new Date();
    const local = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate(),
    ).padStart(2, "0")}`;
    if (local !== todayIso) {
      setToday(local);
      setCursor({ year: now.getFullYear(), month: now.getMonth() });
    }
  }, [todayIso]);

  const { year, month } = cursor;

  /* Leading blanks, then the real days — enough for the grid to lay itself out. */
  const cells = useMemo(() => {
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const out: (number | null)[] = Array.from({ length: firstWeekday }, () => null);
    for (let d = 1; d <= daysInMonth; d += 1) out.push(d);
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [year, month]);

  const step = (delta: number) => {
    const next = new Date(year, month + delta, 1);
    setCursor({ year: next.getFullYear(), month: next.getMonth() });
  };

  /* A decade either side is plenty for a school calendar. */
  const thisYear = Number(todayIso.slice(0, 4));
  const years = Array.from({ length: 21 }, (_, i) => thisYear - 10 + i);

  const iso = (d: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const arrow =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-pill border border-hairline bg-surface text-[#154a8a] transition-colors duration-200 hover:border-[#a8802f] hover:bg-[#faf4e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8802f]";

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* ——— Month / year controls ——— */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.25rem] border border-hairline bg-surface p-3 shadow-card sm:p-4">
        <button type="button" onClick={() => step(-1)} className={arrow} aria-label="Previous month">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
            <path d="m15 18-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex flex-1 flex-wrap items-center justify-center gap-2.5">
          <label className="sr-only" htmlFor="cal-month">Month</label>
          <select
            id="cal-month"
            value={month}
            onChange={(event) => setCursor({ year, month: Number(event.target.value) })}
            className="rounded-btn border border-hairline bg-bg-alt px-3 py-2 font-heading text-[0.95rem] font-bold text-ink transition-colors hover:border-[#a8802f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8802f]"
          >
            {MONTHS.map((name, index) => (
              <option key={name} value={index}>{name}</option>
            ))}
          </select>

          <label className="sr-only" htmlFor="cal-year">Year</label>
          <select
            id="cal-year"
            value={year}
            onChange={(event) => setCursor({ year: Number(event.target.value), month })}
            className="rounded-btn border border-hairline bg-bg-alt px-3 py-2 font-heading text-[0.95rem] font-bold text-ink transition-colors hover:border-[#a8802f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8802f]"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button type="button" onClick={() => step(1)} className={arrow} aria-label="Next month">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
            <path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* ——— The month itself ——— */}
      <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-hairline bg-surface shadow-card">
        <p
          aria-live="polite"
          className="bg-[#001344] px-4 py-3 text-center font-heading text-[1.05rem] font-bold text-white"
        >
          {MONTHS[month]} {year}
        </p>

        <div className="grid grid-cols-7 border-b border-hairline bg-bg-alt">
          {WEEKDAYS.map((day, index) => (
            <span
              key={day}
              className={`px-1 py-2.5 text-center text-[0.7rem] font-bold uppercase tracking-[0.06em] sm:text-xs ${
                index === 0 ? "text-[#c0392b]" : "text-text-muted"
              }`}
            >
              {day}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((day, index) => {
            const isSunday = index % 7 === 0;
            const isToday = day !== null && iso(day) === today;
            return (
              <div
                key={`${year}-${month}-${index}`}
                className={`flex aspect-square items-center justify-center border-b border-r border-hairline last:border-r-0 ${
                  isSunday ? "bg-[#fdf3f2]" : ""
                }`}
              >
                {day === null ? (
                  <span aria-hidden="true" />
                ) : (
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-pill text-[0.9rem] font-semibold sm:h-10 sm:w-10 sm:text-base ${
                      isToday
                        ? "bg-[#154a8a] text-white"
                        : isSunday
                          ? "text-[#c0392b]"
                          : "text-ink"
                    }`}
                  >
                    {day}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.8125rem] text-text-muted">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-3 rounded-pill bg-[#c0392b]" />
          Sunday — holiday
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-3 rounded-pill bg-[#154a8a]" />
          Today
        </span>
      </p>
    </div>
  );
}
