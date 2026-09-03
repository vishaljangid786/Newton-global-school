import type { Metadata } from "next";
import Accordion, { type AccordionEntry } from "@/components/ui/Accordion";
import {
  CARD,
  CONTAINER,
  Cover,
  DoodleWash,
  GoldLink,
  Icon,
  type IconName,
  type Img,
  PageHero,
  rich,
  SECTION,
  SectionTitle,
  STRONG,
  TINTS,
  Wave,
} from "@/components/site/school-kit";
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
        ctaHref="/contact"
      />

      {/* ——— §2 Overview ——— */}
      <section className={`relative overflow-hidden bg-bg ${SECTION}`}>
        <DoodleWash className="text-[#000c2e] opacity-[0.045]" />
        <div className={`relative ${CONTAINER} max-w-4xl text-center`}>
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
                      className={`flex h-full flex-col p-5 sm:p-6 lg:p-7 ${CARD} ${tint.edge} ${tint.bar}`}
                    >
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] ${tint.well}`}
                      >
                        <Icon name={PROGRAM_ICONS[index] ?? "check"} className="h-5 w-5" />
                      </span>
                      <p className="mt-5 break-words text-[0.9375rem] leading-[1.85] text-text-muted">
                        {rich(item, STRONG.runIn)}
                      </p>
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
        <div className={`${CONTAINER} max-w-4xl text-center`}>
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

      {/* ——— Closing call to action ——— */}
      <section className="relative flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center overflow-hidden bg-[#001344] pb-16 pt-20 text-center text-white sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28">
        <Wave className="z-20 text-bg-alt" />
        <Cover img={IMG.ctaCampus} sizes="100vw" decorative className="opacity-[0.28]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(0,19,68,0.95),rgba(0,12,46,0.86))]"
        />
        <Reveal className={`relative ${CONTAINER}`}>
          <span
            aria-hidden="true"
            className="mx-auto block h-[3px] w-16 rounded-pill bg-[#d6a53f]"
          />
          <h2 className="mx-auto mt-6 max-w-3xl text-[1.5rem] leading-[1.2] text-white sm:text-[1.75rem] md:text-[2rem] lg:text-[2.25rem]">
            {rich(hero.h1, STRONG.headingDark)}
          </h2>
          <GoldLink href="/contact" className="mt-8 w-full sm:w-auto">
            {hero.cta}
          </GoldLink>
        </Reveal>
      </section>
    </>
  );
}
