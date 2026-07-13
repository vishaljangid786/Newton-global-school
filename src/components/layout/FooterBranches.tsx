"use client";

import Link from "next/link";
import { useBranches } from "@/components/hooks/useBranches";

/** Footer branch list — client so published custom branches appear too. */
export default function FooterBranches() {
  const campuses = useBranches();
  return (
    <>
      {campuses.map((branch) => (
        <li key={branch.slug}>
          <Link
            href={`/branches/${branch.slug}`}
            className="text-sm text-white/75 transition-colors hover:text-white hover:underline"
          >
            {branch.name}
            <span className="block text-xs text-white/50">{branch.area}</span>
          </Link>
        </li>
      ))}
    </>
  );
}
