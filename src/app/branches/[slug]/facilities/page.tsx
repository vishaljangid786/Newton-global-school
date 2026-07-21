import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Badge from "@/components/ui/Badge";
import CTABand from "@/components/ui/CTABand";
import PageHero from "@/components/ui/PageHero";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { getBranchBySlugAsync } from "@/lib/branches-store";
import { getBranchContent } from "@/lib/branch-content";
import { site } from "@/data/site";
import type { PlaceholderTone } from "@/data/types";

// Facilities are admin-editable (branches table + branch_overrides), so this
// page always renders fresh from the DB.
export const dynamic = "force-dynamic";

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
    title: `Facilities | ${branch.name}`,
    description: `Library, labs, sports, transport, safety and medical facilities at ${branch.name}, ${site.name}, ${branch.area}.`,
  };
}

/**
 * §5.6 — the six facility rows. Copy is shared across campuses; the chips
 * under each row are pulled from that branch's `facilities` data by keyword,
 * so every campus shows its own spaces without hardcoding branch info here.
 */
interface FacilityRow {
  title: string;
  tone: PlaceholderTone;
  keywords: string[];
  description: string;
}

const FACILITY_ROWS: FacilityRow[] = [
  {
    title: "Library",
    tone: "dusk",
    keywords: ["librar", "reading"],
    description:
      "Open shelves, graded readers and quiet corners encourage children to browse and borrow every week. Every class has a timetabled library period, a reading challenge runs each term, and parents are welcome to borrow from the family shelf too.",
  },
  {
    title: "Labs",
    tone: "mist",
    keywords: ["lab", "smart classroom"],
    description:
      "Concepts move from the blackboard to the workbench in our science, computer and maker spaces. Practical work is timetabled from the primary years, with trained lab assistants and a safety briefing at the start of every session.",
  },
  {
    title: "Sports",
    tone: "forest",
    keywords: [
      "sport",
      "athletic",
      "football",
      "cricket",
      "swim",
      "play field",
      "adventure",
      "pool",
      "ground",
      "track",
    ],
    description:
      "Morning fitness, house tournaments and coached practice keep every child active — not just the team players. Qualified coaches run age-banded sessions through the week, and all equipment and kits are provided by the school.",
  },
  {
    title: "Transport",
    tone: "primary",
    keywords: ["transport"],
    description:
      "A GPS-tracked bus fleet covers most of Jaipur, with a trained attendant on every route and speed governors on every vehicle. Parents receive stop timings each term, and routes are reviewed regularly to keep travel time short.",
  },
  {
    title: "Safety & CCTV",
    tone: "stone",
    keywords: ["cctv"],
    description:
      "The campus is CCTV-monitored across gates, corridors and play areas, with visitor entry logged at a single manned gate. All staff undergo background verification, and fire and evacuation drills are practised with students every term.",
  },
  {
    title: "Medical Room",
    tone: "accent",
    keywords: ["medical"],
    description:
      "A stocked medical room with a trained attendant handles first aid, routine checks and rest breaks during the day. Parents are informed immediately of any incident, and an annual health screening is recorded for every student.",
  },
];

export default async function BranchFacilitiesPage({ params }: BranchPageProps) {
  const { slug } = await params;
  const branch = await getBranchContent(slug);
  if (!branch) notFound();

  return (
    <>
      {/* §5.6 — page hero */}
      <PageHero
        title={`Facilities at ${branch.name}`}
        subtitle={`Six spaces your child will use every week on our ${branch.quickFacts.campusSize} campus in ${branch.area}.`}
        breadcrumbs={[
          { label: "Branches", href: "/branches" },
          { label: branch.name, href: `/branches/${branch.slug}` },
          { label: "Facilities" },
        ]}
      />

      {/* §5.6 — alternating image/text rows */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <SectionHeading
            overline="Campus tour"
            title="Built for Safe, Hands-On Learning"
            subtitle={`What ${branch.quickFacts.students.toLocaleString("en-IN")} students use every day — from the library to the medical room.`}
          />
          <div className="mt-12 space-y-14 md:space-y-20">
            {FACILITY_ROWS.map((row, index) => {
              const matched = branch.facilities.filter((facility) =>
                row.keywords.some((keyword) =>
                  facility.toLowerCase().includes(keyword)
                )
              );
              const flipped = index % 2 === 1;
              return (
                <Reveal key={row.title}>
                  <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
                    <div className={flipped ? "md:order-2" : ""}>
                      <PlaceholderImage
                        aspect="4/3"
                        tone={row.tone}
                        label={row.title}
                        className="rounded-card shadow-card"
                      />
                    </div>
                    <div className={flipped ? "md:order-1" : ""}>
                      <h3 className="text-xl text-text md:text-2xl">
                        {row.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-text-muted md:text-base">
                        {row.description}
                      </p>
                      {matched.length > 0 ? (
                        <ul
                          aria-label={`${row.title} at ${branch.name}`}
                          className="mt-4 flex flex-wrap gap-2"
                        >
                          {matched.map((facility) => (
                            <li key={facility}>
                              <Badge variant="outline">{facility}</Badge>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Full facility list — everything the campus offers, DB-backed */}
          <div className="mt-14 rounded-card border border-hairline bg-surface p-6 shadow-card md:p-8">
            <SectionHeading
              align="left"
              overline="At a glance"
              title={`Everything at ${branch.name}`}
              subtitle="The complete, up-to-date list of spaces and services on this campus."
            />
            <ul
              aria-label={`All facilities at ${branch.name}`}
              className="mt-6 flex flex-wrap gap-2.5"
            >
              {branch.facilities.map((facility) => (
                <li
                  key={facility}
                  className="flex items-center gap-2 rounded-btn border border-border bg-bg-alt px-3.5 py-2 text-sm font-medium text-text"
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-pill bg-accent"
                  />
                  {facility}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Closing CTA — admissions */}
      <CTABand
        title={`Admissions open for ${site.admissionYear}`}
        subtitle={`The best way to judge a campus is to walk through it on a working day — start with an inquiry and we will book your tour of ${branch.name}.`}
        ctaHref={`/branches/${branch.slug}/admissions`}
      />
    </>
  );
}
