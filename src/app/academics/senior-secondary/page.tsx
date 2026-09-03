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
      src: "/images/school/computer-lab-students.webp",
      w: 1600,
      h: 1200,
      alt: "Pupils working at computers in the school lab",
    },
    overview: {
      src: "/images/school/science-microscope.webp",
      w: 1200,
      h: 1600,
      alt: "A pupil examining a slide under the microscope",
    },
    whyStage: {
      src: "/images/school/assembly-hall.webp",
      w: 1600,
      h: 900,
      alt: "Pupils gathered in the school assembly hall",
    },
    streams: {
      src: "/images/school/computer-lab.webp",

      w: 1600,

      h: 1404,

      alt: "The computer laboratory with rows of workstations",
    },
    teaching: {
      src: "/images/school/teacher-blackboard.webp",

      w: 1200,

      h: 1600,

      alt: "A teacher writing the day's lesson on the blackboard",
    },
    facilities: [
      {
        src: "/images/school/computer-lab-students.webp",
        w: 1600,
        h: 1200,
        alt: "Pupils working at computers in the school lab",
      },
      {
        src: "/images/school/science-microscope.webp",
        w: 1200,
        h: 1600,
        alt: "A pupil examining a slide under the microscope",
      },
      {
        src: "/images/school/library-students.webp",
        w: 1200,
        h: 1600,
        alt: "Pupils reading at the tables in the school library",
      },
      {
        src: "/images/school/assembly-hall.webp",
        w: 1600,
        h: 900,
        alt: "Pupils gathered in the school assembly hall",
      },
    ],
  },
  curriculumIcons: ["book", "chart", "flask", "target", "calendar"],
  facilityIcons: ["flask", "library", "monitor", "chart", "target", "bus"],
};

export default function SeniorSecondaryPage() {
  return <StagePage copy={seniorSecondary} chrome={chrome} />;
}
