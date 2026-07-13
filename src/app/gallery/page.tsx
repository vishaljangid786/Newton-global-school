import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import GalleryGrid from "@/components/ui/GalleryGrid";
import Reveal from "@/components/ui/Reveal";
import { getGalleryItems } from "@/data/gallery";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Browse photos of sports, Annual Day, classrooms and school trips across all three ${site.name} campuses in Jaipur.`,
};

/**
 * Global photo gallery — design.md §4.7 (F5).
 * 1. Page hero with breadcrumbs
 * 2–3. Category filter chips + campus dropdown, thumbnail grid → lightbox
 *      (all handled by the shared GalleryGrid client component)
 * The optional video section (§4.7.4) is omitted: no external embeds allowed.
 */
export default function GalleryPage() {
  const items = getGalleryItems();

  return (
    <>
      <PageHero
        title="Gallery"
        subtitle={`Everyday learning, big stage moments and adventures beyond the classroom — life at ${site.name}, in pictures.`}
        breadcrumbs={[{ label: "Gallery" }]}
      />

      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <Reveal>
            <SectionHeading
              overline="Photo Gallery"
              title="Moments From Our Campuses"
              subtitle="Filter by category or campus, then click any photo to open it in the full-screen viewer."
            />
          </Reveal>
          <div className="mt-10">
            <GalleryGrid items={items} showBranchFilter />
          </div>
        </div>
      </section>
    </>
  );
}
