import type { Metadata } from "next";
import StagePage, { type StageChrome } from "@/components/site/StagePage";
import { primary } from "@/data/pages/primary";

export const metadata: Metadata = {
  title: "Primary School",
  description: "Building Strong Foundations, One Class at a Time Sangteda, Kotputli",
};

/** Photography and iconography for this stage; copy comes from the document. */
const chrome: StageChrome = {
  crumb: "Primary",
  eyebrows: {
    overview: "Our Primary",
    curriculum: "Curriculum",
    whyStage: "Foundation Years",
    facilities: "Facilities",
    teaching: "Our Approach",
  },
  images: {
    hero: {
      src: "/images/home/news-abc-chalkboard.webp",
      w: 760,
      h: 428,
      alt: "Letters chalked on a blackboard above a stack of books",
    },
    overview: {
      src: "/images/home/program-primary.webp",
      w: 760,
      h: 570,
      alt: "Smiling pupil in uniform waving from his desk",
    },
    whyStage: {
      src: "/images/home/gallery-running.webp",
      w: 900,
      h: 600,
      alt: "Pupils with backpacks walking down a school corridor",
    },
    teaching: {
      src: "/images/home/why-writing.webp",
      w: 760,
      h: 570,
      alt: "Pupil concentrating on her writing in class",
    },
    facilities: [
      {
        src: "/images/home/facility-library.webp",
        w: 760,
        h: 570,
        alt: "Classroom reading corner lined with books",
      },
      {
        src: "/images/home/smart-class-session.webp",
        w: 1448,
        h: 1086,
        alt: "Children watching a lesson on the smart-class screen",
      },
      {
        src: "/images/home/facility-sports.webp",
        w: 760,
        h: 570,
        alt: "Football resting on a grass sports field with goalposts",
      },
      {
        src: "/images/home/facility-bus.webp",
        w: 760,
        h: 570,
        alt: "Aisle and seats inside a school bus",
      },
    ],
  },
  curriculumIcons: ["book", "chart", "flask", "music", "shield"],
  facilityIcons: ["classroom", "library", "monitor", "trophy", "monitor", "bus"],
};

export default function PrimaryPage() {
  return <StagePage copy={primary} chrome={chrome} />;
}
