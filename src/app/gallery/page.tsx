import type { Metadata } from "next";
import MosaicGallery from "@/components/site/MosaicGallery";
import {
  CONTAINER,
  type Img,
  PageHero,
  SECTION,
  SectionTitle,
} from "@/components/site/school-kit";
import Reveal from "@/components/ui/Reveal";
import { getMergedGalleryItems } from "@/lib/gallery-store";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "The campus, classrooms, library, labs, playground and buses of Newton Global School, Sangteda, Kotputli — in photographs.",
};

/* Admin uploads should appear immediately — always render fresh from the DB. */
export const dynamic = "force-dynamic";

const IMG = {
  heroBanner: {
    src: "/images/school/campus-front.webp",
    w: 1600,
    h: 900,
    alt: "The Newton Global School building seen from the driveway",
  },
} as const satisfies Record<string, Img>;

export default async function GalleryPage() {
  const items = await getMergedGalleryItems();
  /* The mosaic needs a real file to lay out; tone-only placeholders have none. */
  const withPhotos = items.filter((item) => Boolean(item.imageUrl));

  return (
    <>
      <PageHero
        image={IMG.heroBanner}
        priority
        crumbs={[{ label: "About Us", href: "/about" }, { label: "Gallery" }]}
        h1={`Gallery`}
        sub={`Life at Newton Global School, Sangteda, Kotputli`}
        body={`Every photograph here was taken on our own campus. Filter by what you want to see, then open any picture full screen.`}
      />

      <section className={`bg-bg ${SECTION}`}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle
              eyebrow="Photo Gallery"
              title={`${withPhotos.length} Moments From Our Campus`}
              align="center"
            />
          </Reveal>
          <Reveal delay={110} className="mt-10 lg:mt-12">
            <MosaicGallery items={withPhotos} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
