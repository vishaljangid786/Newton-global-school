import type { BranchSlug, SchoolEvent } from "./types";

/** Events listing data (F4): a mix of upcoming and past events. */
export const events: SchoolEvent[] = [
  // ——— Upcoming (after 2026-07-13) ———
  {
    id: "ev-football-tournament",
    title: "Inter-House Football Tournament",
    date: "2026-07-25",
    branch: "city-center",
    description:
      "Four houses battle it out across junior and senior categories on the main field. Finals kick off at 3:00 PM; families are welcome to cheer from the stands.",
    category: "Sports",
  },
  {
    id: "ev-science-exhibition",
    title: "Young Innovators Science Exhibition",
    date: "2026-08-05",
    branch: "green-valley",
    description:
      "Students of Grades 5-10 present working models on water conservation, renewable energy and everyday physics. Open to parents and neighbouring schools from 10 AM to 2 PM.",
    category: "Academic",
  },
  {
    id: "ev-independence-day",
    title: "Independence Day Assembly & Cultural Programme",
    date: "2026-08-14",
    branch: "all",
    description:
      "Flag hoisting, patriotic choir performances and a street-play on unity at every campus. The programme concludes with sweets distribution by the student council.",
    category: "Cultural",
  },
  {
    id: "ev-digital-wellbeing",
    title: "Parent Workshop: Raising Kids in a Digital World",
    date: "2026-08-22",
    branch: "riverside",
    description:
      "A hands-on session with child psychologist Dr. Nidhi Bansal on screen-time boundaries, online safety and healthy device habits for ages 4-14. Limited to 80 seats.",
    category: "Workshop",
  },
  {
    id: "ev-teachers-day",
    title: "Teachers' Day Cultural Programme",
    date: "2026-09-05",
    branch: "all",
    description:
      "Students take over the stage — and a few classrooms — to celebrate their teachers with skits, songs and the annual staff quiz.",
    category: "Cultural",
  },
  // ——— Past ———
  {
    id: "ev-tree-plantation",
    title: "Van Mahotsav Tree Plantation Drive",
    date: "2026-07-04",
    branch: "riverside",
    description:
      "Students, parents and staff planted 150 native saplings along the campus boundary as part of the national Van Mahotsav week.",
    category: "Community",
  },
  {
    id: "ev-yoga-day",
    title: "International Yoga Day Session",
    date: "2026-06-21",
    branch: "all",
    description:
      "A sunrise yoga session on the sports grounds led by our physical education faculty, joined by over 400 students and parents across campuses.",
    category: "Sports",
  },
  {
    id: "ev-summer-camp-showcase",
    title: "Summer Camp Showcase",
    date: "2026-05-09",
    branch: "green-valley",
    description:
      "Campers presented two weeks of work — a junior theatre production, robotics demos and a pottery exhibition — to a full house of families.",
    category: "Community",
  },
  {
    id: "ev-annual-day",
    title: "Annual Day 2025-26: Colours of India",
    date: "2026-04-18",
    branch: "city-center",
    description:
      "Our flagship evening featured 300 performers tracing India's festivals through dance and music, with the annual prize distribution for academic and co-curricular excellence.",
    category: "Cultural",
  },
];

function matchesBranch(event: SchoolEvent, branch?: BranchSlug): boolean {
  return !branch || event.branch === branch || event.branch === "all";
}

/** Midnight (local) of the given date, without mutating the input. */
function startOfDay(reference: Date): number {
  const day = new Date(reference);
  day.setHours(0, 0, 0, 0);
  return day.getTime();
}

/**
 * Events on or after "today", soonest first. Pass a branch slug to include
 * only that branch's events plus group-wide ("all") events.
 */
export function getUpcomingEvents(
  branch?: BranchSlug,
  reference: Date = new Date()
): SchoolEvent[] {
  const todayStart = startOfDay(reference);
  return events
    .filter(
      (event) =>
        matchesBranch(event, branch) &&
        new Date(event.date).getTime() >= todayStart
    )
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Events before "today", most recent first. Pass a branch slug to include
 * only that branch's events plus group-wide ("all") events.
 */
export function getPastEvents(
  branch?: BranchSlug,
  reference: Date = new Date()
): SchoolEvent[] {
  const todayStart = startOfDay(reference);
  return events
    .filter(
      (event) =>
        matchesBranch(event, branch) &&
        new Date(event.date).getTime() < todayStart
    )
    .sort((a, b) => b.date.localeCompare(a.date));
}
