import type { Metadata } from "next";
import Accordion, { type AccordionEntry } from "@/components/ui/Accordion";
import {
  CARD,
  CONTAINER,
  Cover,
  CONTAINER_FLUID,
  DoodleWash,
  Icon,
  type IconName,
  type Img,
  PageHero,
  rich,
  RunInText,
  SECTION,
  SectionTitle,
  TINTS,
} from "@/components/site/school-kit";
import EnquiryBand from "@/components/site/EnquiryBand";
import Reveal from "@/components/ui/Reveal";
import { advanceProgram } from "@/data/pages/advance-program";

export const metadata: Metadata = {
  title: "Advance Program",
  /* Taken from the document's own sub-heading so the two cannot drift apart. */
  description: advanceProgram.hero.sub,
};

/* ———————————————————————————————————————————————————————————————
 * Every string on this page comes from src/data/pages/advance-program.ts,
 * machine-generated verbatim from "Newton Global School.docx" (Advance
 * Program tab). `**…**` marks the phrases the document bolds and is rendered
 * through rich(); nothing here is reworded, reordered or dropped. The only
 * authored text is the section eyebrows and the image alt copy.
 * ——————————————————————————————————————————————————————————————— */
const { hero, overview, programs, whyMatters, faq } = advanceProgram;

/**
 * One photograph per programme, in the document's order. Each was chosen for
 * what it actually shows: the smart-class screen, the library for exam
 * preparation, a teacher addressing the hall for spoken English, the computer
 * lab for STEM, and morning assembly for the values sessions.
 */
const PROGRAM_PHOTOS: Img[] = [
  {
    src: "/images/school/pupils-smart-class.webp",
    w: 1600,
    h: 1200,
    alt: "A class watching a lesson on the smart classroom screen",
  },
  {
    src: "/images/school/library-students.webp",
    w: 1600,
    h: 1200,
    alt: "Students studying at the tables in the school library",
  },
  {
    src: "/images/school/assembly-address.webp",
    w: 1600,
    h: 1200,
    alt: "A teacher addressing students in the assembly hall",
  },
  {
    src: "/images/school/computer-lab-students.webp",
    w: 1600,
    h: 1200,
    alt: "Students working at the computers in the computer lab",
  },
  {
    src: "/images/school/assembly-hall.webp",
    w: 1600,
    h: 1200,
    alt: "Students seated together in the assembly hall",
  },
];

const IMG = {
  heroBanner: {
    src: "/images/school/computer-lab-students.webp",
    w: 1600,
    h: 1200,
    alt: "Pupils working at computers in the school lab",
  },
  ctaCampus: {
    src: "/images/school/campus-front.webp",
    w: 1600,
    h: 900,
    alt: "The Newton Global School building seen from the driveway",
  },
} as const satisfies Record<string, Img>;

/* One icon per numbered programme, in the document's own order. */
const PROGRAM_ICONS: readonly IconName[] = [
  "monitor",
  "trophy",
  "faculty",
  "flask",
  "target",
];

const faqEntries: AccordionEntry[] = faq.items.map((item, index) => ({
  id: `faq-${index + 1}`,
  heading: <span className="font-bold">{item.q}</span>,
  content: <p className="text-[0.9375rem] leading-[1.75]">{rich(item.a)}</p>,
}));

export default function AdvanceProgramPage() {
  return (
    <>
      <PageHero
        image={IMG.heroBanner}
        priority
        crumbs={[{ label: "Academics", href: "/academics" }, { label: "Advance Program" }]}
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

      {/* ——— §3 The five programmes, in the document's order ——— */}
      <section className={`border-y border-hairline bg-bg-alt ${SECTION}`}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle eyebrow="What's Included" title={programs.h2} align="center" />
          </Reveal>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6">
            {programs.items.map((item, index) => {
              const tint = TINTS[index % TINTS.length];
              return (
                <li
                  key={item.slice(0, 32)}
                  className={index === 3 ? "lg:col-start-1" : undefined}
                >
                  <Reveal delay={(index % 3) * 90} className="h-full">
                    <article
                      className={`flex h-full flex-col overflow-hidden ${CARD} ${tint.edge} ${tint.bar}`}
                    >
                      {PROGRAM_PHOTOS[index] ? (
                        <div className="relative aspect-[16/10] w-full overflow-hidden">
                          <Cover
                            img={PROGRAM_PHOTOS[index]}
                            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                          />
                        </div>
                      ) : null}
                      <div className="flex flex-1 flex-col p-5 sm:p-6 lg:p-7">
                        <span
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] ${tint.well}`}
                        >
                          <Icon name={PROGRAM_ICONS[index] ?? "check"} className="h-5 w-5" />
                        </span>
                        <RunInText
                          text={item}
                          separator="any"
                          titleClass="mt-5 text-[1.0625rem] leading-[1.35] text-ink"
                        />
                      </div>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ——— §4 Why this matters ——— */}
      <section className={SECTION}>
        <div className={`${CONTAINER_FLUID} max-w-4xl text-center`}>
          <Reveal>
            <SectionTitle eyebrow="The Difference" title={whyMatters.h2} align="center" />
            <p className="mt-6 text-[0.9375rem] leading-[1.9] text-text-muted md:text-base">
              {rich(whyMatters.body)}
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

      {/* ——— Closing call to action — with the form, not a link to it ——— */}
      <EnquiryBand
        image={IMG.ctaCampus}
        h2={hero.h1}
        waveClass="text-bg-alt"
        formTitle={hero.cta}
      />
    </>
  );
}
