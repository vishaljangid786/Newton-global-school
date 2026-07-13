"use client";

import { useEffect, useState } from "react";
import { branches as staticBranches } from "@/data/branches";

/**
 * Client hook returning published branches (built-in + custom). Renders the
 * built-ins immediately (SSR-safe), then swaps in the full list from
 * /api/branches once loaded. Result is cached module-wide so multiple
 * components (header, footer, switcher, enquiry form) share one request.
 */

export interface BranchLite {
  slug: string;
  name: string;
  area: string;
}

const FALLBACK: BranchLite[] = staticBranches.map((b) => ({
  slug: b.slug,
  name: b.name,
  area: b.area,
}));

let cache: BranchLite[] | null = null;
let inflight: Promise<BranchLite[]> | null = null;

function load(): Promise<BranchLite[]> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = fetch("/api/branches")
      .then((r) => (r.ok ? r.json() : { branches: FALLBACK }))
      .then((d: { branches?: BranchLite[] }) => {
        cache = d.branches && d.branches.length ? d.branches : FALLBACK;
        return cache;
      })
      .catch(() => FALLBACK);
  }
  return inflight;
}

export function useBranches(): BranchLite[] {
  const [list, setList] = useState<BranchLite[]>(cache ?? FALLBACK);

  useEffect(() => {
    let active = true;
    load().then((b) => {
      if (active) setList(b);
    });
    return () => {
      active = false;
    };
  }, []);

  return list;
}
