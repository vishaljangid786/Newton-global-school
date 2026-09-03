import Link from "next/link";
import SocialIcon from "@/components/ui/SocialIcon";
import { site } from "@/data/site";

/**
 * Utility strip above the header — the device every school site in the region
 * leads with: where the school is, which board it follows, and whether
 * admissions are open, all reachable before the visitor scrolls.
 *
 * Deliberately no phone or email yet: the values in src/data/site.ts are still
 * the template's Jaipur placeholders, and a wrong number in the top bar of
 * every page is worse than none. Drop them in here once they are real.
 */
export default function TopBar() {
  return (
    <div className="bg-[#000c2e] text-[#c2cfe4]">
      <div className="mx-auto max-w-content flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5 py-2 text-[0.75rem] px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
        <p className="flex items-center gap-1.5">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            className="h-3.5 w-3.5 shrink-0 text-[#d6a53f]"
          >
            <path
              fill="currentColor"
              d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
            />
          </svg>
          Sangteda, Babera Road, Kotputli
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="rounded-pill bg-[#d6a53f] px-2.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-[#001344]">
            RBSE Affiliated
          </span>
          <Link
            href="/admissions"
            className="hidden font-semibold text-white transition-colors hover:text-[#d6a53f] sm:inline"
          >
            Admission Open {site.admissionYear}
            <span aria-hidden="true"> →</span>
          </Link>
          <ul className="hidden items-center gap-2 md:flex">
            {site.socialLinks.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-6 w-6 items-center justify-center rounded-pill bg-white/10 text-white/80 transition-colors hover:bg-[#d6a53f] hover:text-[#001344]"
                >
                  <SocialIcon name={social.name} className="h-3 w-3" />
                  <span className="sr-only">
                    {site.name} on {social.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
