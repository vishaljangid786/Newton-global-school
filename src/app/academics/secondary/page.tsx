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
      src: "/images/school/science-lab-students.webp",
      w: 1600,
      h: 1200,
      alt: "Pupils at the benches in the science laboratory",
    },
    overview: {
      src: "/images/school/science-experiment.webp",
      w: 1200,
      h: 1600,
      alt: "Pupils carrying out an experiment in the science lab",
    },
    whyStage: {
      src: "/images/school/library-reading-group.webp",
      w: 1200,
      h: 1600,
      alt: "A group of pupils reading together in the library",
    },
    teaching: {
      src: "/images/school/classroom-teaching.webp",
      w: 1600,
      h: 1200,
      alt: "A teacher leading a lesson in a full classroom",
    },
    facilities: [
      {
        src: "/images/school/science-lab-students.webp",
        w: 1600,
        h: 1200,
        alt: "Pupils at the benches in the science laboratory",
      },
      {
        src: "/images/school/library-reading-group.webp",
        w: 1200,
        h: 1600,
        alt: "A group of pupils reading together in the library",
      },
      {
        src: "/images/school/computer-lab-students.webp",
        w: 1600,
        h: 1200,
        alt: "Pupils working at computers in the school lab",
      },
      {
        src: "/images/school/sports-store.webp",
        w: 1600,
        h: 1200,
        alt: "The sports room where games equipment is kept",
      },
    ],
  },
  curriculumIcons: ["book", "chart", "flask", "monitor", "faculty"],
  facilityIcons: ["flask", "library", "monitor", "chart", "trophy", "bus"],
};

export default function SecondaryPage() {
  return <StagePage copy={secondary} chrome={chrome} />;
}
