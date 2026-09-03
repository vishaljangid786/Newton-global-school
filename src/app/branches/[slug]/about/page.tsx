import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Reveal from "@/components/ui/Reveal";
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
    title: `About | ${branch.name}`,
    description: `The story, infrastructure, facilities and achievements of ${branch.name}, the ${site.name} campus in ${branch.area}.`,
  };
}

const checkIcon = (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable={false}
  >
    <path d="M4.5 12.5l5 5L19.5 7" />
  </svg>
);

const awardIcon = (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable={false}
  >
    <circle cx="12" cy="9" r="5.5" />
    <path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5" />
  </svg>
);

/** Highest grade taught, parsed from the grades string in branch data. */
function maxGrade(branch: Branch): number {
  if (branch.grades.includes("12")) return 12;
  if (branch.grades.includes("10")) return 10;
  return 8;
}

/** §5.2 achievements — data-led lines plus group-wide recognitions. */
function buildAchievements(branch: Branch): string[] {
  const safetyFacilities = branch.facilities.filter((facility) =>
    /cctv|transport/i.test(facility)
  );
  return [
    `Trusted by ${branch.quickFacts.students.toLocaleString(
      "en-IN"
    )} students and their families across ${branch.area}`,
    maxGrade(branch) >= 10
      ? "A full pass record in every CBSE board cohort, with subject toppers year after year"
      : "Consistently strong learning outcomes in CBSE-aligned foundational assessments",
    "Champions and finalists at inter-school sports, quiz and cultural meets across Jaipur",
    `A safe, green ${branch.quickFacts.campusSize} campus — ${safetyFacilities.join(
      " and "
    )}`,
    `Part of the ${site.name} story since ${branch.established}`,
  ];
}

export default async function BranchAboutPage({ params }: BranchPageProps) {
  const { slug } = await params;
  const branch = await getBranchBySlugAsync(slug);
  if (!branch) notFound();

  const isFoundingCampus = branch.established === site.established;
  const achievements = buildAchievements(branch);

  return (
    <>
      <PageHero
        title={`About ${branch.name}`}
        subtitle={`Our story, our spaces and what makes school life in ${branch.area} special.`}
        breadcrumbs={[
          { label: "Branches", href: "/branches" },
          { label: branch.name, href: `/branches/${branch.slug}` },
          { label: "About" },
        ]}
      />

      {/* 1. Campus story — §5.2 */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <SectionHeading
                align="left"
                overline="Our Story"
                title={`A Campus Rooted in ${branch.area.split(",")[0]}`}
              />
              <div className="mt-5 space-y-4 text-base text-text">
                <p>
                  {branch.name} opened its gates in {branch.established}
                  {isFoundingCampus
                    ? ` as the founding campus of ${site.name}`
                    : ` as part of the ${site.name} group`}
                  . What began as a handful of classrooms in {branch.area} has
                  grown into a {branch.quickFacts.campusSize} campus where{" "}
                  {branch.quickFacts.students.toLocaleString("en-IN")} students
                  learn, play and grow together every day.
                </p>
                <p>
                  Today the campus offers {branch.grades}, taught to the same
                  standard and with the same warmth as every Newton campus.
                  Classes are kept a sensible size, mornings begin with
                  assembly and music, and the school day balances serious
                  study with plenty of time on the field and the stage.
                </p>
                <p>
                  Under the leadership of {branch.principal.name}, the campus
                  team works closely with parents — because a school does its
                  best work when families and teachers pull in the same
                  direction.
                </p>
              </div>
            </div>
            <PlaceholderImage
              aspect="4/3"
              tone="primary"
              label={branch.name}
              className="rounded-card shadow-card"
            />
          </div>
        </div>
      </section>

      {/* 2. Infrastructure photos, 2-up — §5.2 */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <SectionHeading
            overline="Infrastructure"
            title="Built for Busy School Days"
            subtitle="Purpose-built blocks that keep learning, sport and the arts under one roof."
          />
          <Reveal>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <figure>
                <PlaceholderImage
                  aspect="16/9"
                  tone="dusk"
                  label="Academic Block"
                  className="rounded-card shadow-card"
                />
                <figcaption className="mt-2 text-sm text-text-muted">
                  Classrooms, libraries and labs at {branch.name}
                </figcaption>
              </figure>
              <figure>
                <PlaceholderImage
                  aspect="16/9"
                  tone="forest"
                  label="Sports & Activity Zones"
                  className="rounded-card shadow-card"
                />
                <figcaption className="mt-2 text-sm text-text-muted">
                  Play areas and activity spaces across the{" "}
                  {branch.quickFacts.campusSize} campus
                </figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. Facilities icon grid — §5.2 */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <SectionHeading
            overline="Facilities"
            title="Everything a Growing Child Needs"
            subtitle={`What you will find on a walk around ${branch.name}.`}
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {branch.facilities.map((facility) => (
              <li
                key={facility}
                className="flex items-center gap-3 rounded-card bg-bg-alt p-4"
              >
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-primary/10 text-primary"
                >
                  {checkIcon}
                </span>
                <span className="text-sm font-medium text-text">
                  {facility}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Achievements — §5.2 */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <SectionHeading
            overline="Achievements"
            title="Milestones We Are Proud Of"
          />
          <ul className="mx-auto mt-10 max-w-3xl space-y-4">
            {achievements.map((achievement) => (
              <li
                key={achievement}
                className="flex items-start gap-4 rounded-card border border-hairline bg-surface p-5 shadow-card"
              >
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-accent/15 text-primary"
                >
                  {awardIcon}
                </span>
                <p className="text-sm text-text md:text-base">{achievement}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
