import type { Metadata } from "next";
import SchoolCalendar from "@/components/site/SchoolCalendar";
import {
  CONTAINER,
  type Img,
  PageHero,
  SECTION,
  SectionTitle,
} from "@/components/site/school-kit";
import Reveal from "@/components/ui/Reveal";

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
          <Reveal>
            <p className="mx-auto mt-10 max-w-2xl text-center text-[0.9375rem] leading-[1.85] text-text-muted">
              Term dates, examination weeks and festival holidays will be marked
              here once the school publishes the academic calendar for the
              session. Until then this calendar shows weekly Sunday holidays only.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
