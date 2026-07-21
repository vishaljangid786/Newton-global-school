import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GalleryGrid from "@/components/ui/GalleryGrid";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { getBranchBySlugAsync } from "@/lib/branches-store";
import { getMergedGalleryItems } from "@/lib/gallery-store";
import { site } from "@/data/site";

// Admin uploads should appear immediately — always render fresh from the DB.
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
    title: `Gallery | ${branch.name}`,
    description: `Photos of sports, Annual Day, classrooms and trips at ${branch.name}, ${site.name}, ${branch.area}.`,
  };
}

/**
 * Branch photo gallery — design.md §5.7: same as the global gallery but
 * pre-filtered to this campus (category chips only, no campus dropdown).
 */
export default async function BranchGalleryPage({ params }: BranchPageProps) {
  const { slug } = await params;
  const branch = await getBranchBySlugAsync(slug);
  if (!branch) notFound();

  const items = await getMergedGalleryItems({ branch: branch.slug });

  return (
    <>
      <PageHero
        title={`Gallery — ${branch.name}`}
        subtitle={`Sports days, stage moments, classrooms and trips — life at our ${branch.area} campus, in pictures.`}
        breadcrumbs={[
          { label: "Branches", href: "/branches" },
          { label: branch.name, href: `/branches/${branch.slug}` },
          { label: "Gallery" },
        ]}
      />

      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <Reveal>
            <SectionHeading
              overline="Photo gallery"
              title={`Moments From ${branch.name}`}
              subtitle="Filter by category, then click any photo to open it in the full-screen viewer."
            />
          </Reveal>
          <div className="mt-10">
            <GalleryGrid items={items} fixedBranch={branch.slug} />
          </div>
          <p className="mt-10 text-center text-sm text-text-muted">
            Looking for the other campuses?{" "}
            <Link
              href="/gallery"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Browse the full gallery
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
