"use client";

import { usePathname, useRouter } from "next/navigation";
import { useBranches } from "@/components/hooks/useBranches";
import type { Branch } from "@/data/types";

const LAST_BRANCH_KEY = "sis:lastBranch";

/**
 * Branch context bar (design.md §3.1): shown under the header on every
 * /branches/<slug>/... page. Switching branches navigates to the equivalent
 * page under the selected branch and remembers the choice (F1).
 */
export default function BranchContextBar({ branch }: { branch: Branch }) {
  const pathname = usePathname();
  const router = useRouter();
  const campuses = useBranches();

  const handleSwitch = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextSlug = event.target.value;
    if (nextSlug === branch.slug) return;
    try {
      window.localStorage.setItem(LAST_BRANCH_KEY, nextSlug);
    } catch {
      // localStorage unavailable — navigation still works.
    }
    // Swap the slug segment, keeping the rest of the path (e.g. /academics).
    const match = pathname.match(/^\/branches\/[^/]+(\/.*)?$/);
    const subPath = match?.[1] ?? "";
    router.push(`/branches/${nextSlug}${subPath}`);
  };

  return (
    <div className="border-b border-primary/10 bg-bg-alt">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2">
        <p className="text-sm text-text-muted">
          You are viewing:{" "}
          <span className="font-semibold text-primary">{branch.name}</span>
        </p>
        <div className="flex items-center gap-2">
          <label
            htmlFor="branch-switcher"
            className="text-sm font-medium text-text"
          >
            Switch branch
          </label>
          <select
            id="branch-switcher"
            value={branch.slug}
            onChange={handleSwitch}
            className="rounded-btn border border-border bg-surface px-3 py-1.5 text-base text-text sm:text-sm"
          >
            {(campuses.some((c) => c.slug === branch.slug)
              ? campuses
              : [{ slug: branch.slug, name: branch.name, area: branch.area }, ...campuses]
            ).map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
