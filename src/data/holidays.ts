/**
 * Public holidays and government leaves observed at the Sangteda campus.
 *
 * Two kinds of entry live here:
 *
 *  - Fixed dates (`on: "MM-DD"`). Republic Day, Independence Day, Gandhi
 *    Jayanti, Christmas, Rajasthan Day, Ambedkar Jayanti and Makar Sankranti
 *    fall on the same date every year, so they are safe to publish and are
 *    marked on the month grid automatically.
 *
 *  - Movable festivals (`on: null`). Holi, Diwali, Dussehra, Eid and the rest
 *    follow the lunar calendar and shift by weeks from year to year. Their
 *    dates are NOT guessed here: a family books travel around a school
 *    holiday list, and a wrong date is worse than an absent one. Fill each
 *    `on` in from the Rajasthan Government's gazetted calendar once it is
 *    published for the session, and the grid will start marking them too.
 */

export type HolidayScope = "National" | "Rajasthan" | "Festival" | "School";

export interface Holiday {
  /** "MM-DD" for a date that never moves; null while it must be confirmed. */
  on: string | null;
  name: string;
  scope: HolidayScope;
  note?: string;
}

export const holidays: readonly Holiday[] = [
  /* ——— Fixed dates ——— */
  { on: "01-14", name: "Makar Sankranti", scope: "Rajasthan" },
  { on: "01-26", name: "Republic Day", scope: "National" },
  { on: "03-30", name: "Rajasthan Day", scope: "Rajasthan" },
  { on: "04-14", name: "Dr. B. R. Ambedkar Jayanti", scope: "National" },
  { on: "08-15", name: "Independence Day", scope: "National" },
  { on: "10-02", name: "Gandhi Jayanti", scope: "National" },
  { on: "12-25", name: "Christmas Day", scope: "National" },

  /* ——— Dates confirmed each session ——— */
  { on: null, name: "Holi & Dhulandi", scope: "Festival", note: "March" },
  { on: null, name: "Gangaur", scope: "Rajasthan", note: "March / April" },
  { on: null, name: "Ram Navami", scope: "Festival", note: "March / April" },
  { on: null, name: "Mahavir Jayanti", scope: "Festival", note: "April" },
  { on: null, name: "Buddha Purnima", scope: "Festival", note: "May" },
  { on: null, name: "Maharana Pratap Jayanti", scope: "Rajasthan", note: "May / June" },
  { on: null, name: "Eid-ul-Fitr", scope: "Festival", note: "Subject to moon sighting" },
  { on: null, name: "Eid-ul-Zuha (Bakrid)", scope: "Festival", note: "Subject to moon sighting" },
  { on: null, name: "Muharram", scope: "Festival", note: "Subject to moon sighting" },
  { on: null, name: "Teej", scope: "Rajasthan", note: "July / August" },
  { on: null, name: "Raksha Bandhan", scope: "Festival", note: "August" },
  { on: null, name: "Janmashtami", scope: "Festival", note: "August / September" },
  { on: null, name: "Dussehra (Vijayadashami)", scope: "Festival", note: "September / October" },
  { on: null, name: "Diwali & Govardhan Puja", scope: "Festival", note: "October / November" },
  { on: null, name: "Guru Nanak Jayanti", scope: "Festival", note: "November" },

  /* ——— Set by the school ——— */
  { on: null, name: "Summer vacation", scope: "School", note: "Dates announced with the term calendar" },
  { on: null, name: "Winter break", scope: "School", note: "Dates announced with the term calendar" },
];

/** The fixed-date entries, keyed "MM-DD", for marking the month grid. */
export const fixedHolidaysByDate: Record<string, string> = Object.fromEntries(
  holidays
    .filter((holiday): holiday is Holiday & { on: string } => holiday.on !== null)
    .map((holiday) => [holiday.on, holiday.name])
);
