import type { Metadata } from "next";
import Link from "next/link";
import {
  CARD,
  CONTAINER,
  Cover,
  Wave,
  GoldLink,
  Icon,
  type IconName,
  type Img,
  PageHero,
  rich,
  SECTION,
  SectionTitle,
  STAGE_COLOURS,
  STRONG,
} from "@/components/site/school-kit";
import Reveal from "@/components/ui/Reveal";
import { hubs } from "@/data/pages/hubs";
import { nursery } from "@/data/pages/nursery";
import { primary } from "@/data/pages/primary";
import { secondary } from "@/data/pages/secondary";
import { seniorSecondary } from "@/data/pages/senior-secondary";
import type { StageCopy } from "@/data/pages/types";

export const metadata: Metadata = {
  title: "Academics",
  description: hubs.academicsBody.replace(/\*\*/g, ""),
};

/*
 * Hub for the four class-stage pages. Every string here is document copy: the
 * masthead is the Home tab's Academic Programs section, and each card shows
 * that stage page's own H1 and sub-heading. Nothing is written for this page.
 */

const IMG = {
  hero: {
    src: "/images/home/program-primary.webp",
    w: 760,
    h: 570,
    alt: "Smiling pupil in uniform waving from his desk",
  },
} as const satisfies Record<string, Img>;

interface StageCard {
  copy: StageCopy;
  href: string;
  label: string;
  icon: IconName;
  img: Img;
}

const STAGES: StageCard[] = [
  {
    copy: nursery,
    href: "/academics/nursery",
    label: "Nursery",
    icon: "music",
    img: {
      src: "/images/home/preprimary-outdoor-play.webp",
      w: 1448,
      h: 1086,
      alt: "Young pupils sitting together on the school's turf play area",
    },
  },
  {
    copy: primary,
    href: "/academics/primary",
    label: "Primary",
    icon: "book",
    img: {
      src: "/images/home/program-primary.webp",
      w: 760,
      h: 570,
      alt: "Smiling pupil in uniform waving from his desk",
    },
  },
  {
    copy: secondary,
    href: "/academics/secondary",
    label: "Secondary",
    icon: "flask",
    img: {
      src: "/images/home/secondary-student-portrait.webp",
      w: 1448,
      h: 1086,
      alt: "Newton Global School pupil in uniform standing in the assembly line",
    },
  },
  {
    copy: seniorSecondary,
    href: "/academics/senior-secondary",
    label: "Senior Secondary",
    icon: "chart",
    img: {
      src: "/images/home/program-senior.webp",
      w: 760,
      h: 570,
      alt: "Senior students working on laptops in a lecture hall",
    },
  },
];

export default function AcademicsPage() {
  return (
    <>
      <PageHero
        image={IMG.hero}
        priority
        crumbs={[{ label: "Academics" }]}
        h1={hubs.academicsH1}
      body={hubs.academicsBody}
      />

      {/* ——— One card per stage, each opening its own page ——— */}
      <section className={SECTION}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle
              eyebrow="Academic Programs"
              title={hubs.academicsH1}
              align="center"
            />
          </Reveal>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-6">
            {STAGES.map((stage, index) => {
              const colour = STAGE_COLOURS[stage.copy.slug];
              return (
                <li key={stage.href}>
                  <Reveal delay={index * 90} className="h-full">
                    <Link
                      href={stage.href}
                      className={`group flex h-full flex-col overflow-hidden ${CARD} ${colour.edge}`}
                    >
                      <div className="relative aspect-[16/10] w-full">
                        <div className="absolute inset-0 overflow-hidden">
                          <Cover
                            img={stage.img}
                            sizes="(max-width: 480px) 92vw, (max-width: 1024px) 46vw, 280px"
                            className="transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                          />
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-3 px-5 py-3.5 text-white ${colour.band}`}
                      >
                        <span
                          aria-hidden="true"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-white/20"
                        >
                          <Icon name={stage.icon} className="h-[1.15rem] w-[1.15rem]" />
                        </span>
                        <span className="font-heading text-[0.9375rem] font-bold leading-tight">
                          {stage.label}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col justify-center px-5 pb-6 pt-5 sm:px-6">
                        <h2 className={`font-heading text-[1.0625rem] font-semibold leading-snug text-ink transition-colors ${colour.hoverInk}`}>
                          {rich(stage.copy.hero.h1, STRONG.body)}
                        </h2>
                        <p className="mt-2.5 flex-1 text-[0.875rem] leading-[1.75] text-text-muted">
                          {rich(stage.copy.hero.sub)}
                        </p>
                        <span
                          aria-hidden="true"
                          className={`mt-4 text-sm font-bold ${colour.ink}`}
                        >
                          Read more →
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ——— Admission band, using the Home tab's admission copy ——— */}
      <section className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden bg-[#001344] pb-16 pt-20 text-center text-white sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28">
        <Wave className="z-20 text-bg" />
        <Cover
          img={{
            src: "/images/home/campus-family-visit.webp",
            w: 1448,
            h: 1086,
            alt: "Parents with four Newton Global School pupils in uniform outside the campus",
          }}
          sizes="100vw"
          className="opacity-[0.28]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(0,19,68,0.95),rgba(0,12,46,0.86))]"
        />
        <Reveal className={`relative ${CONTAINER}`}>
          <span
            aria-hidden="true"
            className="mx-auto block h-[3px] w-14 rounded-pill bg-[#d6a53f]"
          />
          <h2 className="mx-auto mt-6 max-w-3xl text-[1.5rem] leading-[1.2] text-white sm:text-[1.8rem] md:text-[2.1rem]">
            {rich(hubs.admissionsH1, STRONG.headingDark)}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[0.9375rem] leading-[1.8] text-[#c2cfe4] md:text-base">
            {rich(hubs.admissionsBody, STRONG.dark)}
          </p>
          <GoldLink href="/admissions" className="mt-8 w-full sm:w-auto">
            {hubs.admissionsCta}
          </GoldLink>
        </Reveal>
      </section>
    </>
  );
}
