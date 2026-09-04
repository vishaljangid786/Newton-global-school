import type { Img } from "@/components/site/school-kit";

/**
 * Results & Achievements.
 *
 * The document's "6. Achievements/Results Section" is the only place it says
 * anything about results, and it prints its figures as `XX%` / `XX+`
 * placeholders — the school had not supplied real numbers. Those placeholders
 * are kept verbatim rather than replaced with invented ones: a school's board
 * results are a matter of public record and must not be guessed at. Swap the
 * `value` fields below for the real figures before launch; everything else on
 * the page is already the document's own wording.
 */

/** The document's own heading and body for the achievements section. */
export const achievements = {
  h2: `Our Achievements - Proud Moments of the **Best School in Kotputli**`,
  body: `Every year, our students make us proud with their performance in **RBSE** board exams and various co-curricular activities. From academic toppers to sports champions, Newton Global School continues to nurture talent in every field and strengthen its position as a **top school in Kotputli**.`,
  statsLabel: `Stat Highlights:`,
  cta: `See Our Results →`,
};

export interface ResultStat {
  /** Replace with the real figure. */
  value: string;
  label: string;
}

/** "Stat Highlights" — three lines, exactly as the document lists them. */
export const resultStats: readonly ResultStat[] = [
  { value: `XX%`, label: `Pass Result in Last **RBSE** Board Exams` },
  { value: `XX+`, label: `Students Scoring Distinction` },
  { value: `XX+`, label: `Years of Educational Excellence in Kotputli` },
];

export interface BoardResult {
  exam: string;
  detail: string;
  rows: ReadonlyArray<{ label: string; value: string }>;
}

/**
 * Board results, one block per examination. The rows carry the same `XX`
 * placeholders until the school fills in its figures.
 */
export const boardResults: readonly BoardResult[] = [
  {
    exam: `RBSE Class 12 (Senior Secondary)`,
    detail: `Science, Commerce and Arts streams at our **Senior Secondary School in Kotputli**.`,
    rows: [
      { label: `Students appeared`, value: `XX` },
      { label: `Pass percentage`, value: `XX%` },
      { label: `Scored above 75%`, value: `XX` },
      { label: `School topper`, value: `XX%` },
    ],
  },
  {
    exam: `RBSE Class 10 (Secondary)`,
    detail: `The board year that decides stream selection for Class 11.`,
    rows: [
      { label: `Students appeared`, value: `XX` },
      { label: `Pass percentage`, value: `XX%` },
      { label: `Scored above 75%`, value: `XX` },
      { label: `School topper`, value: `XX%` },
    ],
  },
];

export interface AchievementArea {
  icon: "trophy" | "target" | "music" | "yoga";
  title: string;
  body: string;
}

/**
 * The fields the document names in its achievements copy — "academic toppers
 * to sports champions … talent in every field". Nothing here claims a specific
 * prize; each entry describes an area the school competes in.
 */
export const achievementAreas: readonly AchievementArea[] = [
  {
    icon: "trophy",
    title: `Academic Toppers`,
    body: `Students who top their stream in the **RBSE** board examinations are felicitated at the annual function.`,
  },
  {
    icon: "target",
    title: `Sports Champions`,
    body: `Our sports ground hosts the annual meet, and teams represent the school at inter-school competitions.`,
  },
  {
    icon: "music",
    title: `Music & Art`,
    body: `The Music & Art Room gives students a dedicated space to prepare for cultural competitions.`,
  },
  {
    icon: "yoga",
    title: `Co-curricular Activities`,
    body: `Yoga, physical training and assembly programmes run through the year alongside the academic calendar.`,
  },
];

/** Photographs of our own students, used on the home strip and this page. */
export const resultImages = [
  {
    src: "/images/school/gallery/assembly-hall-04.webp",
    w: 1400,
    h: 1050,
    alt: "Students gathered in the assembly hall",
  },
  {
    src: "/images/school/gallery/pupil-portrait-assembly.webp",
    w: 1400,
    h: 1050,
    alt: "A pupil of Newton Global School at assembly",
  },
  {
    src: "/images/school/gallery/classroom-05.webp",
    w: 1400,
    h: 1050,
    alt: "A class in progress at Newton Global School",
  },
  {
    src: "/images/school/gallery/pupils-on-turf.webp",
    w: 1400,
    h: 1050,
    alt: "Pupils on the school ground",
  },
] as const satisfies readonly Img[];
