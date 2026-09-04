import Link from "next/link";
import { requireUser } from "@/lib/dal";
import { tryQuery } from "@/lib/db";
import { EmptyState, PageHeader, StatusBadge } from "@/components/admin/ui";
import { getBranchBySlug } from "@/data/branches";
import SubmissionActions from "./SubmissionActions";

export const metadata = { title: "Submissions" };

/* Registrations arrive constantly; never serve a cached list. */
export const dynamic = "force-dynamic";

const FILTERS = ["all", "new", "contacted", "closed"] as const;
type Filter = (typeof FILTERS)[number];

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

interface RegistrationRow {
  id: number;
  student_name: string;
  date_of_birth: string | null;
  gender: string | null;
  class_applied: string;
  father_name: string;
  mother_name: string;
  phone: string;
  email: string;
  address: string;
  previous_school: string;
  branch_slug: string;
  message: string | null;
  status: string;
  created_at: string;
}

interface CountRow {
  status: string;
  n: number;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const iso = value.includes("T") ? value : value.replace(" ", "T");
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function SubmissionsPage({ searchParams }: PageProps) {
  await requireUser();
  const { status } = await searchParams;
  const activeFilter: Filter = FILTERS.includes(status as never)
    ? (status as Filter)
    : "all";

  const where = activeFilter === "all" ? "1 = 1" : "status = ?";
  const params = activeFilter === "all" ? [] : [activeFilter];

  const [rows, counts] = await Promise.all([
    tryQuery<RegistrationRow>(
      `SELECT id, student_name, date_of_birth, gender, class_applied,
              father_name, mother_name, phone, email, address, previous_school,
              branch_slug, message, status, created_at
       FROM registrations WHERE ${where}
       ORDER BY created_at DESC
       LIMIT 200`,
      params
    ),
    tryQuery<CountRow>(
      "SELECT status, COUNT(*) n FROM registrations GROUP BY status"
    ),
  ]);

  const countOf: Record<Filter, number> = { all: 0, new: 0, contacted: 0, closed: 0 };
  for (const c of counts) {
    if (c.status in countOf) countOf[c.status as Filter] = c.n;
    countOf.all += c.n;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Submissions"
        description="Registration forms submitted from the public Apply Now form."
      />

      <div className="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-white p-1">
        {FILTERS.map((f) => {
          const active = activeFilter === f;
          return (
            <Link
              key={f}
              href={f === "all" ? "/admin/submissions" : `/admin/submissions?status=${f}`}
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
        <EmptyState>No registrations match this filter.</EmptyState>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li
              key={r.id}
              className="rounded-lg border border-border bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.06)] sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-text">{r.student_name}</p>
                  <p className="text-xs text-text-muted">
                    {r.class_applied}
                    {r.gender ? ` · ${r.gender}` : ""}
                    {r.date_of_birth ? ` · born ${formatDate(r.date_of_birth)}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge tone={r.status}>{r.status}</StatusBadge>
                  <SubmissionActions id={r.id} status={r.status} />
                </div>
              </div>

              <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-text-muted">Father:</dt>
                  <dd className="font-medium text-text">{r.father_name || "—"}</dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-text-muted">Mother:</dt>
                  <dd className="font-medium text-text">{r.mother_name || "—"}</dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-text-muted">Phone:</dt>
                  <dd>
                    <a href={`tel:${r.phone}`} className="font-medium text-primary hover:underline">
                      {r.phone}
                    </a>
                  </dd>
                </div>
                {r.email ? (
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-text-muted">Email:</dt>
                    <dd className="min-w-0">
                      <a
                        href={`mailto:${r.email}`}
                        className="break-all font-medium text-primary hover:underline"
                      >
                        {r.email}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {r.previous_school ? (
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-text-muted">Previous school:</dt>
                    <dd className="text-text">{r.previous_school}</dd>
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-text-muted">Campus:</dt>
                  <dd className="text-text">
                    {r.branch_slug === "all"
                      ? "No preference"
                      : getBranchBySlug(r.branch_slug)?.name ?? r.branch_slug}
                  </dd>
                </div>
                {r.address ? (
                  <div className="flex flex-wrap gap-x-2 sm:col-span-2 lg:col-span-3">
                    <dt className="text-text-muted">Address:</dt>
                    <dd className="text-text">{r.address}</dd>
                  </div>
                ) : null}
              </dl>

              {r.message ? (
                <p className="mt-3 border-t border-hairline pt-3 text-sm italic text-text-muted">
                  &ldquo;{r.message}&rdquo;
                </p>
              ) : null}

              <p className="mt-3 text-xs text-text-muted">
                Received {formatDate(r.created_at)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
