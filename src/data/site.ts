import type { SiteInfo } from "./types";

export const site: SiteInfo = {
  name: "Newton Global School",
  tagline: "Shaping Bright Futures Since 1908",
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
     * TODO: the affiliation form leaves SCHOOL EMAIL blank, so the address
     * below is still the original template's placeholder. Replace it with the
     * school's real address; it surfaces on /contact and in the footer.
     */
    address: "Sangteda, Babera Road, NH-8, Kotputli, Kotputli-Behror, Rajasthan 303108",
    phone: "+91 92160 72030",
    email: "info@sunrise-school.example",
    officeHours: "Monday to Saturday, 8:00 AM to 4:00 PM",
  },
  socialLinks: [
    { name: "Facebook", href: "https://facebook.com/sunriseintlschool" },
    { name: "Instagram", href: "https://instagram.com/sunriseintlschool" },
    { name: "YouTube", href: "https://youtube.com/@sunriseintlschool" },
  ],
  admissionYear: "2026-27",
};
