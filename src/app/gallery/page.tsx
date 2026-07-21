import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import GalleryGrid from "@/components/ui/GalleryGrid";
import Reveal from "@/components/ui/Reveal";
import { getMergedGalleryItems } from "@/lib/gallery-store";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Browse photos of sports, Annual Day, classrooms and school trips across all three ${site.name} campuses in Jaipur.`,
};

// Admin uploads should appear immediately — always render fresh from the DB.
export const dynamic = "force-dynamic";

/**
 * Global photo gallery — design.md §4.7 (F5).
 * 1. Page hero with breadcrumbs
 * 2–3. Category filter chips + campus dropdown, thumbnail grid → lightbox
 *      (all handled by the shared GalleryGrid client component)
 * The optional video section (§4.7.4) is omitted: no external embeds allowed.
 */
export default async function GalleryPage() {
  const items = await getMergedGalleryItems();

  return (
    <>
      <PageHero
        title="Gallery"
        subtitle={`Everyday learning, big stage moments and adventures beyond the classroom — life at ${site.name}, in pictures.`}
        breadcrumbs={[{ label: "Gallery" }]}
      />

      <section className="py-12 md:py-14">
        <div className="mx-auto max-w-content px-4">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
              <SectionHeading
                overline="Photo Gallery"
                title="Moments From Our Campuses"
              />
              <p className="max-w-xs text-[0.96875rem] leading-relaxed text-text-muted">
                Filter by category or campus, then click any photo to open it
                in the full-screen viewer.
              </p>
            </div>
          </Reveal>
          <div className="mt-9">
            <GalleryGrid items={items} showBranchFilter />
          </div>
        </div>
      </section>
    </>
  );
}
