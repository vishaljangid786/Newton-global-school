import type { Metadata } from "next";
import Link from "next/link";
import {
  CARD,
  CONTAINER,
  Cover,
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
import EnquiryBand from "@/components/site/EnquiryBand";
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
    src: "/images/school/classroom-students.webp",
    w: 1600,
    h: 1200,
    alt: "Pupils at their desks during a classroom lesson",
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
    href: "/nursery",
    label: "Nursery",
    icon: "music",
    img: {
      src: "/images/school/kindergarten-room.webp",

      w: 1600,

      h: 1200,

      alt: "The pre-primary activity room with its play equipment",
    },
  },
  {
    copy: primary,
    href: "/primary",
    label: "Primary",
    icon: "book",
    img: {
      src: "/images/school/pupils-smart-class.webp",

      w: 1448,

      h: 1086,

      alt: "Newton Global School pupils during a smart-class session",
    },
  },
  {
    copy: secondary,
    href: "/secondary",
    label: "Secondary",
    icon: "flask",
    img: {
      src: "/images/school/computer-lab.webp",

      w: 1600,

      h: 1404,

      alt: "The computer laboratory with rows of workstations",
    },
  },
  {
    copy: seniorSecondary,
    href: "/senior-secondary",
    label: "Senior Secondary",
    icon: "chart",
    img: {
      src: "/images/school/computer-lab.webp",

      w: 1600,

      h: 1404,

      alt: "The computer laboratory with rows of workstations",
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

      {/* ——— Admission band — the Home tab's copy, with the form in it ——— */}
      <EnquiryBand
        image={{
          src: "/images/school/parents-with-pupils.webp",
          w: 1448,
          h: 1086,
          alt: "Parents with four Newton Global School pupils in uniform",
        }}
        h2={hubs.admissionsH1}
        body={hubs.admissionsBody}
        formTitle={hubs.admissionsCta}
      />
    </>
  );
}
