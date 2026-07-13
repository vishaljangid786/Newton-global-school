import { getBranchBySlug } from "@/data/branches";
import type { BranchRef } from "@/data/types";

/**
 * Small formatting helpers shared by the UI kit. Server-safe (no browser APIs).
 * Dates in src/data are date-only ISO strings, which parse as UTC midnight —
 * all formatting pins timeZone to UTC so output is deterministic.
 */

/** "2026-07-13" → "13 July 2026". */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Pieces for the day/month date chip (design.md §3.3 notice row). */
export function dateChipParts(isoDate: string): {
  day: string;
  month: string;
  year: string;
} {
  const date = new Date(isoDate);
  return {
    day: String(date.getUTCDate()).padStart(2, "0"),
    month: date.toLocaleDateString("en-IN", { month: "short", timeZone: "UTC" }),
    year: String(date.getUTCFullYear()),
  };
}

/**
 * Human label for a branch reference: branch name, "All Campuses" for "all"
 * (notices/events/news), or "Any Campus" for "any" (career positions).
 */
export function branchLabel(ref: BranchRef | "any"): string {
  if (ref === "all") return "All Campuses";
  if (ref === "any") return "Any Campus";
  return getBranchBySlug(ref)?.name ?? ref;
}

/** Google Maps search link for an address (used instead of iframe embeds). */
export function googleMapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

const HONORIFICS = new Set(["mr", "mrs", "ms", "dr", "prof", "shri", "smt"]);

/** "Mrs. Kavita Sharma" → "KS" — used for portrait placeholder labels. */
export function initials(fullName: string): string {
  const words = fullName
    .split(/\s+/)
    .map((word) => word.replace(/\./g, ""))
    .filter((word) => word && !HONORIFICS.has(word.toLowerCase()));
  if (words.length === 0) return fullName.slice(0, 2).toUpperCase();
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}
