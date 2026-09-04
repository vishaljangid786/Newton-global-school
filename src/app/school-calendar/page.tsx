import type { Metadata } from "next";
import SchoolCalendar from "@/components/site/SchoolCalendar";
import {
  CONTAINER,
  DataTable,
  type Img,
  PageHero,
  SECTION,
  SectionTitle,
} from "@/components/site/school-kit";
import Reveal from "@/components/ui/Reveal";
import { holidays, type HolidayScope } from "@/data/holidays";

export const metadata: Metadata = {
  title: "School Calendar",
  description:
    "Month-by-month calendar for Newton Global School, Sangteda, Kotputli — Sundays marked as holidays.",
};

/* Rendered fresh so "today" is never a stale build-time date. */
export const dynamic = "force-dynamic";

const IMG = {
  heroBanner: {
    src: "/images/school/corridor.webp",
    w: 1200,
    h: 1600,
    alt: "A corridor lined with classrooms inside the school",
  },
} as const satisfies Record<string, Img>;

const SCOPE_LABEL: Record<HolidayScope, string> = {
  National: "National holiday",
  Rajasthan: "Rajasthan Government",
  Festival: "Festival holiday",
  School: "School break",
};

/** "01-26" -> "26 January". The year is irrelevant: these repeat annually. */
function formatFixed(monthDay: string): string {
  const [month, day] = monthDay.split("-").map(Number);
  return `${day} ${new Date(2000, month - 1, 1).toLocaleDateString("en-IN", { month: "long" })}`;
}

/**
 * Today, read in the school's own timezone rather than the server's, so a
 * host in another region does not show the wrong day. The client corrects
 * this to the visitor's local date once it mounts.
 */
function todayInKolkata() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const [year, month] = parts.split("-").map(Number);
  return { iso: parts, year, month: month - 1 };
}

export default function SchoolCalendarPage() {
  const today = todayInKolkata();

  return (
    <>
      <PageHero
        image={IMG.heroBanner}
        priority
        crumbs={[{ label: "About Us", href: "/about" }, { label: "School Calendar" }]}
        h1={`School Calendar`}
        sub={`Term Dates and Holidays at Sangteda, Kotputli`}
        body={`Browse any month of the school year. Sundays are marked in red as weekly holidays — use the arrows to move between months, or pick a month and year directly.`}
      />

      <section className={`bg-bg ${SECTION}`}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle
              eyebrow="Calendar"
              title={`This Month at Newton Global School`}
              align="center"
            />
          </Reveal>
          <Reveal delay={110} className="mt-10 lg:mt-12">
            <SchoolCalendar
              initial={{ year: today.year, month: today.month }}
              todayIso={today.iso}
            />
          </Reveal>
        </div>
      </section>

      {/* ——— Public holidays and government leaves ——— */}
      <section className={`border-y border-hairline bg-bg-alt ${SECTION} !py-16 sm:!py-20`}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle
              eyebrow="Holidays"
              title={`Public Holidays and Government Leaves`}
              align="center"
            />
            <p className="mx-auto mt-4 max-w-2xl text-center text-[0.9375rem] leading-[1.8] text-text-muted">
              National and Rajasthan Government holidays observed at the
              Sangteda campus, alongside the school&apos;s own breaks.
            </p>
          </Reveal>

          <Reveal delay={110}>
            <DataTable
              className="mx-auto mt-10 max-w-3xl lg:mt-12"
              head={["Date", "Holiday", "Observed as"]}
              rows={holidays.map((holiday) => [
                holiday.on ? formatFixed(holiday.on) : (holiday.note ?? "To be confirmed"),
                holiday.name,
                SCOPE_LABEL[holiday.scope],
              ])}
            />
          </Reveal>

          <Reveal delay={150}>
            <p className="mx-auto mt-6 max-w-3xl text-[0.8125rem] leading-[1.8] text-text-muted">
              Dates shown are the ones that fall on the same day every year and
              are marked on the calendar above. Festivals that follow the lunar
              calendar &mdash; Holi, Diwali, Dussehra, Eid and the rest &mdash;
              move by several weeks each year, so their dates are confirmed
              against the Rajasthan Government&apos;s gazetted list at the start
              of every session rather than printed here in advance.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
