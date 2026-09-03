import type { Metadata } from "next";
import StagePage, { type StageChrome } from "@/components/site/StagePage";
import { secondary } from "@/data/pages/secondary";

export const metadata: Metadata = {
  title: "Secondary School",
  description: "Preparing Students for Board Exams and Beyond - Sangteda, Kotputli",
};

/** Photography and iconography for this stage; copy comes from the document. */
const chrome: StageChrome = {
  crumb: "Secondary",
  eyebrows: {
    overview: "Our Secondary",
    curriculum: "Curriculum",
    whyStage: "Turning Point",
    facilities: "Facilities",
    teaching: "Our Approach",
  },
  images: {
    hero: {
      src: "/images/home/secondary-student-portrait.webp",
      w: 1448,
      h: 1086,
      alt: "Newton Global School pupil in uniform standing in the assembly line",
    },
    overview: {
      src: "/images/home/smart-class-session.webp",
      w: 1448,
      h: 1086,
      alt: "Children watching a lesson on the smart-class screen",
    },
    whyStage: {
      src: "/images/home/facility-library.webp",
      w: 760,
      h: 570,
      alt: "Classroom reading corner lined with books",
    },
    teaching: {
      src: "/images/home/program-senior.webp",
      w: 760,
      h: 570,
      alt: "Senior students working on laptops in a lecture hall",
    },
    facilities: [
      {
        src: "/images/home/science-lab-experiment.webp",
        w: 1448,
        h: 1086,
        alt: "Pupils in uniform running a water experiment in the science lab",
      },
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
    ],
  },
  curriculumIcons: ["book", "chart", "flask", "monitor", "faculty"],
  facilityIcons: ["flask", "library", "monitor", "chart", "trophy", "bus"],
};

export default function SecondaryPage() {
  return <StagePage copy={secondary} chrome={chrome} />;
}
