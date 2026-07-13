import { NextResponse } from "next/server";
import { getAllBranches } from "@/lib/branches-store";

/**
 * Public list of published branches (built-in + custom) for client components
 * — the header dropdown, footer, campus switcher and enquiry form. Never
 * throws; falls back to just the built-ins when the DB is offline.
 */
export async function GET() {
  const branches = (await getAllBranches()).map((b) => ({
    slug: b.slug,
    name: b.name,
    area: b.area,
  }));

  return NextResponse.json(
    { branches },
    { headers: { "Cache-Control": "no-store" } }
  );
}
