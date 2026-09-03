import type { Metadata } from "next";
import StagePage, { type StageChrome } from "@/components/site/StagePage";
import { seniorSecondary } from "@/data/pages/senior-secondary";

export const metadata: Metadata = {
  title: "Senior Secondary School",
  description: "Guiding Students Toward the Right Stream and a Strong Future - Sangteda, Kotputli",
};

/** Photography and iconography for this stage; copy comes from the document. */
const chrome: StageChrome = {
  crumb: "Senior Secondary",
  eyebrows: {
    overview: "Class 11 & 12",
    curriculum: "Curriculum",
    whyStage: "Why It Matters",
    streams: "Streams",
    facilities: "Facilities",
    teaching: "Our Approach",
  },
  images: {
    hero: {
      src: "/images/home/program-senior.webp",
      w: 760,
      h: 570,
      alt: "Senior students working on laptops in a lecture hall",
    },
    overview: {
      src: "/images/home/achieve-graduate.webp",
      w: 760,
      h: 570,
      alt: "Smiling graduate in a cap and gown",
    },
    whyStage: {
      src: "/images/home/achievements-bg.webp",
      w: 960,
      h: 540,
      alt: "School children gathered for a classroom performance",
    },
    streams: {
      src: "/images/home/smart-class-session.webp",
      w: 1448,
      h: 1086,
      alt: "Children watching a lesson on the smart-class screen",
    },
    teaching: {
      src: "/images/home/about-governance.webp",
      w: 900,
      h: 562,
      alt: "Meeting room with a long table beside tall windows",
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
        src: "/images/home/facility-bus.webp",
        w: 760,
        h: 570,
        alt: "Aisle and seats inside a school bus",
      },
    ],
  },
  curriculumIcons: ["book", "chart", "flask", "target", "calendar"],
  facilityIcons: ["flask", "library", "monitor", "chart", "target", "bus"],
};

export default function SeniorSecondaryPage() {
  return <StagePage copy={seniorSecondary} chrome={chrome} />;
}
