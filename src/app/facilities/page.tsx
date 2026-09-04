import type { Metadata } from "next";
import Accordion, { type AccordionEntry } from "@/components/ui/Accordion";
import {
  CARD,
  CONTAINER,
  CONTAINER_FLUID,
  Cover,
  DoodleWash,
  Icon,
  type IconName,
  type Img,
  PageHero,
  rich,
  SECTION,
  SectionTitle,
  splitRunIn,
  TINTS,
} from "@/components/site/school-kit";
import EnquiryBand from "@/components/site/EnquiryBand";
import Reveal from "@/components/ui/Reveal";
import { facilities } from "@/data/pages/facilities";

export const metadata: Metadata = {
  title: "Facilities",
  /* Taken from the document's own sub-heading so the two cannot drift apart. */
  description: facilities.hero.sub,
};

/* ———————————————————————————————————————————————————————————————
 * Every string on this page comes from src/data/pages/facilities.ts, which is
 * machine-generated verbatim from "Newton Global School.docx" (Facilities
 * tab). `**…**` marks the phrases the document bolds and is rendered through
 * rich(); nothing here is reworded, reordered or dropped. The only authored
 * text is the section eyebrows and the image alt copy.
 * ——————————————————————————————————————————————————————————————— */
const { hero, overview, detail, whyCampus, faq } = facilities;

const IMG = {
  heroBanner: {
    src: "/images/school/campus-front.webp",
    w: 1600,
    h: 900,
    alt: "The Newton Global School building seen from the driveway",
  },
  ctaCampus: {
    src: "/images/school/campus-side-buses.webp",
    w: 1600,
    h: 1200,
    alt: "Newton Global School buses parked beside the campus building",
  },
} as const satisfies Record<string, Img>;

/**
 * One photograph per numbered facility, in the document's own order.
 *
 * `null` where the school has no photograph of that facility — there is no
 * picture of the medical room, the CCTV setup or the music and art room, and
 * standing in an unrelated corridor or play room for them would caption a
 * photograph with something it does not show. Those three fall back to the
 * tinted icon panel instead.
 */
const FACILITY_PHOTOS: Array<Img | null> = [
  {
    src: "/images/school/classroom-students.webp",
    w: 1600,
    h: 1200,
    alt: "Students at their desks in a Newton Global School classroom",
  },
  {
    src: "/images/school/science-experiment.webp",
    w: 1600,
    h: 1200,
    alt: "Students carrying out an experiment in the science lab",
  },
  {
    src: "/images/school/library-reading-group.webp",
    w: 1600,
    h: 1200,
    alt: "Students reading together at a table in the school library",
  },
  {
    src: "/images/school/playground.webp",
    w: 1600,
    h: 1200,
    alt: "The school playground with swings and open ground",
  },
  {
    src: "/images/school/students-boarding-bus.webp",
    w: 1600,
    h: 1200,
    alt: "Students boarding a Newton Global School bus",
  },
  {
    src: "/images/school/pupils-smart-class.webp",
    w: 1600,
    h: 1200,
    alt: "A class watching a lesson on the smart classroom screen",
  },
  null, // CCTV Surveillance
  {
    src: "/images/school/drinking-water-ro.webp",
    w: 1600,
    h: 1200,
    alt: "Students at the campus RO drinking water unit",
  },
  null, // First Aid & Medical Room
  null, // Music & Art Room
  {
    src: "/images/school/sports-store.webp",
    w: 1600,
    h: 1200,
    alt: "The school's sports equipment store",
  },
  {
    src: "/images/school/gallery/campus-green-grounds.webp",
    w: 1400,
    h: 1050,
    alt: "The green grounds and driveway of the Sangteda campus",
  },
];

/* One icon per numbered facility, in the document's own order. */
const FACILITY_ICONS: IconName[] = [
  "classroom",
  "flask",
  "library",
  "trophy",
  "bus",
  "monitor",
  "cctv",
  "droplet",
  "medical",
  "music",
  "yoga",
  "leaf",
];

/** §5 — the document's five facility questions, in the shared Accordion. */
const faqEntries: AccordionEntry[] = faq.items.map((item, index) => ({
  id: `faq-${index + 1}`,
  heading: <span className="font-bold">{item.q}</span>,
  content: <p className="text-[0.9375rem] leading-[1.75]">{rich(item.a)}</p>,
}));

export default function FacilitiesPage() {
  return (
    <>
      <PageHero
        image={IMG.heroBanner}
        priority
        crumbs={[{ label: "Facilities" }]}
        h1={hero.h1}
        sub={hero.sub}
        body={hero.body}
        cta={hero.cta}
        ctaHref="#enquiry"
      />

      {/* ——— §2 Overview ——— */}
      <section className={`relative overflow-hidden bg-bg ${SECTION}`}>
        <DoodleWash className="text-[#000c2e] opacity-[0.045]" />
        <div className={`relative ${CONTAINER_FLUID} max-w-4xl text-center`}>
          <Reveal>
            <SectionTitle eyebrow="Overview" title={overview.h2} align="center" />
            <p className="mt-6 text-[0.9375rem] leading-[1.9] text-text-muted md:text-base">
              {rich(overview.body)}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— §3 The twelve facilities, in the document's order ——— */}
      <section className={`border-y border-hairline bg-bg-alt ${SECTION}`}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle eyebrow="Our Campus" title={detail.h2} align="center" />
          </Reveal>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6">
            {detail.items.map((item, index) => {
              const tint = TINTS[index % TINTS.length];
              const icon = FACILITY_ICONS[index] ?? "check";
              const photo = FACILITY_PHOTOS[index] ?? null;
              /* This tab writes its run-ins as "**1. Title** body", with no
                 dash, so the looser split is the right one here. */
              const { title, body } = splitRunIn(item, { separator: "any" });
              return (
                <li key={item.slice(0, 32)}>
                  <Reveal delay={(index % 3) * 90} className="h-full">
                    <article
                      className={`flex h-full flex-col overflow-hidden ${CARD} ${tint.edge} ${tint.bar}`}
                    >
                      {photo ? (
                        <div className="relative aspect-[16/10] w-full overflow-hidden">
                          <Cover
                            img={photo}
                            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                          />
                        </div>
                      ) : (
                        <div
                          aria-hidden="true"
                          className={`flex aspect-[16/10] w-full items-center justify-center ${tint.well}`}
                        >
                          <Icon name={icon} className="h-10 w-10 opacity-70" />
                        </div>
                      )}

                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.875rem] ${tint.well}`}
                        >
                          <Icon name={icon} className="h-5 w-5" />
                        </span>
                        <h3 className="mt-4 text-[1.0625rem] leading-[1.35] text-ink">
                          {title || item}
                        </h3>
                        {title ? (
                          <p className="mt-2 break-words text-[0.9375rem] leading-[1.85] text-text-muted">
                            {rich(body, "font-semibold text-ink")}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ——— §4 Why choose our campus ——— */}
      <section className={SECTION}>
        <div className={`${CONTAINER_FLUID} max-w-4xl text-center`}>
          <Reveal>
            <SectionTitle eyebrow="Every Stage" title={whyCampus.h2} align="center" />
            <p className="mt-6 text-[0.9375rem] leading-[1.9] text-text-muted md:text-base">
              {rich(whyCampus.body)}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— §5 FAQ ——— */}
      <section className={`border-y border-hairline bg-bg-alt ${SECTION}`}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle eyebrow="FAQ" title={faq.h2} align="center" />
          </Reveal>
          <div className="mx-auto mt-10 max-w-3xl lg:mt-12">
            <Accordion items={faqEntries} />
          </div>
        </div>
      </section>

      {/* ——— Campus-visit call to action — with the form in it ——— */}
      <EnquiryBand
        image={IMG.ctaCampus}
        h2={hero.h1}
        waveClass="text-bg-alt"
        formTitle={hero.cta}
      />
    </>
  );
}
