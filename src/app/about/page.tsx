import type { Metadata } from "next";
import Link from "next/link";
import {
  CARD,
  CONTAINER,
  Cover,
  DoodleWash,
  Icon,
  type IconName,
  type Img,
  PageHero,
  Photo,
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

export const metadata: Metadata = {
  title: "About Us",
  description: "A Trusted Name in Education at Sangteda, Kotputli, Rajasthan",
};

/* ———————————————————————————————————————————————————————————————
 * Page copy — transcribed verbatim from "Newton Global School.docx"
 * (About Us Page tab). `**…**` marks the phrases the document bolds; every
 * other character — hyphens, punctuation, casing — is exactly as written in
 * the source. Do not reword.
 *
 * The document's two parenthetical author notes ("Yahan aap RBSE affiliation
 * number/status confirm hone ke baad add kar sakte hain" and "Real quote aur
 * photo baad me add kar sakte hain") are instructions to the site owner, not
 * page copy, so they are not rendered.
 * ——————————————————————————————————————————————————————————————— */

/* §1 Banner Section */
const HERO = {
  h1: `About **Newton Global School** - **Best School in Kotputli**`,
  sub: `A Trusted Name in Education at Sangteda, Kotputli, Rajasthan`,
};

/* §2 Our Story Section */
const STORY = {
  h2: `Our Story`,
  body: [
    `Newton Global School stands proudly in Sangteda, on **Babera Road**, near **NH8 Kotputli**, in the Kotputli-Behror district of Rajasthan. What began as a vision to provide quality education to the children of this region has grown into one of the recognized **schools in Kotputli**, known for its dedication to academic excellence and student well-being.`,
    `Managed by a registered Society, Newton Global School was built with a clear purpose to give every child in Sangteda and the surrounding areas access to a **Senior Secondary School in Kotputli** that combines strong academics with genuine care. From our very first day, our focus has remained the same: helping children learn, grow, and become confident individuals ready to take on the world.`,
  ],
};

/* §3 Vision & Mission Section */
const VISION_MISSION = {
  h2: `Our Vision & Mission`,
  visionLabel: `Vision:`,
  vision: `To be known as the **best school in Kotputli**, where every child receives an education that builds not just knowledge, but character, confidence, and curiosity.`,
  missionLabel: `Mission:`,
  mission: [
    `To offer quality education that follows the state curriculum with dedication and clarity`,
    `To provide a safe, disciplined, and supportive environment for every student`,
    `To nurture creativity, critical thinking, and confidence from Nursery through **Senior Secondary**`,
    `To build strong values alongside strong academics, preparing students for both exams and life`,
  ],
};

/* §4 About the School (Institutional Details) Section */
const INSTITUTION = {
  h2: `About Our Institution`,
  body: [
    `Newton Global School is a **private school managed by a registered Society**, offering education up to the **Senior Secondary** level. Located in Sangteda, Kotputli (Kotputli-Behror district), the school serves families across Sangteda, Kotputli, and nearby rural areas, making it a convenient choice for parents looking for the **best school near Sangteda**.`,
    `We are committed to academic excellence within the state education framework, with our curriculum and teaching designed to help students perform well in board examinations while also developing life skills.`,
  ],
};

/* §5 Message from the Principal/Management Section */
const MESSAGE = {
  h2: `A Message from Our Management`,
  quote: `"At Newton Global School, we believe education is not just about textbooks, it's about shaping young minds to think, question, and grow. Our goal is to make Newton Global School a place every parent in Sangteda and Kotputli can trust, and every child can call home. We are committed to building an institution where learning is joyful, discipline is valued, and every student's potential is recognized."`,
};

/* §6 Our Core Values Section */
const CORE_VALUES_H2 = `Our Core Values`;
const CORE_VALUES: Array<{ icon: IconName; text: string }> = [
  {
    icon: "shield",
    text: `**Discipline** - Building responsibility and respect from an early age`,
  },
  {
    icon: "chart",
    text: `**Excellence** - Encouraging students to give their best in academics and beyond`,
  },
  {
    icon: "faculty",
    text: `**Care** - Creating a warm, supportive environment for every child`,
  },
  {
    icon: "target",
    text: `**Integrity** - Teaching honesty and strong moral values`,
  },
  {
    icon: "leaf",
    text: `**Growth** - Helping every student discover and reach their true potential`,
  },
];

/* §7 Why Choose Us Section */
const WHY_H2 = `What Makes Us the **Best School in Sangteda**`;
const WHY = [
  `Convenient location on **Babera Road**, easily accessible via **NH8 Kotputli**`,
  `Dedicated and caring teaching staff`,
  `Well-planned infrastructure supporting complete student development`,
  `Focus on both academic performance and overall personality development`,
  `A safe, disciplined, and nurturing campus environment`,
  `Complete schooling from nursery to **Senior Secondary** under one roof`,
];

/* §8 Our Campus & Facilities Overview Section */
const CAMPUS = {
  h2: `Our Campus`,
  body: `Spread across a well-designed campus in Sangteda, Newton Global School offers modern classrooms, a well-stocked library, computer and science laboratories, sports facilities, and a safe transport system connecting Kotputli and surrounding areas. Our campus is built to support both academic learning and the overall growth of every student.`,
  /* The document specifies this section's link as: (Link: "View All Facilities →") */
  link: `View All Facilities →`,
};

/* §9 Management & Governance Section */
const MANAGEMENT = {
  h2: `Our Management`,
  body: `Newton Global School is administered by a registered Society, which oversees the school's academic direction, infrastructure development, and long-term vision. This structure ensures that decisions are made with the best interests of students and the community at heart.`,
};

/* §10 Call-To-Action Section */
const CTA = {
  h2: `Be Part of the Newton Global School Family`,
  body: `Looking for the right school for your child in Sangteda or Kotputli? We welcome you to visit our campus, meet our teachers, and see firsthand what makes Newton Global School a place families trust.`,
  cta: `Book a Campus Visit / Apply for Admission`,
};

/**
 * CC0 sample photography — public domain, no attribution required.
 * Source list in public/images/school/CREDITS.md. Chosen to match the image
 * placement guide in the document's third tab (banner exterior, story +
 * reception, campus wide shot, facilities collage, governance office).
 */
const IMG = {
  heroBanner: {
    src: "/images/school/school-bus.webp",
    w: 1600,
    h: 1200,
    alt: "A Newton Global School bus outside the main building",
  },
  storyGate: {
    src: "/images/school/reception.webp",
    w: 1600,
    h: 1200,
    alt: "The school reception desk and waiting area",
  },
  storyCorridor: {
    src: "/images/school/founders-wall.webp",
    w: 1140,
    h: 1600,
    alt: "The reception shrine and the founders' photographs",
  },
  institution: {
    src: "/images/school/campus-grounds.webp",
    w: 1600,
    h: 900,
    alt: "The school building across its green grounds",
  },
  managementOffice: {
    src: "/images/school/reception.webp",
    w: 1600,
    h: 1200,
    alt: "The school reception desk and waiting area",
  },
  whyLibrary: {
    src: "/images/school/library-students.webp",
    w: 1200,
    h: 1600,
    alt: "Pupils reading at the tables in the school library",
  },
  whyComputerLab: {
    src: "/images/school/computer-lab-students.webp",
    w: 1600,
    h: 1200,
    alt: "Pupils working at computers in the school lab",
  },
  whyActivityRoom: {
    src: "/images/school/kindergarten-room.webp",
    w: 1600,
    h: 1200,
    alt: "The pre-primary activity room with its play equipment",
  },
  campusPlayground: {
    src: "/images/school/playground.webp",
    w: 1600,
    h: 1200,
    alt: "The school playground with its swings and climbing frame",
  },
  campusSports: {
    src: "/images/school/sports-store.webp",
    w: 1600,
    h: 1200,
    alt: "The sports room where games equipment is kept",
  },
  campusScience: {
    src: "/images/school/science-lab-students.webp",
    w: 1600,
    h: 1200,
    alt: "Pupils at the benches in the science laboratory",
  },
  campusTransport: {
    src: "/images/school/students-boarding-bus.webp",
    w: 1600,
    h: 1200,
    alt: "Pupils lining up to board the school bus",
  },
  visionCorridor: {
    src: "/images/school/corridor.webp",
    w: 1200,
    h: 1600,
    alt: "A corridor lined with classrooms inside the school",
  },
  governance: {
    src: "/images/school/reception.webp",
    w: 1600,
    h: 1200,
    alt: "The school reception desk and waiting area",
  },
  ctaCampus: {
    src: "/images/school/campus-side-buses.webp",
    w: 1600,
    h: 1200,
    alt: "Newton Global School buses parked beside the campus building",
  },
} as const satisfies Record<string, Img>;


/** §7 — the small facilities collage the image guide calls for. */
const WHY_COLLAGE: Img[] = [
  IMG.whyLibrary,
  IMG.whyComputerLab,
  IMG.whyActivityRoom,
];

/** §8 — the four-up campus grid. */
const CAMPUS_GRID: Img[] = [
  IMG.campusPlayground,
  IMG.campusSports,
  IMG.campusScience,
  IMG.campusTransport,
];

export default function AboutPage() {
  return (
    <>
      {/* ——— §1 Banner Section — campus exterior under a navy wash ——— */}
      <PageHero
        image={IMG.heroBanner}
        priority
        crumbs={[{ label: "About Us" }]}
        h1={HERO.h1}
        sub={HERO.sub}
      />

      {/* ——— §2 Our Story — gateway photo with a corridor inset ——— */}
      <section className={`relative overflow-hidden bg-bg ${SECTION}`}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-pill bg-[#faf4e8] opacity-70 blur-2xl"
        />
        <div
          className={`relative ${CONTAINER} grid items-center gap-12 md:grid-cols-2 lg:gap-14 xl:gap-16`}
        >
          <Reveal>
            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-3 -top-3 hidden h-full w-full rounded-[1.75rem] border-2 border-[#a8802f]/45 sm:block"
              />
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] shadow-frame">
                <Cover
                  img={IMG.storyGate}
                  sizes="(max-width: 768px) 92vw, (max-width: 1200px) 46vw, 540px"
                />
              </div>
              <div className="absolute -bottom-8 -right-2 hidden aspect-[3/4] w-36 overflow-hidden rounded-[1.25rem] border-4 border-bg shadow-frame sm:block lg:w-44">
                <Cover img={IMG.storyCorridor} sizes="(max-width: 1024px) 144px, 176px" />
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <SectionTitle eyebrow="Our Story" title={STORY.h2} />
            {STORY.body.map((paragraph, index) => (
              <p
                key={paragraph.slice(0, 32)}
                className={`text-[0.9375rem] leading-[1.85] text-text-muted md:text-base ${
                  index === 0 ? "mt-5" : "mt-4"
                }`}
              >
                {rich(paragraph)}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ——— §3 Vision & Mission — text-led navy band (no heavy image) ——— */}
      <section className="relative flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center overflow-hidden bg-[#001344] pb-16 pt-20 sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28">
        <Wave className="z-20 text-bg" />
        <PhotoBackdrop img={IMG.visionCorridor} fixed />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-pill bg-[radial-gradient(circle,rgba(214,165,63,0.18),transparent_70%)]"
        />
        <div className={`relative ${CONTAINER}`}>
          <Reveal>
            <SectionTitle
              eyebrow="Vision & Mission"
              title={VISION_MISSION.h2}
              align="center"
              tone="dark"
            />
          </Reveal>
          <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-5">
              <div className="h-full rounded-[1.25rem] border border-[#d6a53f]/30 bg-white/[0.07] p-5 backdrop-blur-sm sm:p-7 lg:p-8">
                <h3 className="font-heading text-[0.9375rem] font-bold leading-snug text-[#d6a53f]">
                  {VISION_MISSION.visionLabel}
                </h3>
                <p className="mt-4 text-[0.9375rem] leading-[1.85] text-[#c2cfe4] md:text-base">
                  {rich(VISION_MISSION.vision, STRONG.dark)}
                </p>
              </div>
            </Reveal>
            <Reveal delay={120} className="lg:col-span-7">
              <div className="h-full rounded-[1.25rem] border border-white/12 bg-white/[0.05] p-5 backdrop-blur-sm sm:p-7 lg:p-8">
                <h3 className="font-heading text-[0.9375rem] font-bold leading-snug text-[#d6a53f]">
                  {VISION_MISSION.missionLabel}
                </h3>
                <ul className="mt-4 space-y-3.5">
                  {VISION_MISSION.mission.map((point) => (
                    <li key={point.slice(0, 24)} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-pill bg-[#d6a53f] text-[#001344]"
                      >
                        <Icon name="check" className="h-3 w-3" />
                      </span>
                      <span className="text-[0.9375rem] leading-[1.75] text-[#c2cfe4]">
                        {rich(point, STRONG.dark)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
          <Reveal className="mt-10 text-center">
            <Link
              href="/vision-mission"
              className="inline-flex items-center gap-2 rounded-pill border-2 border-[#d6a53f] px-6 py-3 text-[0.9375rem] font-bold text-[#d6a53f] transition duration-200 hover:bg-[#d6a53f] hover:text-[#001344]"
            >
              Read our Vision &amp; Mission in full
              <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ——— §4 About Our Institution — campus wide shot ——— */}
      <section className={SECTION}>
        <div
          className={`${CONTAINER} grid items-center gap-12 md:grid-cols-2 lg:gap-14 xl:gap-16`}
        >
          <Reveal>
            <SectionTitle eyebrow="Our Institution" title={INSTITUTION.h2} />
            {INSTITUTION.body.map((paragraph, index) => (
              <p
                key={paragraph.slice(0, 32)}
                className={`text-[0.9375rem] leading-[1.85] text-text-muted md:text-base ${
                  index === 0 ? "mt-5" : "mt-4"
                }`}
              >
                {rich(paragraph)}
              </p>
            ))}
          </Reveal>
          <Reveal delay={120}>
            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute -bottom-3 -right-3 hidden h-full w-full rounded-[1.75rem] border-2 border-[#a8802f]/45 sm:block"
              />
              <div className="relative overflow-hidden rounded-[1.75rem] shadow-frame">
                <Photo
                  img={IMG.institution}
                  sizes="(max-width: 768px) 92vw, (max-width: 1200px) 46vw, 540px"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— §5 A Message from Our Management ——— */}
      <section className={`border-y border-[#a8802f]/20 bg-[#faf4e8] ${SECTION}`}>
        <div
          className={`${CONTAINER} grid items-center gap-10 lg:grid-cols-12 lg:gap-14`}
        >
          <Reveal className="lg:col-span-5">
            <div className="overflow-hidden rounded-[1.5rem] shadow-frame">
              <Photo
                img={IMG.managementOffice}
                sizes="(max-width: 1024px) 92vw, 440px"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <SectionTitle eyebrow="Management" title={MESSAGE.h2} />
            <figure className="mt-7 rounded-[1.25rem] border border-[#a8802f]/25 bg-surface p-5 shadow-card sm:p-6 lg:p-8">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[#faf4e8] text-[#87661f]"
              >
                <Icon name="quote" className="h-5 w-5" />
              </span>
              <blockquote className="mt-5 text-[0.9375rem] leading-[1.9] text-text md:text-base">
                {MESSAGE.quote}
              </blockquote>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ——— §6 Our Core Values — icon tiles, no photography ——— */}
      <section className={SECTION}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle
              eyebrow="Core Values"
              title={CORE_VALUES_H2}
              align="center"
            />
          </Reveal>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-6 lg:gap-6">
            {CORE_VALUES.map((value, index) => {
              const tint = TINTS[index % TINTS.length];
              return (
                <li
                  key={value.icon}
                  className={`lg:col-span-2 ${index === 3 ? "lg:col-start-2" : ""}`}
                >
                  <Reveal delay={(index % 3) * 90} className="h-full">
                    <article
                      className={`flex h-full flex-col p-5 sm:p-6 lg:p-7 ${CARD} ${tint.edge} ${tint.bar}`}
                    >
                      <span
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.125rem] ${tint.well}`}
                      >
                        <Icon name={value.icon} className="h-6 w-6" />
                      </span>
                      <RunInText
                        text={value.text}
                        titleClass="mt-5 text-[1.0625rem] leading-[1.35] text-ink"
                        bodyClass="mt-2 break-words text-[0.9375rem] leading-[1.8] text-text-muted"
                      />
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ——— §7 What Makes Us the Best School in Sangteda ——— */}
      <section className={`relative overflow-hidden border-y border-hairline bg-bg-alt ${SECTION}`}>
        <DoodleWash className="text-[#000c2e] opacity-[0.045]" />
        <div
          className={`${CONTAINER} grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14`}
        >
          <Reveal className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="col-span-2 overflow-hidden rounded-[1.25rem] shadow-frame">
                <Photo
                  img={WHY_COLLAGE[0]}
                  sizes="(max-width: 1024px) 92vw, 460px"
                  className="h-auto w-full"
                />
              </div>
              {WHY_COLLAGE.slice(1).map((img) => (
                <div
                  key={img.src}
                  className="overflow-hidden rounded-[1.25rem] shadow-card"
                >
                  <Photo
                    img={img}
                    sizes="(max-width: 1024px) 45vw, 225px"
                    className="h-auto w-full"
                  />
                </div>
              ))}
            </div>
          </Reveal>
          <div className="lg:col-span-7">
            <Reveal>
              <SectionTitle eyebrow="Why Choose Us" title={WHY_H2} />
            </Reveal>
            <ul className="mt-8 divide-y divide-hairline border-y border-hairline">
              {WHY.map((point, index) => (
                <li key={point.slice(0, 24)}>
                  <Reveal delay={index * 60}>
                    <div className="flex items-start gap-4 py-4">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-pill bg-[#faf4e8] text-[#87661f]"
                      >
                        <Icon name="check" className="h-3.5 w-3.5" />
                      </span>
                      <p className="text-[0.9375rem] leading-[1.8] text-text-muted">
                        {rich(point)}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ——— §8 Our Campus — facility grid + the document's own link ——— */}
      <section className={SECTION}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle eyebrow="Our Campus" title={CAMPUS.h2} align="center" />
            <p className="mx-auto mt-4 max-w-3xl text-center text-[0.9375rem] leading-[1.85] text-text-muted md:text-base">
              {CAMPUS.body}
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {CAMPUS_GRID.map((img, index) => (
              <Reveal key={img.src} delay={index * 80}>
                <div
                  className={`relative aspect-[4/3] overflow-hidden rounded-[1.25rem] shadow-card sm:aspect-[16/11] ${
                    index % 2 ? "lg:translate-y-4" : ""
                  }`}
                >
                  <Cover
                    img={img}
                    sizes="(max-width: 1024px) 46vw, 275px"
                    className="transition-transform duration-500 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
                  />
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center lg:mt-16">
            <Link
              href="/#facilities"
              className="inline-flex w-full items-center justify-center gap-2 rounded-pill border-2 border-[#a8802f] px-6 py-3 text-[0.9375rem] font-bold text-[#87661f] transition duration-200 hover:bg-[#faf4e8] sm:w-auto"
            >
              {CAMPUS.link}
            </Link>
          </div>
        </div>
      </section>

      {/* ——— §9 Our Management — governance office ——— */}
      <section className={`border-y border-hairline bg-bg-alt ${SECTION}`}>
        <div
          className={`${CONTAINER} grid items-center gap-12 md:grid-cols-2 lg:gap-14 xl:gap-16`}
        >
          <Reveal>
            <div className="overflow-hidden rounded-[1.75rem] shadow-frame">
              <Photo
                img={IMG.governance}
                sizes="(max-width: 768px) 92vw, (max-width: 1200px) 46vw, 540px"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <SectionTitle eyebrow="Governance" title={MANAGEMENT.h2} />
            <p className="mt-5 text-[0.9375rem] leading-[1.85] text-text-muted md:text-base">
              {MANAGEMENT.body}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— §10 Call-To-Action — the enquiry form itself, not a button ——— */}
      <EnquiryBand
        image={IMG.ctaCampus}
        h2={CTA.h2}
        body={CTA.body}
        waveClass="text-bg-alt"
        formTitle={CTA.cta}
      />
    </>
  );
}
