"use client";

import Link from "next/link";
import { useBranches } from "@/components/hooks/useBranches";

/** Keep the footer column tidy no matter how many campuses exist. */
const MAX_FOOTER_BRANCHES = 4;

/**
 * Footer branch list — client so published custom branches appear too.
 * Shows at most MAX_FOOTER_BRANCHES campuses; the trailing link carries the
 * full count so a long network never stretches the footer.
 */
export default function FooterBranches() {
  const campuses = useBranches();
  const shown = campuses.slice(0, MAX_FOOTER_BRANCHES);
  const overflowing = campuses.length > shown.length;

  return (
    <>
      {shown.map((branch) => (
        <li key={branch.slug}>
          <Link
            href={`/branches/${branch.slug}`}
            className="text-sm font-medium text-white transition-colors hover:text-[#8fa6f2]"
          >
            {branch.name}
            <span className="block text-xs font-normal text-[#9ca6b8]">
              {branch.area}
            </span>
          </Link>
        </li>
      ))}
      <li>
        <Link
          href="/branches"
          className="text-sm font-medium text-[#8fa6f2] transition-colors hover:text-white"
        >
          {overflowing
            ? `View all ${campuses.length} campuses`
            : "View all campuses"}
          <span aria-hidden="true"> →</span>
        </Link>
      </li>
    </>
  );
}
