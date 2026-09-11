import type { Metadata } from "next";
import Accordion, { type AccordionEntry } from "@/components/ui/Accordion";
import {
  CARD,
  CONTAINER,
  CONTAINER_FLUID,
  Icon,
  type Img,
  PageHero,
  PhotoBackdrop,
  rich,
  RunInText,
  SECTION,
  SectionTitle,
  STRONG,
  TINTS,
  Wave,
} from "@/components/site/school-kit";
import EnquiryBand from "@/components/site/EnquiryBand";
import Reveal from "@/components/ui/Reveal";
import { visionMission } from "@/data/pages/vision-mission";

export const metadata: Metadata = {
  title: "Vision & Mission",
  /* Taken from the document's own sub-heading so the two cannot drift apart. */
  description: visionMission.hero.sub,
};

/* ———————————————————————————————————————————————————————————————
 * Every string on this page comes from src/data/pages/vision-mission.ts,
 * machine-generated verbatim from "Newton Global School.docx" (Vision &
 * Mission tab). `**…**` marks the phrases the document bolds and is rendered
 * through rich(); nothing here is reworded, reordered or dropped. The only
 * authored text is the section eyebrows and the image alt copy.
 *
 * The document's image guide asks for "koi heavy image ki zaroorat nahi" here
 * and suggests the empty corridor as a light background — which is what the
 * banner and the closing band use.
 * ——————————————————————————————————————————————————————————————— */
const { hero, vision, mission, whyMatters, everyday, faq } = visionMission;

const IMG = {
  heroBanner: {
    src: "/images/school/corridor.webp",
    w: 1200,
    h: 1600,
    alt: "A corridor lined with classrooms inside the school",
  },
  ctaCampus: {
    src: "/images/school/campus-grounds.webp",
    w: 1600,
    h: 900,
    alt: "The school building across its green grounds",
  },
} as const satisfies Record<string, Img>;

const faqEntries: AccordionEntry[] = faq.items.map((item, index) => ({
  id: `faq-${index + 1}`,
  heading: <span className="font-bold">{item.q}</span>,
  content: <p className="text-[0.9375rem] leading-[1.75]">{rich(item.a)}</p>,
}));

export default function VisionMissionPage() {
  return (
    <>
      <PageHero
        image={IMG.heroBanner}
        priority
        crumbs={[{ label: "About Us", href: "/about" }, { label: "Vision & Mission" }]}
        h1={hero.h1}
        sub={hero.sub}
        body={hero.body}
      />

      {/* ——— §2 Our Vision — the navy band the section deserves ——— */}
      <section className="relative flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center overflow-hidden bg-[#001344] pb-16 pt-20 sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28">
        <Wave className="z-20 text-bg" />
        <PhotoBackdrop img={IMG.heroBanner} fixed />
        <div className={`relative ${CONTAINER_FLUID} max-w-4xl`}>
          <Reveal>
            <SectionTitle
              eyebrow="Our Vision"
              title={vision.h2}
              align="center"
              tone="dark"
            />
          </Reveal>
          {vision.body.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 32)} delay={index * 110}>
              <p className="mt-6 text-[0.9375rem] leading-[1.9] text-[#c2cfe4] md:text-base">
                {rich(paragraph, STRONG.dark)}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— §3 Our Mission — the document's four commitments ——— */}
      <section className={SECTION}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle eyebrow="Our Mission" title={mission.h2} align="center" />
            <p className="mx-auto mt-5 max-w-3xl text-center text-[0.9375rem] leading-[1.85] text-text-muted md:text-base">
              {rich(mission.lede)}
            </p>
          </Reveal>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:gap-6">
            {mission.items.map((item, index) => {
              const tint = TINTS[index % TINTS.length];
              return (
                <li key={item.slice(0, 32)}>
                  <Reveal delay={(index % 2) * 110} className="h-full">
                    <article
                      className={`flex h-full flex-col p-5 sm:p-6 lg:p-7 ${CARD} ${tint.edge} ${tint.bar}`}
                    >
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] ${tint.well}`}
                      >
                        <Icon name="target" className="h-5 w-5" />
                      </span>
                      <RunInText
                        text={item}
                        separator="any"
                        titleClass="mt-5 text-[1.0625rem] leading-[1.35] text-ink"
                        bodyClass="mt-2 break-words text-[0.9375rem] leading-[1.85] text-text-muted"
                      />
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ——— §4 Why this matters to parents ——— */}
      <section className={`border-y border-hairline bg-bg-alt ${SECTION}`}>
        <div className={`${CONTAINER_FLUID} max-w-4xl`}>
          <Reveal>
            <SectionTitle eyebrow="For Parents" title={whyMatters.h2} align="center" />
          </Reveal>
          {whyMatters.body.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 32)} delay={index * 110}>
              <p className="mt-6 text-[0.9375rem] leading-[1.9] text-text-muted md:text-base">
                {rich(paragraph)}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— §5 How the mission shows up day to day ——— */}
      <section className={SECTION}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle eyebrow="In Practice" title={everyday.h2} align="center" />
          </Reveal>
          <ul className="mx-auto mt-10 max-w-3xl divide-y divide-hairline border-y border-hairline lg:mt-12">
            {everyday.items.map((item, index) => (
              <li key={item.slice(0, 32)}>
                <Reveal delay={index * 70}>
                  <div className="flex items-start gap-4 py-5">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-pill bg-[#faf4e8] text-[#87661f]"
                    >
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <RunInText
                        text={item}
                        separator="any"
                        titleClass="text-[0.9375rem] leading-[1.35] text-ink"
                        bodyClass="mt-1 text-[0.9375rem] leading-[1.85] text-text-muted"
                      />
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
          <Reveal>
            <p className="mx-auto mt-8 max-w-3xl text-center text-[0.9375rem] leading-[1.85] text-text-muted md:text-base">
              {rich(everyday.closing)}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— §6 FAQ ——— */}
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
        formTitle="Enquire Now / Book a Visit"
      />
    </>
  );
}
