import type { Metadata } from "next";
import type { ReactNode } from "react";
import ButtonLink from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import PageHero from "@/components/ui/PageHero";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { branches } from "@/data/branches";
import { site } from "@/data/site";
import type { PlaceholderTone } from "@/data/types";

export const metadata: Metadata = {
  title: "Academics",
  description:
    "CBSE curriculum, grade-level programmes, teaching methodology and co-curricular life at Newton Global School's three Jaipur campuses.",
};

/* ---------------------------------------------------------------- content */

interface GradeLevel {
  title: string;
  grades: string;
  ages: string;
  focus: string;
  points: string[];
  tone: PlaceholderTone;
}

const gradeLevels: GradeLevel[] = [
  {
    title: "Pre-Primary",
    grades: "Nursery, LKG & UKG",
    ages: "Ages 3 to 6",
    focus:
      "A play-based start where children settle into school joyfully and build the habits that make later learning easy.",
    points: [
      "Phonics-rich early reading and storytelling circles",
      "Fine and gross motor skill development through play",
      "Gentle routines that build independence and sharing",
    ],
    tone: "accent",
  },
  {
    title: "Primary",
    grades: "Grades 1 to 5",
    ages: "Ages 6 to 11",
    focus:
      "Strong foundations in literacy and numeracy, with activity-led lessons that keep curiosity at the centre of every subject.",
    points: [
      "Depth in English, Hindi, Mathematics and EVS",
      "Weekly library, art, music and sports periods",
      "Projects and presentations that build confidence",
    ],
    tone: "forest",
  },
  {
    title: "Secondary",
    grades: "Grades 6 to 12",
    ages: "Ages 11 to 18",
    focus:
      "Subject depth, disciplined study skills and careful board-exam preparation, supported by labs, mentoring and career guidance.",
    points: [
      "Full science, computer and mathematics lab work",
      "Structured revision cycles for board examinations",
      "Career counselling and stream selection support",
    ],
    tone: "dusk",
  },
];

interface MethodologyRow {
  title: string;
  paragraphs: string[];
  imageLabel: string;
  tone: PlaceholderTone;
}

const methodologyRows: MethodologyRow[] = [
  {
    title: "Inquiry-Led Classrooms",
    paragraphs: [
      "Lessons begin with questions, not answers. Teachers frame each topic around something worth wondering about, and children investigate, discuss and defend their thinking before notes are made.",
      "Class sizes are kept deliberately modest so that every child is heard in discussion, and quieter learners get the same airtime as confident speakers.",
    ],
    imageLabel: "Classroom discussion",
    tone: "primary",
  },
  {
    title: "Learning by Doing",
    paragraphs: [
      "Concepts stick when hands are involved. Science is taught at the lab bench, geography in the school garden, and mathematics with models, measurement and real data collected by students.",
      "Maker periods, robotics kits and field visits turn textbook chapters into experiences children remember long after the test.",
    ],
    imageLabel: "Hands-on lab work",
    tone: "forest",
  },
  {
    title: "Continuous, Gentle Assessment",
    paragraphs: [
      "We assess little and often, so no single exam carries frightening weight. Short reviews, portfolios and open-book tasks show teachers exactly where each child needs help next.",
      "Parents see progress through clear term reports and scheduled parent-teacher meetings, never through surprises.",
    ],
    imageLabel: "Teacher mentoring",
    tone: "dusk",
  },
];

interface BeyondItem {
  title: string;
  description: string;
  icon: ReactNode;
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

const beyondItems: BeyondItem[] = [
  {
    title: "Sports & Athletics",
    description: "Cricket, football, athletics, swimming and indoor games with coached practice hours.",
    icon: (
      <svg {...iconProps}>
        <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4z" />
        <path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4" />
      </svg>
    ),
  },
  {
    title: "Music & Dance",
    description: "Vocal and instrumental music, classical and contemporary dance in dedicated studios.",
    icon: (
      <svg {...iconProps}>
        <circle cx="7" cy="18" r="3" />
        <circle cx="17" cy="16" r="3" />
        <path d="M10 18V5l10-2v13" />
      </svg>
    ),
  },
  {
    title: "Visual Arts & Craft",
    description: "Drawing, painting, pottery and craft that give every child a maker's confidence.",
    icon: (
      <svg {...iconProps}>
        <path d="M15 4l5 5L8.5 20.5H3.5v-5L15 4z" />
        <path d="M12.5 6.5l5 5" />
      </svg>
    ),
  },
  {
    title: "Clubs & Competitions",
    description: "Science, robotics, debate, quiz and eco clubs, with inter-school and olympiad exposure.",
    icon: (
      <svg {...iconProps}>
        <path d="M5 21V4" />
        <path d="M5 4h13l-2.5 4L18 12H5" />
      </svg>
    ),
  },
  {
    title: "Yoga & Wellness",
    description: "Morning yoga, mindfulness breaks and counselling support for balanced growing years.",
    icon: (
      <svg {...iconProps}>
        <path d="M20.3 5.6a5.2 5.2 0 0 0-7.3 0l-1 1-1-1a5.2 5.2 0 0 0-7.3 7.3l1 1L12 21l7.3-7.1 1-1a5.2 5.2 0 0 0 0-7.3z" />
      </svg>
    ),
  },
  {
    title: "Community Service",
    description: "Neighbourhood clean-ups, plantation drives and visits that build empathy and citizenship.",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </svg>
    ),
  },
];

interface DownloadDoc {
  title: string;
  description: string;
}

const downloadDocs: DownloadDoc[] = [
  {
    title: "Syllabus Booklets",
    description:
      "Grade-wise syllabus outlines covering every subject, chapter plans and the term-wise portion split for the session.",
  },
  {
    title: `Academic Calendar ${site.admissionYear}`,
    description:
      "Term dates, examination windows, holidays, parent-teacher meetings and major school events for the full academic year.",
  },
];

/* ------------------------------------------------------------------ page */

export default function AcademicsPage() {
  return (
    <>
      <PageHero
        title="Academics"
        subtitle="One curriculum, one standard of care — from the first day of Nursery to the board examinations."
        breadcrumbs={[{ label: "Academics" }]}
      />

      {/* 2. Curriculum overview — §4.4.2 */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <div className="grid items-start gap-10 lg:grid-cols-[3fr_2fr]">
            <div>
              <SectionHeading
                align="left"
                overline="Curriculum"
                title="A CBSE Curriculum, Taught with Care"
              />
              <div className="mt-5 space-y-4 text-base text-text">
                <p>
                  All three Newton campuses follow the CBSE curriculum, chosen
                  for its clear progression, its balance of concepts and
                  application, and the flexibility it gives families who may
                  relocate between cities. English is the medium of
                  instruction, with Hindi taught as a core language and
                  Sanskrit offered in the middle years.
                </p>
                <p>
                  The board framework is only the floor, not the ceiling. Our
                  academic council reviews every grade&apos;s plan each summer,
                  adding reading programmes, lab hours and project work well
                  beyond the prescribed minimum, so children are prepared for
                  examinations without being reduced to them.
                </p>
                <p>
                  Common lesson plans, shared teacher training and a single
                  assessment calendar keep standards identical across
                  campuses — a Grade 4 classroom at one campus covers the same
                  ground, at the same depth, as at every other.
                </p>
              </div>
            </div>
            <Card className="p-6">
              <h3 className="text-lg text-text">Curriculum at a Glance</h3>
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
                  <dt className="text-text-muted">Academic session</dt>
                  <dd className="text-right font-medium text-text">
                    {site.admissionYear}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-muted">Grades by campus</dt>
                  <dd className="mt-2">
                    <ul className="space-y-2">
                      {branches.map((branch) => (
                        <li
                          key={branch.slug}
                          className="flex justify-between gap-4"
                        >
                          <span className="text-text">{branch.name}</span>
                          <span className="whitespace-nowrap font-medium text-primary">
                            {branch.grades}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. Grade levels — §4.4.3 */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <SectionHeading
            overline="Grade Levels"
            title="The Right Focus at Every Stage"
            subtitle="Three stages, each with its own pace, priorities and way of teaching."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gradeLevels.map((level) => (
              <Card key={level.title} hoverLift className="flex flex-col">
                <PlaceholderImage
                  label={level.title}
                  aspect="16/9"
                  tone={level.tone}
                />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl text-text">{level.title}</h3>
                  <p className="mt-1 text-sm text-text-muted">
                    {level.grades} · {level.ages}
                  </p>
                  <p className="mt-3 text-sm text-text">{level.focus}</p>
                  <ul className="mt-4 space-y-2 border-t border-border/60 pt-4 text-sm text-text-muted">
                    {level.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-pill bg-accent"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-text-muted">
            Grades offered vary by campus:{" "}
            {branches.map((branch, index) => (
              <span key={branch.slug}>
                {index > 0 ? " · " : null}
                {branch.name} ({branch.grades})
              </span>
            ))}
            .
          </p>
        </div>
      </section>

      {/* 4. Teaching methodology — §4.4.4 */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <SectionHeading
            overline="How We Teach"
            title="Our Teaching Methodology"
            subtitle="Three habits shape every Newton classroom, in every grade and on every campus."
          />
          <div className="mt-10 space-y-12 md:space-y-16">
            {methodologyRows.map((row, index) => (
              <Reveal key={row.title}>
                <div className="grid items-center gap-6 md:grid-cols-2 md:gap-10">
                  <PlaceholderImage
                    label={row.imageLabel}
                    aspect="4/3"
                    tone={row.tone}
                    className={`rounded-card shadow-card ${
                      index % 2 === 1 ? "md:order-2" : ""
                    }`}
                  />
                  <div className={index % 2 === 1 ? "md:order-1" : ""}>
                    <h3 className="text-xl text-text md:text-2xl">
                      {row.title}
                    </h3>
                    <div className="mt-3 space-y-3 text-base text-text">
                      {row.paragraphs.map((paragraph) => (
                        <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Beyond academics — §4.4.5 */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <SectionHeading
            overline="Beyond Academics"
            title="Sports, Arts and Clubs"
            subtitle="Marks matter, but so do match days, stage lights and messy art tables."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {beyondItems.map((item) => (
              <Card key={item.title} className="p-6">
                <span
                  aria-hidden="true"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-card bg-primary/10 text-primary"
                >
                  {item.icon}
                </span>
                <h3 className="mt-4 text-lg text-text">{item.title}</h3>
                <p className="mt-2 text-sm text-text-muted">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Downloads — §4.4.6 (PDFs pending per §10) */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <SectionHeading
            overline="Downloads"
            title="Syllabus & Academic Calendar"
            subtitle="Printed copies are ready for you today; online downloads are on the way."
          />
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            {downloadDocs.map((doc) => (
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
                <p className="mt-4 flex items-start gap-2 rounded-card bg-bg-alt px-4 py-3 text-sm text-text-muted">
                  <svg
                    {...iconProps}
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8h.01M12 11v5" />
                  </svg>
                  Available at the school office — online download coming
                  soon.
                </p>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-text-muted">
              Need a copy right away? The office at any campus will be happy
              to help, or call our head office at{" "}
              <a
                href={`tel:${site.headOffice.phone}`}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {site.headOffice.phone}
              </a>
              .
            </p>
            <ButtonLink href="/contact" variant="outline">
              Contact the School Office
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
