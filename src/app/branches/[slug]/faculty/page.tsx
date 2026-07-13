import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ButtonLink from "@/components/ui/Button";
import FacultyCard from "@/components/ui/FacultyCard";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { getBranchBySlugAsync } from "@/lib/branches-store";
import { getFacultyForBranch } from "@/data/faculty";
import { site } from "@/data/site";
import type { PlaceholderTone } from "@/data/types";

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
    title: `Faculty | ${branch.name}`,
    description: `Meet the principal and teaching team at ${branch.name}, the ${site.name} campus in ${branch.area}.`,
  };
}

/** Portrait tones cycled across the grid so placeholders look varied. */
const PORTRAIT_TONES: PlaceholderTone[] = [
  "mist",
  "primary",
  "dusk",
  "forest",
  "stone",
];

export default async function BranchFacultyPage({ params }: BranchPageProps) {
  const { slug } = await params;
  const branch = await getBranchBySlugAsync(slug);
  if (!branch) notFound();

  const { principal, staff } = getFacultyForBranch(branch.slug);

  return (
    <>
      <PageHero
        title={`Faculty at ${branch.name}`}
        subtitle="The people who make every school morning count — qualified, experienced and genuinely fond of teaching."
        breadcrumbs={[
          { label: "Branches", href: "/branches" },
          { label: branch.name, href: `/branches/${branch.slug}` },
          { label: "Faculty" },
        ]}
      />

      {/* 1. Principal feature card — §5.4 */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <SectionHeading
            overline="Leadership"
            title="Led from the Front"
            subtitle={`${principal.name} heads the ${branch.name} team.`}
          />
          <div className="mx-auto mt-10 max-w-3xl">
            <FacultyCard member={principal} featured tone="mist" />
          </div>
        </div>
      </section>

      {/* 2. Staff grid — §5.4 (photo 1:1, name, designation, qualification) */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <SectionHeading
            overline="Our Teachers"
            title="Meet the Team"
            subtitle={`${staff.length} coordinators, subject leads and class teachers across departments.`}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {staff.map((member, index) => (
              <Reveal key={member.name} delay={(index % 3) * 100}>
                <FacultyCard
                  member={member}
                  tone={PORTRAIT_TONES[index % PORTRAIT_TONES.length]}
                  className="h-full"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Careers strip */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4 text-center">
          <SectionHeading
            overline="Join Us"
            title="Would You Like to Teach Here?"
            subtitle={`${site.name} is always glad to hear from passionate educators.`}
          />
          <ButtonLink href="/careers" variant="outline" className="mt-8">
            View Open Positions
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
