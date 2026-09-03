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
      src: "/images/home/gallery-swing.webp",
      w: 900,
      h: 600,
      alt: "Children playing together on a classroom mat",
    },
    overview: {
      src: "/images/home/preprimary-outdoor-play.webp",
      w: 1448,
      h: 1086,
      alt: "Young pupils sitting together on the school's turf play area",
    },
    whyStage: {
      src: "/images/home/assembly-activity.webp",
      w: 1448,
      h: 1086,
      alt: "Pupils in two rows taking part in a school hall activity",
    },
    teaching: {
      src: "/images/home/gallery-drawing.webp",
      w: 900,
      h: 600,
      alt: "Children planting seedlings in the school garden",
    },
    facilities: [
      {
        src: "/images/home/gallery-drawing.webp",
        w: 900,
        h: 600,
        alt: "Children planting seedlings in the school garden",
      },
      {
        src: "/images/home/assembly-activity.webp",
        w: 1448,
        h: 1086,
        alt: "Pupils in two rows taking part in a school hall activity",
      },
      {
        src: "/images/home/facility-bus.webp",
        w: 760,
        h: 570,
        alt: "Aisle and seats inside a school bus",
      },
      {
        src: "/images/home/facility-green.webp",
        w: 760,
        h: 570,
        alt: "Children tending plants in the school garden",
      },
    ],
  },
  curriculumIcons: ["book", "chart", "music", "faculty", "leaf"],
  facilityIcons: ["classroom", "music", "shield", "droplet", "yoga", "bus"],
};

export default function NurseryPage() {
  return <StagePage copy={nursery} chrome={chrome} />;
}
