import type { SiteInfo } from "./types";

export const site: SiteInfo = {
  name: "Newton Global School",
  /*
   * Said "Since 1908" while `established` on the next line says 1998 — the
   * 1908 came from the original template and printed in the footer of every
   * page, ninety years wrong. The year is dropped rather than corrected: the
   * affiliation form is the authority for a founding date and it is not quoted
   * here, so the line now says what the school does instead of making a claim
   * about when it started.
   */
  tagline: "Nurturing young minds in Sangteda, Kotputli",
  established: 1998,
  headOffice: {
    /*
     * Address and phone taken from the school's RBSE affiliation form, which
     * is the authoritative record: Sangteda / NH-8 / Babera Road, Kotputli,
     * district Kotputli-Behror, PIN 303108, phone 9216072030.
     *
     * The PIN matters. Searching Google Maps for "Newton Global School"
     * returns a different school of the same name at Udaipuria Mod, Chomu,
     * Jaipur 303804 — that is the pin the map used to drop, and it is not
     * this school. See LOCATION.mapQuery on the home page.
     *
     * TODO (needs the school): the affiliation form leaves SCHOOL EMAIL
     * blank and none has been supplied since, so `email` below is still the
     * original template's `@sunrise-school.example` placeholder. It is printed
     * as-is on /contact, /careers, /privacy, /terms and in the footer — put
     * the real address here and all five follow.
     */
    address: "Sangteda, Babera Road, NH-8, Kotputli, Kotputli-Behror, Rajasthan 303108",
    phone: "+91 92160 72030",
    email: "info@sunrise-school.example",
    officeHours: "Monday to Saturday, 8:00 AM to 4:00 PM",
  },
  /*
   * TODO (needs the school): these were the template's `@sunriseintlschool`
   * handles — a DIFFERENT school's accounts, linked from the header and footer
   * of every page. Emptied rather than guessed at; sending a parent to another
   * school's Instagram is worse than showing no icons at all. Footer and TopBar
   * both hide the row while this is empty, so adding the real profiles here is
   * all that is needed to bring it back.
   */
  socialLinks: [],
  admissionYear: "2026-27",
};
