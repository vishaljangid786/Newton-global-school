import Link from "next/link";
import SocialIcon from "@/components/ui/SocialIcon";
import FooterBranches from "@/components/layout/FooterBranches";
import { site } from "@/data/site";

const QUICK_LINKS = [
  { label: "About", href: "/about" },
  { label: "Admissions", href: "/admissions" },
  { label: "Careers", href: "/careers" },
  { label: "Gallery", href: "/gallery" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

const columnHeading =
  "mb-4 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-white/70";
const footerLink = "text-sm text-white/75 transition-colors hover:text-white hover:underline";

/** Site footer — design.md §3.2: 4 columns on primary-dark, light text. */
export default function Footer() {
  return (
    <footer className="border-t-2 border-accent bg-primary-dark text-white">
      <div className="mx-auto grid max-w-content gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1 — About + socials */}
        <div>
          <span className="inline-flex rounded-card bg-white p-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/newton-logo.png"
              alt={`${site.name} logo`}
              className="h-16 w-auto"
            />
          </span>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            {site.tagline}. Three campuses across Jaipur, one promise: a safe,
            joyful school where every child is known by name.
          </p>
          <ul className="mt-4 flex items-center gap-3">
            {site.socialLinks.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-pill bg-white/10 text-white/85 transition-colors hover:bg-white/20 hover:text-white"
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

        {/* 2 — Quick links */}
        <nav aria-label="Footer quick links">
          <h2 className={columnHeading}>Quick Links</h2>
          <ul className="flex flex-col gap-2.5">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={footerLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 3 — Branches */}
        <nav aria-label="Footer branches">
          <h2 className={columnHeading}>Our Branches</h2>
          <ul className="flex flex-col gap-2.5">
            <FooterBranches />
            <li>
              <Link href="/branches" className={`${footerLink} font-semibold`}>
                View all campuses →
              </Link>
            </li>
          </ul>
        </nav>

        {/* 4 — Head office contact */}
        <div>
          <h2 className={columnHeading}>Head Office</h2>
          <address className="flex flex-col gap-2.5 text-sm not-italic text-white/75">
            <span>{site.headOffice.address}</span>
            <a href={`tel:${site.headOffice.phone}`} className={footerLink}>
              {site.headOffice.phone}
            </a>
            <a href={`mailto:${site.headOffice.email}`} className={footerLink}>
              {site.headOffice.email}
            </a>
            <span className="text-xs text-white/50">
              {site.headOffice.officeHours}
            </span>
          </address>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-content px-4 py-4 text-center text-xs text-white/60">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
