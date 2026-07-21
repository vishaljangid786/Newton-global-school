import Link from "next/link";
import { requireUser } from "@/lib/dal";
import { tryQuery } from "@/lib/db";
import { branchScopeFilter } from "@/lib/rbac";
import { EmptyState, PageHeader, StatusBadge } from "@/components/admin/ui";
import { getBranchBySlug } from "@/data/branches";
import type { EnquiryRow } from "@/lib/admin-types";
import EnquiryActions from "./EnquiryActions";

export const metadata = { title: "Enquiries" };

const FILTERS = ["all", "new", "contacted", "closed"] as const;
type Filter = (typeof FILTERS)[number];

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

interface CountRow {
  status: string;
  n: number;
}

function formatDate(value: string): string {
  const iso = value.includes("T") ? value : value.replace(" ", "T");
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function EnquiriesPage({ searchParams }: PageProps) {
  const user = await requireUser();
  const { status } = await searchParams;
  const activeFilter: Filter = FILTERS.includes(status as never)
    ? (status as Filter)
    : "all";

  const scope = branchScopeFilter(user, "branch_slug");
  const params = [...scope.params];
  let where = scope.clause;
  if (activeFilter !== "all") {
    where += " AND status = ?";
    params.push(activeFilter);
  }

  const [rows, counts] = await Promise.all([
    tryQuery<EnquiryRow>(
      `SELECT id, student_name, parent_name, phone, email, branch_slug, grade,
              message, status, created_at
       FROM enquiries WHERE ${where}
       ORDER BY created_at DESC
       LIMIT 200`,
      params
    ),
    tryQuery<CountRow>(
      `SELECT status, COUNT(*) n FROM enquiries WHERE ${scope.clause}
       GROUP BY status`,
      scope.params
    ),
  ]);

  const countOf: Record<Filter, number> = {
    all: 0,
    new: 0,
    contacted: 0,
    closed: 0,
  };
  for (const c of counts) {
    if (c.status in countOf) countOf[c.status as Filter] = c.n;
    countOf.all += c.n;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enquiries"
        description={
          user.role === "super_admin"
            ? "Admission enquiries across all campuses."
            : `Admission enquiries for ${getBranchBySlug(user.branchSlug ?? "")?.name ?? "your campus"}.`
        }
      />

      {/* Segmented filter with counts */}
      <div className="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-white p-1">
        {FILTERS.map((f) => {
          const active = activeFilter === f;
          return (
            <Link
              key={f}
              href={f === "all" ? "/admin/enquiries" : `/admin/enquiries?status=${f}`}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                active
                  ? "bg-primary text-white"
                  : "text-text-muted hover:bg-bg-alt hover:text-text"
              }`}
            >
              {f}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[0.6875rem] font-semibold tabular-nums ${
                  active ? "bg-white/20 text-white" : "bg-bg-alt text-text-muted"
                }`}
              >
                {countOf[f]}
              </span>
            </Link>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <EmptyState>No enquiries match this filter.</EmptyState>
      ) : (
        <>
          {/* Mobile: stacked cards (the table needs ~820px, so hide it here) */}
          <ul className="space-y-3 md:hidden">
            {rows.map((e) => (
              <li
                key={e.id}
                className="rounded-lg border border-border bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.06)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-text">{e.student_name}</p>
                    <p className="text-xs text-text-muted">{e.parent_name}</p>
                  </div>
                  <StatusBadge tone={e.status}>{e.status}</StatusBadge>
                </div>
                {e.message ? (
                  <p className="mt-2 line-clamp-3 text-xs italic text-text-muted">
                    “{e.message}”
                  </p>
                ) : null}
                <dl className="mt-3 space-y-1 text-sm">
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-text-muted">Campus:</dt>
                    <dd className="font-medium text-text">
                      {getBranchBySlug(e.branch_slug)?.name ?? e.branch_slug}
                      <span className="font-normal text-text-muted">
                        {" "}
                        · {e.grade}
                      </span>
                    </dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-text-muted">Received:</dt>
                    <dd className="text-text">{formatDate(e.created_at)}</dd>
                  </div>
                </dl>
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-hairline pt-3">
                  <a
                    href={`tel:${e.phone}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {e.phone}
                  </a>
                  <a
                    href={`mailto:${e.email}`}
                    className="min-w-0 max-w-full truncate text-xs text-text-muted hover:underline"
                  >
                    {e.email}
                  </a>
                  <div className="ml-auto">
                    <EnquiryActions id={e.id} status={e.status} />
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop: full table */}
          <div className="hidden overflow-hidden rounded-lg border border-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.06)] md:block">
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-alt text-[0.6875rem] uppercase tracking-wider text-text-muted">
                  <th className="px-5 py-3 font-semibold">Applicant</th>
                  <th className="px-5 py-3 font-semibold">Contact</th>
                  <th className="px-5 py-3 font-semibold">Campus &amp; grade</th>
                  <th className="px-5 py-3 font-semibold whitespace-nowrap">Received</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {rows.map((e) => (
                  <tr
                    key={e.id}
                    className="align-top transition-colors hover:bg-bg-alt/50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-text">{e.student_name}</p>
                      <p className="text-xs text-text-muted">{e.parent_name}</p>
                      {e.message ? (
                        <p className="mt-1.5 line-clamp-2 max-w-xs text-xs italic text-text-muted">
                          “{e.message}”
                        </p>
                      ) : null}
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={`tel:${e.phone}`}
                        className="block font-medium text-primary hover:underline"
                      >
                        {e.phone}
                      </a>
                      <a
                        href={`mailto:${e.email}`}
                        className="block text-xs text-text-muted hover:underline"
                      >
                        {e.email}
                      </a>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-text">
                        {getBranchBySlug(e.branch_slug)?.name ?? e.branch_slug}
                      </p>
                      <p className="text-xs text-text-muted">{e.grade}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-text-muted">
                      {formatDate(e.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge tone={e.status}>{e.status}</StatusBadge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <EnquiryActions id={e.id} status={e.status} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </>
      )}
    </div>
  );
}
