import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Accordion from "@/components/ui/Accordion";
import { buttonClasses } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import InquiryForm from "@/components/forms/InquiryForm";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { getBranchBySlugAsync } from "@/lib/branches-store";
import { faqs } from "@/data/faqs";
import { site } from "@/data/site";
import type { BranchSlug } from "@/data/types";
import { formatDate } from "@/lib/format";

interface BranchPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BranchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const branch = await getBranchBySlugAsync(slug);
  if (!branch) return { title: "Campus Not Found" };
  return {
    title: `Admissions | ${branch.name}`,
    description: `Grades open, seats, key dates and fees for admission ${site.admissionYear} at ${branch.name}, ${branch.area} — send an inquiry online.`,
  };
}

/**
 * §5.5.1 — grades open & seat availability per campus. Seat counts are not
 * part of the shared data model (src/data), so they live here as
 * page-local admissions data keyed by branch slug.
 */
interface SeatRow {
  group: string;
  grades: string;
  seats: string;
  notes: string;
}

const SEAT_ROWS: Record<BranchSlug, SeatRow[]> = {
  "city-center": [
    {
      group: "Pre-Primary",
      grades: "Nursery · LKG · UKG",
      seats: "70",
      notes: "Two sections per grade; play-based interaction only.",
    },
    {
      group: "Primary",
      grades: "Grades 1 – 5",
      seats: "45",
      notes: "Widest intake in Grade 1; other grades against vacancies.",
    },
    {
      group: "Middle & Secondary",
      grades: "Grades 6 – 10",
      seats: "25",
      notes: "Short assessment in English and Mathematics.",
    },
    {
      group: "Senior Secondary",
      grades: "Grades 11 – 12",
      seats: "40",
      notes: "Science and Commerce streams; based on Grade 10 results.",
    },
  ],
  "green-valley": [
    {
      group: "Pre-Primary",
      grades: "Nursery · LKG · UKG",
      seats: "85",
      notes: "Three Nursery sections; small class sizes throughout.",
    },
    {
      group: "Primary",
      grades: "Grades 1 – 5",
      seats: "50",
      notes: "Grade 1 opens two fresh sections this year.",
    },
    {
      group: "Middle",
      grades: "Grades 6 – 8",
      seats: "30",
      notes: "Short assessment followed by a student interaction.",
    },
    {
      group: "Secondary",
      grades: "Grades 9 – 10",
      seats: "15",
      notes: "Limited vacancies; apply early in the cycle.",
    },
  ],
  riverside: [
    {
      group: "Pre-Primary",
      grades: "Nursery · LKG · UKG",
      seats: "90",
      notes: "Our largest intake — includes the Little Explorers programme.",
    },
    {
      group: "Primary",
      grades: "Grades 1 – 5",
      seats: "55",
      notes: "New sections open as the young campus grows.",
    },
    {
      group: "Middle",
      grades: "Grades 6 – 8",
      seats: "30",
      notes: "A new senior grade is added every academic year.",
    },
  ],
};

/** §5.5.2 — branch-specific key dates for the admission cycle. */
interface KeyDateRow {
  milestone: string;
  date: string;
  details: string;
}

const KEY_DATES: Record<BranchSlug, KeyDateRow[]> = {
  "city-center": [
    {
      milestone: "Registrations open",
      date: formatDate("2025-12-01"),
      details: "Online and at the MG Road front office",
    },
    {
      milestone: "Campus tours",
      date: "Saturdays, 9:30 – 11:30 AM",
      details: "Book a slot with the admissions desk",
    },
    {
      milestone: "Assessment days (Grades 2 – 10)",
      date: "Second Saturday of every month",
      details: "English and Mathematics, followed by an interaction",
    },
    {
      milestone: "Grade 11 stream counselling",
      date: formatDate("2026-05-22"),
      details: "Science and Commerce stream selection after board results",
    },
    {
      milestone: "First admission window closes",
      date: formatDate("2026-08-31"),
      details: "Sibling and staff priority applies within this window",
    },
  ],
  "green-valley": [
    {
      milestone: "Registrations open",
      date: formatDate("2025-12-01"),
      details: "Online and at the Vaishali Nagar front office",
    },
    {
      milestone: "Open house & campus walk",
      date: "First Saturday of every month, 9:00 AM",
      details: "Walk the six-acre green campus with the admissions team",
    },
    {
      milestone: "Pre-primary interactions",
      date: "Tuesdays & Thursdays",
      details: "Play-based, about 20 minutes, with a parent present",
    },
    {
      milestone: "Assessment days (Grades 2 – 10)",
      date: "Third Saturday of every month",
      details: "English and Mathematics, followed by an interaction",
    },
    {
      milestone: "First admission window closes",
      date: formatDate("2026-08-31"),
      details: "Sibling and staff priority applies within this window",
    },
  ],
  riverside: [
    {
      milestone: "Registrations open",
      date: formatDate("2025-12-01"),
      details: "Online and at the Jagatpura front office",
    },
    {
      milestone: "Little Explorers orientation (Nursery – UKG)",
      date: formatDate("2026-03-14"),
      details: "Meet the teachers and tour the sensory garden and learner pool",
    },
    {
      milestone: "Campus tours",
      date: "Wednesdays & Saturdays, 9:30 AM",
      details: "Book a slot with the admissions desk",
    },
    {
      milestone: "Assessment days (Grades 2 – 8)",
      date: "Last Saturday of every month",
      details: "English and Mathematics, followed by an interaction",
    },
    {
      milestone: "First admission window closes",
      date: formatDate("2026-08-31"),
      details: "Sibling and staff priority applies within this window",
    },
  ],
};

/** Generic rows for custom (admin-created) campuses without page-local data. */
const DEFAULT_SEAT_ROWS: SeatRow[] = [
  {
    group: "Pre-Primary",
    grades: "Nursery · LKG · UKG",
    seats: "Enquire",
    notes: "Play-based interaction only; contact the campus office for seats.",
  },
  {
    group: "Primary & above",
    grades: "Grade 1 onwards",
    seats: "Enquire",
    notes: "Admissions against available vacancies in each grade.",
  },
];

const DEFAULT_KEY_DATES: KeyDateRow[] = [
  {
    milestone: "Registrations open",
    date: formatDate("2025-12-01"),
    details: "Online and at the campus front office",
  },
  {
    milestone: "Campus tours",
    date: "Saturdays, 9:30 – 11:30 AM",
    details: "Book a slot with the admissions desk",
  },
  {
    milestone: "First admission window closes",
    date: formatDate("2026-08-31"),
    details: "Sibling and staff priority applies within this window",
  },
];

export default async function BranchAdmissionsPage({ params }: BranchPageProps) {
  const { slug } = await params;
  const branch = await getBranchBySlugAsync(slug);
  if (!branch) notFound();

  const seatRows = SEAT_ROWS[branch.slug] ?? DEFAULT_SEAT_ROWS;
  const keyDates = KEY_DATES[branch.slug] ?? DEFAULT_KEY_DATES;

  return (
    <>
      {/* §5.5 — page hero */}
      <PageHero
        title={`Admissions at ${branch.name}`}
        badge={`Admissions Open ${site.admissionYear}`}
        subtitle={`Now enrolling ${branch.grades} at our ${branch.area} campus. Seats fill fastest in Nursery and Grade 1.`}
        breadcrumbs={[
          { label: "Branches", href: "/branches" },
          { label: branch.name, href: `/branches/${branch.slug}` },
          { label: "Admissions" },
        ]}
      />

      {/* §5.5.1 — seats / grades open table */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <Reveal>
            <SectionHeading
              overline="Seat availability"
              title="Grades Open This Session"
              subtitle={`Indicative seats for ${site.admissionYear} at ${branch.name} — updated monthly during the admission cycle.`}
            />
            <div className="relative mx-auto mt-10 max-w-4xl overflow-x-auto rounded-card border border-border">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <caption className="sr-only">
                  Grades open and seat availability at {branch.name} for{" "}
                  {site.admissionYear}
                </caption>
                <thead>
                  <tr className="border-b border-border bg-bg-alt">
                    <th
                      scope="col"
                      className="px-4 py-3 font-heading font-semibold text-text"
                    >
                      Grade group
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 font-heading font-semibold text-text"
                    >
                      Grades open
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 font-heading font-semibold text-text"
                    >
                      Seats
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 font-heading font-semibold text-text"
                    >
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {seatRows.map((row) => (
                    <tr
                      key={row.group}
                      className="border-b border-border last:border-b-0"
                    >
                      <th scope="row" className="px-4 py-3 font-medium text-text">
                        {row.group}
                      </th>
                      <td className="whitespace-nowrap px-4 py-3 text-text">
                        {row.grades}
                      </td>
                      <td className="px-4 py-3 text-text">{row.seats}</td>
                      <td className="px-4 py-3 text-text-muted">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mx-auto mt-4 max-w-4xl text-sm text-text-muted">
              Admission follows the same five-step process at every campus — see
              the{" "}
              <Link
                href="/registration-form"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                group admissions page
              </Link>{" "}
              for eligibility criteria and the documents checklist.
            </p>
          </Reveal>
        </div>
      </section>

      {/* §5.5.2 — branch-specific key dates */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <Reveal>
            <SectionHeading
              overline="Plan your visit"
              title={`Key Dates at ${branch.name}`}
              subtitle="Campus-specific tour, interaction and assessment schedules for this admission cycle."
            />
            <div className="relative mx-auto mt-10 max-w-4xl overflow-x-auto rounded-card border border-hairline bg-surface">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <caption className="sr-only">
                  Key admission dates at {branch.name}
                </caption>
                <thead>
                  <tr className="border-b border-border bg-bg-alt">
                    <th
                      scope="col"
                      className="px-4 py-3 font-heading font-semibold text-text"
                    >
                      Milestone
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 font-heading font-semibold text-text"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 font-heading font-semibold text-text"
                    >
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {keyDates.map((row) => (
                    <tr
                      key={row.milestone}
                      className="border-b border-border last:border-b-0"
                    >
                      <th scope="row" className="px-4 py-3 font-medium text-text">
                        {row.milestone}
                      </th>
                      <td className="whitespace-nowrap px-4 py-3 text-text">
                        {row.date}
                      </td>
                      <td className="px-4 py-3 text-text-muted">{row.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* §5.5.3 — fee structure note (PDF pending) */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <Reveal>
            <SectionHeading
              overline="Fees"
              title="Fee Structure"
              subtitle={`Transparent, all-inclusive fees for ${site.admissionYear} — no capitation, no hidden charges.`}
            />
            <Card className="mx-auto mt-10 max-w-3xl p-6 md:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-card bg-primary/10 text-primary"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    focusable="false"
                  >
                    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
                    <path d="M14 3v5h5" />
                    <path d="M9 13h6M9 17h6" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-xl text-text">
                    Fee structure download — coming soon
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    The detailed fee structure PDF for {branch.name} is being
                    finalised for the {site.admissionYear} session and will be
                    published on this page shortly. Until then, a printed copy is
                    shared at registration and available on request from the
                    campus front office. Fees can be paid quarterly or annually,
                    online or at the school office.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <a
                      href={`tel:${branch.phone}`}
                      className={buttonClasses("primary", "sm")}
                    >
                      Call {branch.phone}
                    </a>
                    <Link
                      href={`/branches/${branch.slug}/contact`}
                      className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
                    >
                      Write to the campus office
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* §5.5.4 — inquiry form, campus preselected */}
      <section id="inquiry" className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <Reveal>
            <SectionHeading
              overline="Start here"
              title="Admission Inquiry"
              subtitle={`Tell us a little about your child — the ${branch.name} admissions team will call you within two working days.`}
            />
            <Card className="mx-auto mt-10 max-w-4xl p-6 md:p-8">
              <InquiryForm preselectBranch={branch.slug} />
            </Card>
          </Reveal>
        </div>
      </section>

      {/* §5.5.5 — FAQ accordion */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <Reveal>
            <SectionHeading
              overline="Good to know"
              title="Frequently Asked Questions"
              subtitle="Answers to the questions parents ask us most during admissions."
            />
            <Accordion
              items={faqs.map((faq) => ({
                id: faq.q,
                heading: faq.q,
                content: <p>{faq.a}</p>,
              }))}
              className="mx-auto mt-8 max-w-3xl"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
