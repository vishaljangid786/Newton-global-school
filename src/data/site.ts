import type { SiteInfo } from "./types";

export const site: SiteInfo = {
  name: "Newton Global School",
  tagline: "Shaping Bright Futures Since 1908",
  established: 1998,
  headOffice: {
    /*
     * Address assembled from the school's own document (Sangteda, Babera Road,
     * near NH8, Kotputli-Behror district, Rajasthan).
     *
     * TODO: phone and email below are still the original template's Jaipur
     * placeholders — the document gives no contact number. Replace them with
     * the school's real details; they surface on /contact, in the footer, and
     * the top bar is ready to show them once they are correct.
     */
    address: "Sangteda, Babera Road, Kotputli-Behror, Rajasthan",
    phone: "+91-141-4102000",
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
