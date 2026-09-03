import type { Metadata } from "next";
import StagePage, { type StageChrome } from "@/components/site/StagePage";
import { nursery } from "@/data/pages/nursery";

export const metadata: Metadata = {
  title: "Nursery Admission",
  description: "Where Little Steps Begin - A Warm Start to Learning in Sangteda, Kotputli",
};

/** Photography and iconography for this stage; copy comes from the document. */
const chrome: StageChrome = {
  crumb: "Nursery",
  eyebrows: {
    overview: "Our Nursery",
    curriculum: "Curriculum",
    whyStage: "Early Years",
    facilities: "Facilities",
    teaching: "Our Approach",
  },
  images: {
    hero: {
      src: "/images/school/kindergarten-room.webp",

      w: 1600,

      h: 1200,

      alt: "The pre-primary activity room with its play equipment",
    },
    overview: {
      src: "/images/school/activity-room.webp",

      w: 1200,

      h: 1600,

      alt: "The pre-primary room set up for play-based learning",
    },
    whyStage: {
      src: "/images/school/assembly-hall.webp",
      w: 1600,
      h: 900,
      alt: "Pupils gathered in the school assembly hall",
    },
    teaching: {
      src: "/images/school/kindergarten-room.webp",

      w: 1600,

      h: 1200,

      alt: "The pre-primary activity room with its play equipment",
    },
    facilities: [
      {
        src: "/images/school/activity-room.webp",
        w: 1200,
        h: 1600,
        alt: "The pre-primary room set up for play-based learning",
      },
      {
        src: "/images/school/kindergarten-room.webp",
        w: 1600,
        h: 1200,
        alt: "The pre-primary activity room with its play equipment",
      },
      {
        src: "/images/school/playground.webp",
        w: 1600,
        h: 1200,
        alt: "The school playground with its swings and climbing frame",
      },
      {
        src: "/images/school/students-boarding-bus.webp",
        w: 1600,
        h: 1200,
        alt: "Pupils lining up to board the school bus",
      },
    ],
  },
  curriculumIcons: ["book", "chart", "music", "faculty", "leaf"],
  facilityIcons: ["classroom", "music", "shield", "droplet", "yoga", "bus"],
};

export default function NurseryPage() {
  return <StagePage copy={nursery} chrome={chrome} />;
}
