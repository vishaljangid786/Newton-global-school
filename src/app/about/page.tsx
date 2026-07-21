import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import CTABand from "@/components/ui/CTABand";
import PageHero from "@/components/ui/PageHero";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { branches } from "@/data/branches";
import { site } from "@/data/site";
import type { BranchSlug, PlaceholderTone } from "@/data/types";
import { initials } from "@/lib/format";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The story, mission, values and leadership of Newton Global School — a Jaipur school group nurturing learners across three campuses since 1998.",
};

/** Core values (design.md §4.2.4) — icon chips, decorative inline SVGs. */
const CORE_VALUES: { name: string; iconPath: string }[] = [
  {
    name: "Integrity",
    iconPath:
      "M12 3l7 3v5.5c0 4.4-3 8.1-7 9.5-4-1.4-7-5.1-7-9.5V6l7-3z M9.5 12l2 2 3.5-4",
  },
  {
    name: "Curiosity",
    iconPath:
      "M12 3a6 6 0 0 0-3.7 10.7c.7.6 1.2 1.4 1.2 2.3h5c0-.9.5-1.7 1.2-2.3A6 6 0 0 0 12 3z M10 19h4 M10.5 21.5h3",
  },
  {
    name: "Respect",
    iconPath:
      "M9 10.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5 M15.1 4.9a2.5 2.5 0 1 1 1.4 4.6 M16 14.7c2.6.4 4.5 2.2 4.5 4.8",
  },
  {
    name: "Excellence",
    iconPath:
      "M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L3.5 9.7l5.9-.9L12 3.5z",
  },
  {
    name: "Compassion",
    iconPath:
      "M12 20.5S3.5 15.5 3.5 9.5a4.5 4.5 0 0 1 8.5-2 4.5 4.5 0 0 1 8.5 2c0 6-8.5 11-8.5 11z",
  },
  {
    name: "Responsibility",
    iconPath:
      "M5.5 18.5C5.5 10 11 5 20 4.5c-.5 9-5.5 14.5-14.5 14z M5.5 18.5C8 13.5 11.5 10 16.5 7.5",
  },
];

/** Two-line bios for the leadership cards; names/campuses come from data. */
const LEADER_BIOS: Record<BranchSlug, string> = {
  "city-center":
    "Guides our founding campus and its senior school with a calm focus on strong academics, pastoral care and board-year mentoring.",
  "green-valley":
    "Champions outdoor, experience-led learning and small class groups, from the kitchen garden to the athletics track.",
  riverside:
    "Leads our youngest campus with a joyful early-years programme where every child reads, swims, paints and codes.",
};

const LEADER_TONES: PlaceholderTone[] = ["dusk", "forest", "primary"];

/** Accreditation "logo" row rendered as styled text chips (no external images). */
const ACCREDITATIONS = [
  "CBSE Affiliated",
  "ISO 9001 Certified",
  "British Council ISA",
  "FIT India School",
  "Eco-Schools Green Flag",
];

export default function AboutPage() {
  const sortedByAge = [...branches].sort((a, b) => a.established - b.established);
  const [founding, second, third] = sortedByAge;
  const totalStudents = branches
    .reduce((total, branch) => total + branch.quickFacts.students, 0)
    .toLocaleString("en-IN");

  return (
    <>
      <PageHero
        title="About Us"
        subtitle={`One school family, three campuses across Jaipur — ${site.tagline.toLowerCase()}.`}
        breadcrumbs={[{ label: "About Us" }]}
      />

      {/* §4.2.2 — Our story */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <Reveal className="grid items-center gap-10 lg:grid-cols-2">
            <div className="overflow-hidden rounded-card shadow-card">
              <PlaceholderImage
                aspect="4/3"
                tone="dusk"
                label={`${founding.name}, ${founding.established}`}
              />
            </div>
            <div>
              <SectionHeading
                align="left"
                overline="Our Story"
                title="From a handful of classrooms to a family of campuses"
              />
              <div className="mt-5 space-y-4 text-base text-text">
                <p>
                  {site.name} began in {site.established} with a handful of
                  classrooms at what is now our {founding.name} in{" "}
                  {founding.area}. The early years were simple: committed
                  teachers, involved parents and a firm belief that a good
                  school is built on relationships before results.
                </p>
                <p>
                  As families asked us to bring the same approach to their own
                  neighbourhoods, {second.name} opened in {second.established}{" "}
                  with room to learn outdoors, followed by {third.name} in{" "}
                  {third.established} for our youngest learners. Today our
                  three campuses are home to {totalStudents} students and one
                  shared way of doing school.
                </p>
                <p>
                  Through all that growth, our promise to parents has stayed
                  the same: each campus small enough to know every child by
                  name, and a group strong enough to open every door.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* §4.2.3 — Mission & Vision */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <SectionHeading
            overline={"Mission & Vision"}
            title="What we are here to do"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Reveal>
              <Card className="h-full p-6 md:p-8">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                    focusable="false"
                  >
                    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z M12 13.2a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z" />
                  </svg>
                </span>
                <h3 className="mt-4 text-xl">Our Mission</h3>
                <p className="mt-3 text-base text-text">
                  To provide a safe, warm and academically rigorous education
                  in which every child — at every campus — discovers their
                  strengths, builds strong character and learns the habits of
                  independent thought.
                </p>
              </Card>
            </Reveal>
            <Reveal delay={100}>
              <Card className="h-full p-6 md:p-8">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                    focusable="false"
                  >
                    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  </svg>
                </span>
                <h3 className="mt-4 text-xl">Our Vision</h3>
                <p className="mt-3 text-base text-text">
                  To be the school group Jaipur families trust most: a
                  community of campuses where childhood is protected, curiosity
                  is contagious and every graduate leaves ready to shape a
                  kinder, brighter world.
                </p>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* §4.2.4 — Core values */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <SectionHeading
            overline="Core Values"
            title="Six habits we practise every day"
            subtitle="They hang on classroom walls at every campus — and we hold ourselves to them first."
          />
          <Reveal>
            <ul className="mt-10 flex flex-wrap justify-center gap-3">
              {CORE_VALUES.map((value) => (
                <li
                  key={value.name}
                  className="flex items-center gap-2.5 rounded-pill border border-border bg-bg-alt px-5 py-2.5"
                >
                  <span aria-hidden="true" className="text-primary">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                      focusable="false"
                    >
                      <path d={value.iconPath} />
                    </svg>
                  </span>
                  <span className="font-heading text-sm font-semibold text-text">
                    {value.name}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* §4.2.5 — Management / leadership */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <SectionHeading
            overline="Leadership"
            title="The people who lead our campuses"
            subtitle="Every campus is led by a principal with full academic and pastoral responsibility, supported by the group management team."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch, index) => (
              <Reveal key={branch.slug} delay={index * 100}>
                <Card className="h-full p-6 text-center">
                  <div className="mx-auto w-28 overflow-hidden rounded-full">
                    <PlaceholderImage
                      aspect="1/1"
                      tone={LEADER_TONES[index % LEADER_TONES.length]}
                      label={initials(branch.principal.name)}
                    />
                  </div>
                  <h3 className="mt-4 text-lg">{branch.principal.name}</h3>
                  <p className="mt-1 text-sm font-medium text-primary">
                    Principal · {branch.name}
                  </p>
                  <p className="mt-3 text-sm text-text-muted">
                    {LEADER_BIOS[branch.slug]}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* §4.2.6 — Accreditations & affiliations */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <SectionHeading
            overline="Recognition"
            title={"Accreditations & affiliations"}
          />
          <Reveal>
            <ul className="mt-10 flex flex-wrap items-stretch justify-center gap-4">
              {ACCREDITATIONS.map((item) => (
                <li
                  key={item}
                  className="flex items-center rounded-btn border border-hairline bg-surface px-6 py-4 shadow-card"
                >
                  <span className="font-heading text-sm font-semibold uppercase tracking-[0.06em] text-text-muted">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-center text-sm text-text-muted">
              Affiliation and accreditation certificates are available for
              review at the school office.
            </p>
          </Reveal>
        </div>
      </section>

      {/* §4.2.7 — CTA band → Admissions */}
      <CTABand
        title={`Admissions open for ${site.admissionYear}`}
        subtitle={`Join a school community that has been shaping bright futures since ${site.established}.`}
      />
    </>
  );
}
