import type { Metadata } from "next";
import {
  CONTAINER,
  CONTAINER_FLUID,
  type Img,
  PageHero,
  SECTION,
  SectionTitle,
} from "@/components/site/school-kit";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Mandatory Disclosure",
  description:
    "Mandatory public disclosure for Newton Global School, Sangteda, Kotputli.",
};

const IMG = {
  heroBanner: {
    src: "/images/school/reception.webp",
    w: 1600,
    h: 1200,
    alt: "The school reception desk and waiting area",
  },
} as const satisfies Record<string, Img>;

/**
 * Placeholder page. Mandatory disclosure is a regulatory filing — affiliation
 * number, society registration, land and building documents, staff strength,
 * fee structure and committee members — so nothing is written here until the
 * school supplies the real figures and documents. Inventing any of it would
 * be worse than an empty page.
 */
export default function MandatoryDisclosurePage() {
  return (
    <>
      <PageHero
        image={IMG.heroBanner}
        priority
        crumbs={[{ label: "About Us", href: "/about" }, { label: "Mandatory Disclosure" }]}
        h1={`Mandatory Disclosure`}
        sub={`Newton Global School, Sangteda, Kotputli, Rajasthan`}
      />

      <section className={`bg-bg ${SECTION}`}>
        <div className={`${CONTAINER_FLUID} max-w-3xl text-center`}>
          <Reveal>
            <SectionTitle
              eyebrow="Public Disclosure"
              title={`Details Coming Soon`}
              align="center"
            />
            <p className="mt-6 text-[0.9375rem] leading-[1.9] text-text-muted md:text-base">
              This page will carry the school&rsquo;s mandatory public
              disclosure. The details are being compiled and will be published
              here shortly.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
