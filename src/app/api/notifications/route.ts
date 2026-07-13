import { NextResponse } from "next/server";
import { tryQuery } from "@/lib/db";

/**
 * Public feed of active notifications for the frontend banner. Returns
 * group-wide ("all") notifications plus, when a valid `branch` is given, that
 * branch's notifications. Never throws — an offline DB yields an empty list.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const branch = searchParams.get("branch");

  const params: string[] = [];
  let where = "active = 1 AND (branch_ref = 'all'";
  if (branch && /^[a-z0-9-]+$/.test(branch)) {
    where += " OR branch_ref = ?";
    params.push(branch);
  }
  where += ")";

  const notifications = await tryQuery(
    `SELECT id, title, body, branch_ref, level
     FROM notifications
     WHERE ${where}
     ORDER BY created_at DESC
     LIMIT 5`,
    params
  );

  return NextResponse.json(
    { notifications },
    { headers: { "Cache-Control": "no-store" } }
  );
}
