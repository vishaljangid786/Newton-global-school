import Link from "next/link";
import SocialIcon from "@/components/ui/SocialIcon";
import FooterBranches from "@/components/layout/FooterBranches";
import { site } from "@/data/site";

const SCHOOL_LINKS = [
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Vision & Mission", href: "/vision-mission" },
  { label: "Facilities", href: "/facilities" },
  { label: "Gallery", href: "/gallery" },
  { label: "News & Events", href: "/news" },
  { label: "Careers", href: "/careers" },
];

const ADMISSION_LINKS = [
  { label: "Registration Form", href: "/registration-form" },
  { label: "Admission Process", href: "/admission-process" },
  { label: "Fee Structure", href: "/fee-structure" },
  { label: "Eligibility Criteria", href: "/eligibility-criteria" },
  { label: "Contact", href: "/contact" },
];

/** Legal links sit in the bottom strip, not in a content column. */
const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

const columnHeading =
  "mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-white";
const footerLink =
  "text-sm text-[#9ca6b8] transition-colors hover:text-[#8fa6f2]";

/** Site footer — five balanced columns on deep navy, legal links in the strip. */
export default function Footer() {
  return (
    <footer className="bg-footer text-[#9ca6b8]">
      <div className="mx-auto max-w-content grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
        {/* 1 — About + socials */}
        <div>
          <span className="inline-flex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/newton-logo.png"
              alt={`${site.name} logo`}
              className="h-16 w-auto bg-white p-2 rounded"
            />
          </span>
          {/* "Three campuses across Jaipur" was the template's, printed under
              the crest on every page of a Kotputli school's site. */}
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            {site.tagline} — a safe, joyful RBSE school where every child is
            known by name, not by roll number.
          </p>
          {/* Rendered only when there is something in it: an empty <ul> still
              took its mt-4, leaving a gap under the copy with nothing in it. */}
          <ul
            className={`flex items-center gap-3 ${
              site.socialLinks.length > 0 ? "mt-4" : ""
            }`}
          >
            {site.socialLinks.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-btn bg-white/10 text-white/85 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <SocialIcon name={social.name} className="h-4.5 w-4.5" />
                  <span className="sr-only">
                    {site.name} on {social.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 2 — School */}
        <nav aria-label="Footer school links">
          <h2 className={columnHeading}>School</h2>
          <ul className="flex flex-col gap-2.5">
            {SCHOOL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={footerLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 3 — Admissions */}
        <nav aria-label="Footer admission links">
          <h2 className={columnHeading}>Admissions</h2>
          <ul className="flex flex-col gap-2.5">
            {ADMISSION_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={footerLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 4 — Branches */}
        <nav aria-label="Footer branches">
          <h2 className={columnHeading}>Our Branches</h2>
          <ul className="flex flex-col gap-2.5">
            <FooterBranches />
          </ul>
        </nav>

        {/* 5 — Head office contact */}
        <div>
          <h2 className={columnHeading}>Head Office</h2>
          <address className="flex flex-col gap-2.5 text-sm not-italic">
            <span>{site.headOffice.address}</span>
            <a href={`tel:${site.headOffice.phone}`} className={footerLink}>
              {site.headOffice.phone}
            </a>
            <a href={`mailto:${site.headOffice.email}`} className={footerLink}>
              {site.headOffice.email}
            </a>
            <span className="text-xs text-[#6b7488]">
              {site.headOffice.officeHours}
            </span>
          </address>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-center gap-x-5 gap-y-2 py-4 text-xs text-[#6b7488] sm:justify-between px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
