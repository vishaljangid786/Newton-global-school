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
      src: "/images/school/classroom-students.webp",
      w: 1600,
      h: 1200,
      alt: "Pupils at their desks during a classroom lesson",
    },
    overview: {
      src: "/images/school/classroom-teaching.webp",
      w: 1600,
      h: 1200,
      alt: "A teacher leading a lesson in a full classroom",
    },
    whyStage: {
      src: "/images/school/library-students.webp",
      w: 1200,
      h: 1600,
      alt: "Pupils reading at the tables in the school library",
    },
    teaching: {
      src: "/images/school/teacher-blackboard.webp",

      w: 1200,

      h: 1600,

      alt: "A teacher writing the day's lesson on the blackboard",
    },
    facilities: [
      {
        src: "/images/school/classroom-students.webp",
        w: 1600,
        h: 1200,
        alt: "Pupils at their desks during a classroom lesson",
      },
      {
        src: "/images/school/library-students.webp",
        w: 1200,
        h: 1600,
        alt: "Pupils reading at the tables in the school library",
      },
      {
        src: "/images/school/playground.webp",
        w: 1600,
        h: 1200,
        alt: "The school playground with its swings and climbing frame",
      },
      {
        src: "/images/school/computer-lab-students.webp",
        w: 1600,
        h: 1200,
        alt: "Pupils working at computers in the school lab",
      },
    ],
  },
  curriculumIcons: ["book", "chart", "flask", "music", "shield"],
  facilityIcons: ["classroom", "library", "monitor", "trophy", "monitor", "bus"],
};

export default function PrimaryPage() {
  return <StagePage copy={primary} chrome={chrome} />;
}
