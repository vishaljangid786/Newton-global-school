import type { BranchSlug, Notice } from "./types";

/**
 * Notices for the notice board (F3). Dates are ISO strings; items dated within
 * 7 days of "today" get a "New" badge (see isNoticeNew).
 *
 * NEEDS THE SCHOOL: everything below the group-wide block is still the
 * original template's fiction — a three-campus Jaipur school group with a
 * swimming pool, a kitchen garden, Ruby/Sapphire/Emerald/Topaz houses and bus
 * routes around Ajmer Road. None of it describes Newton Global School, and it
 * is keyed to the `city-center` / `green-valley` / `riverside` branch fixtures
 * in src/data/branches.ts, which are the same fiction.
 *
 * The four group-wide notices are the ones that reach the home page, so those
 * have been corrected to the single Sangteda campus. The branch-scoped ones
 * are left alone rather than rewritten into a different invention: replace
 * them with the school's real notices (or manage them from the admin) along
 * with the branch fixtures they belong to.
 */
export const notices: Notice[] = [
  // ——— Group-wide ("all") ———
  {
    id: "all-admissions-open",
    title: "Admissions open for Academic Year 2026-27",
    excerpt:
      "Registration forms are available online and at the school office on Babera Road. Limited seats in Nursery and Class 1.",
    date: "2026-07-10",
    branch: "all",
  },
  {
    id: "all-independence-day",
    title: "Independence Day celebrations — parents invited",
    excerpt:
      "Flag hoisting at 8:00 AM on 15 August on the school ground, followed by a cultural programme. Entry passes will be sent via the school diary.",
    date: "2026-07-12",
    branch: "all",
  },
  {
    id: "all-school-reopens",
    title: "School reopens after summer break on Monday, 6 July",
    excerpt:
      "The school resumes regular timings from 6 July. Please check the updated bus schedules before the first day.",
    date: "2026-06-29",
    branch: "all",
  },
  {
    id: "all-transport-routes",
    title: "Revised transport routes effective 1 July",
    excerpt:
      "Routes across Kotputli and Sangteda have been re-sequenced to shorten travel time. Route charts are available on the school notice board.",
    date: "2026-06-24",
    branch: "all",
  },

  // ——— City Center Campus ———
  {
    id: "cc-board-orientation",
    title: "Board exam orientation for parents of Grades 10 & 12",
    excerpt:
      "An orientation on the 2026-27 board assessment pattern will be held in the auditorium on Saturday, 18 July, 9:30 AM.",
    date: "2026-07-11",
    branch: "city-center",
  },
  {
    id: "cc-quiz-trials",
    title: "Inter-house quiz trials — Round 1 schedule",
    excerpt:
      "Trials for Grades 6-9 will run during zero period from 14 to 17 July. House captains have the detailed roster.",
    date: "2026-07-03",
    branch: "city-center",
  },
  {
    id: "cc-library-renewal",
    title: "Library membership renewal for the new session",
    excerpt:
      "Students of Grades 4 and above should renew borrower cards by 26 June to keep weekend issue privileges.",
    date: "2026-06-19",
    branch: "city-center",
  },
  {
    id: "cc-electives",
    title: "New skill electives for Grades 9-12",
    excerpt:
      "Financial literacy, AI foundations and design thinking join the elective basket this year. Opt-in forms close 12 June.",
    date: "2026-06-05",
    branch: "city-center",
  },
  {
    id: "cc-summer-camp-photos",
    title: "Summer camp photographs now available",
    excerpt:
      "Photos from the May adventure and theatre camps can be viewed in the branch gallery section.",
    date: "2026-05-22",
    branch: "city-center",
  },

  // ——— Green Valley Campus ———
  {
    id: "gv-ptm-primary",
    title: "Parent-teacher meeting for Grades 1-5 on Saturday, 18 July",
    excerpt:
      "Slots of 15 minutes per family, 8:30 AM to 12:30 PM. Book your slot through the class teacher by 16 July.",
    date: "2026-07-08",
    branch: "green-valley",
  },
  {
    id: "gv-bus-route",
    title: "Bus route GV-4 timing change from 2 July",
    excerpt:
      "Due to metro construction on Ajmer Road, route GV-4 pickups shift 10 minutes earlier. Revised point-wise timings attached.",
    date: "2026-06-30",
    branch: "green-valley",
  },
  {
    id: "gv-health-checkup",
    title: "Annual health check-up schedule",
    excerpt:
      "The school medical team will conduct height, weight, vision and dental screening from 22 to 27 June, grade-wise.",
    date: "2026-06-15",
    branch: "green-valley",
  },
  {
    id: "gv-kitchen-garden",
    title: "Kitchen garden volunteers needed for the monsoon sowing",
    excerpt:
      "Parents with a green thumb are invited to join the Eco Club sowing weekend on 13-14 June. Register at the front office.",
    date: "2026-06-01",
    branch: "green-valley",
  },
  {
    id: "gv-uniform-store",
    title: "Uniform store extended hours this week",
    excerpt:
      "The campus uniform store will stay open until 6:00 PM from 25 to 30 May for new-session purchases.",
    date: "2026-05-20",
    branch: "green-valley",
  },

  // ——— Riverside Campus ———
  {
    id: "rs-pool-reopens",
    title: "Swimming pool reopens — carry swim kit on assigned days",
    excerpt:
      "Coached sessions resume 9 July. Grades 1-4 swim on Tuesdays and Thursdays; Grades 5-8 on Wednesdays and Fridays.",
    date: "2026-07-07",
    branch: "riverside",
  },
  {
    id: "rs-house-allocation",
    title: "House allocation lists for new students",
    excerpt:
      "New admissions have been allotted to Ruby, Sapphire, Emerald and Topaz houses. Lists are displayed outside the sports room.",
    date: "2026-07-01",
    branch: "riverside",
  },
  {
    id: "rs-monsoon-drill",
    title: "Monsoon safety drill on Friday, 19 June",
    excerpt:
      "A short evacuation and assembly drill will be held at 10:15 AM. Classes resume normally afterwards.",
    date: "2026-06-17",
    branch: "riverside",
  },
  {
    id: "rs-art-supplies",
    title: "Art & craft supplies list for Grades 1-4",
    excerpt:
      "The term-1 art kit list has been shared in the school diary. Kits are also available pre-packed at the campus store.",
    date: "2026-06-03",
    branch: "riverside",
  },
  {
    id: "rs-lost-found",
    title: "Lost and found counter — collect items by 5 June",
    excerpt:
      "Water bottles, sweaters and lunch boxes from the last term await collection at the front desk. Unclaimed items will be donated.",
    date: "2026-05-25",
    branch: "riverside",
  },
];

function byNewestFirst(a: Notice, b: Notice): number {
  return b.date.localeCompare(a.date);
}

/** All notices across the group, newest first. */
export function getAllNotices(): Notice[] {
  return [...notices].sort(byNewestFirst);
}

/**
 * Notices for one branch: branch-specific items merged with group-wide
 * ("all") items, newest first.
 */
export function getNoticesForBranch(slug: BranchSlug): Notice[] {
  return notices
    .filter((notice) => notice.branch === slug || notice.branch === "all")
    .sort(byNewestFirst);
}

/** True when the notice is less than 7 days old (drives the "New" badge, F3). */
export function isNoticeNew(
  notice: Notice,
  reference: Date = new Date()
): boolean {
  const ageMs = reference.getTime() - new Date(notice.date).getTime();
  return ageMs >= 0 && ageMs < 7 * 24 * 60 * 60 * 1000;
}
