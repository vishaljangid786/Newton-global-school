import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/ui/Badge";
import ButtonLink from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { getBranchBySlugAsync } from "@/lib/branches-store";
import { site } from "@/data/site";
import type { Branch } from "@/data/types";

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
    title: `Academics | ${branch.name}`,
    description: `Grades and sections, CBSE curriculum notes, results and academic downloads at ${branch.name}, ${branch.area}.`,
  };
}

const iconProps = {
  className: "h-6 w-6",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  focusable: false,
} as const;

/** Highest grade taught, parsed from the grades string in branch data. */
function maxGrade(branch: Branch): number {
  if (branch.grades.includes("12")) return 12;
  if (branch.grades.includes("10")) return 10;
  return 8;
}

interface StageRow {
  stage: string;
  grades: string;
  sections: string;
  classSize: string;
}

/** §5.3 grades & sections table rows, derived from the branch grade range. */
function buildStageRows(branch: Branch): StageRow[] {
  const top = maxGrade(branch);
  const rows: StageRow[] = [
    {
      stage: "Pre-Primary",
      grades: "Nursery, LKG & UKG",
      sections: "3 per grade",
      classSize: "20–25 children",
    },
    {
      stage: "Primary",
      grades: "Grades 1–5",
      sections: "3 per grade",
      classSize: "28–30 students",
    },
    {
      stage: "Middle",
      grades: "Grades 6–8",
      sections: "3 per grade",
      classSize: "30–32 students",
    },
  ];
  if (top >= 10) {
    rows.push({
      stage: "Secondary",
      grades: "Grades 9–10",
      sections: "2–3 per grade",
      classSize: "30 students",
    });
  }
  if (top >= 12) {
    rows.push({
      stage: "Senior Secondary",
      grades: "Grades 11–12 · Science & Commerce",
      sections: "2 per stream",
      classSize: "24–28 students",
    });
  }
  return rows;
}

export default async function BranchAcademicsPage({
  params,
}: BranchPageProps) {
  const { slug } = await params;
  const branch = await getBranchBySlugAsync(slug);
  if (!branch) notFound();

  const top = maxGrade(branch);
  const stageRows = buildStageRows(branch);
  const boardLine = top >= 12 ? "Grades 10 and 12" : "Grade 10";

  const downloads = [
    {
      title: `Academic Calendar ${site.admissionYear}`,
      description: `Term dates, examination windows, holidays and event days for ${branch.name} across the full session.`,
    },
    {
      title: "Syllabus Booklets",
      description: `Grade-wise syllabus outlines and term-wise portion splits for every grade taught at this campus (${branch.grades}).`,
    },
  ];

  return (
    <>
      <PageHero
        title={`Academics at ${branch.name}`}
        subtitle={`How ${branch.grades} are organised, taught and assessed on this campus.`}
        breadcrumbs={[
          { label: "Branches", href: "/branches" },
          { label: branch.name, href: `/branches/${branch.slug}` },
          { label: "Academics" },
        ]}
      />

      {/* 1. Grades & sections table — §5.3 */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <SectionHeading
            align="left"
            overline="Grades & Sections"
            title="How Our Classes Are Organised"
            subtitle={`${branch.name} currently offers ${branch.grades}.`}
          />
          <div className="relative mt-8 overflow-x-auto rounded-card border border-border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">
                Grades, sections and typical class sizes at {branch.name}
              </caption>
              <thead>
                <tr className="bg-bg-alt">
                  <th
                    scope="col"
                    className="px-4 py-3 font-heading font-semibold text-text"
                  >
                    Stage
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 font-heading font-semibold text-text"
                  >
                    Grades
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 font-heading font-semibold text-text"
                  >
                    Sections
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 font-heading font-semibold text-text"
                  >
                    Typical class size
                  </th>
                </tr>
              </thead>
              <tbody>
                {stageRows.map((row) => (
                  <tr key={row.stage} className="border-t border-border/70">
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-text"
                    >
                      {row.stage}
                    </th>
                    <td className="px-4 py-3 text-text">{row.grades}</td>
                    <td className="px-4 py-3 text-text-muted">
                      {row.sections}
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {row.classSize}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-text-muted">
            Section counts are indicative for the {site.admissionYear} session
            and may vary with admissions. Call{" "}
            <a
              href={`tel:${branch.phone}`}
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              {branch.phone}
            </a>{" "}
            for current seat availability.
          </p>
        </div>
      </section>

      {/* 2. Curriculum notes — §5.3 */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <div className="grid items-start gap-8 lg:grid-cols-[3fr_2fr] lg:gap-12">
            <div>
              <SectionHeading
                align="left"
                overline="Curriculum"
                title="CBSE, Taught the Newton Way"
              />
              <div className="mt-5 space-y-4 text-base text-text">
                <p>
                  Like every Newton campus, {branch.name} follows the CBSE
                  curriculum with English as the medium of instruction and
                  Hindi as a core language. Lesson plans, teacher training and
                  the assessment calendar are shared across the group, so a
                  child here covers the same ground, at the same depth, as at
                  any other campus.
                </p>
                <p>
                  The timetable protects daily reading, lab and activity
                  periods alongside the core subjects. Assessment is little
                  and often — short reviews, portfolios and projects — so
                  teachers always know where each child needs help next, and
                  no single exam carries frightening weight.
                </p>
              </div>
              <ButtonLink href="/academics" variant="outline" className="mt-6">
                Group Academics Overview
              </ButtonLink>
            </div>
            <Card className="p-6">
              <h3 className="text-lg text-text">At a Glance</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
                  <dt className="text-text-muted">Curriculum board</dt>
                  <dd className="text-right font-medium text-text">CBSE</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
                  <dt className="text-text-muted">Medium of instruction</dt>
                  <dd className="text-right font-medium text-text">English</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
                  <dt className="text-text-muted">Grades offered</dt>
                  <dd className="text-right font-medium text-text">
                    {branch.grades}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-muted">Academic session</dt>
                  <dd className="text-right font-medium text-text">
                    {site.admissionYear}
                  </dd>
                </div>
              </dl>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. Results & toppers — §5.3 */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <SectionHeading
            overline="Results"
            title={top >= 10 ? "Results & Toppers" : "Learning Outcomes"}
          />
          <Card className="mx-auto mt-10 max-w-3xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-card bg-accent/15 text-primary"
              >
                <svg {...iconProps}>
                  <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4z" />
                  <path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4" />
                </svg>
              </span>
              <div className="space-y-3 text-base text-text">
                {top >= 10 ? (
                  <>
                    <p>
                      Our students appear for the CBSE board examinations in{" "}
                      {boardLine}, and every cohort at {branch.name} has
                      cleared the boards with a full pass record. Each year
                      the campus honours its subject toppers and most
                      improved learners at a special assembly.
                    </p>
                    <p>
                      Beyond the boards, students regularly qualify for
                      olympiads and inter-school academic meets — results we
                      credit to steady teaching rather than last-minute
                      pressure.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      {branch.name} currently teaches {branch.grades}, so our
                      students are still a few years from their first board
                      examinations. Their progress is tracked through
                      CBSE-aligned assessments, portfolios and reading
                      benchmarks shared with parents each term.
                    </p>
                    <p>
                      Our learners already hold their own beyond the
                      classroom, with regular podium finishes at inter-school
                      olympiads, sports meets and cultural events across
                      Jaipur.
                    </p>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. Downloads — §5.3 (PDFs pending per §10) */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <SectionHeading
            overline="Downloads"
            title="Calendar & Syllabus"
            subtitle="Printed copies are available at the campus office today; online downloads are on the way."
          />
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            {downloads.map((doc) => (
              <Card key={doc.title} className="flex flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-card bg-primary/10 text-primary"
                  >
                    <svg {...iconProps}>
                      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" />
                      <path d="M14 3v5h5M9 13h6M9 17h6" />
                    </svg>
                  </span>
                  <Badge variant="outline">Coming soon</Badge>
                </div>
                <h3 className="mt-4 text-lg text-text">{doc.title}</h3>
                <p className="mt-2 flex-1 text-sm text-text-muted">
                  {doc.description}
                </p>
              </Card>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-text-muted">
            Need a copy right away? Visit the office at {branch.name} or call{" "}
            <a
              href={`tel:${branch.phone}`}
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              {branch.phone}
            </a>
            . You can also browse the{" "}
            <Link
              href={`/branches/${branch.slug}/notices`}
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              branch notice board
            </Link>{" "}
            for the latest circulars.
          </p>
        </div>
      </section>
    </>
  );
}
