import Link from "next/link";
import type { ReactNode } from "react";
import { requireUser } from "@/lib/dal";
import { isDbHealthy, tryQuery } from "@/lib/db";
import { branchScopeFilter, isSuperAdmin } from "@/lib/rbac";
import {
  AdminCard,
  EmptyState,
  PageHeader,
  StatCard,
  StatusBadge,
  adminCardShadow,
} from "@/components/admin/ui";
import { getBranchBySlug } from "@/data/branches";
import type { EnquiryRow, SessionUser } from "@/lib/admin-types";

interface CountRow {
  n: number;
}

async function count(sql: string, params: unknown[]): Promise<number> {
  const rows = await tryQuery<CountRow>(sql, params, [{ n: 0 }]);
  return rows[0]?.n ?? 0;
}

async function DbOfflineNotice() {
  return (
    <AdminCard className="border-accent/40 bg-accent/5">
      <h2 className="font-heading text-lg text-text">
        Database not connected
      </h2>
      <p className="mt-2 text-sm text-text-muted">
        The admin dashboard needs MySQL. Once your server is running, apply the
        schema and seed the first admin:
      </p>
      <pre className="mt-3 overflow-x-auto rounded-card border border-border bg-bg-alt p-3 text-xs text-text">
        {`mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS sunrise_school CHARACTER SET utf8mb4;"
mysql -u root -p sunrise_school < db/schema.sql
npm run db:seed`}
      </pre>
      <p className="mt-3 text-sm text-text-muted">
        Check the connection settings in <code>.env.local</code>, then reload.
      </p>
    </AdminCard>
  );
}

export default async function AdminOverviewPage() {
  const user = (await requireUser()) as SessionUser;
  const healthy = await isDbHealthy();

  if (!healthy) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={`Welcome, ${user.name}`}
          description="Admin dashboard"
        />
        <DbOfflineNotice />
      </div>
    );
  }

  const enq = branchScopeFilter(user, "branch_slug");
  const notif = branchScopeFilter(user, "branch_ref", true);
  const blog = branchScopeFilter(user, "branch_ref", true);
  const testi = branchScopeFilter(user, "branch_ref", true);

  const [
    totalEnq,
    newEnq,
    activeNotif,
    publishedBlogs,
    draftBlogs,
    liveTestimonials,
    recent,
  ] = await Promise.all([
    count(`SELECT COUNT(*) n FROM enquiries WHERE ${enq.clause}`, enq.params),
    count(
      `SELECT COUNT(*) n FROM enquiries WHERE status='new' AND ${enq.clause}`,
      enq.params
    ),
    count(
      `SELECT COUNT(*) n FROM notifications WHERE active=1 AND ${notif.clause}`,
      notif.params
    ),
    count(
      `SELECT COUNT(*) n FROM blog_posts WHERE status='published' AND ${blog.clause}`,
      blog.params
    ),
    count(
      `SELECT COUNT(*) n FROM blog_posts WHERE status='draft' AND ${blog.clause}`,
      blog.params
    ),
    count(
      `SELECT COUNT(*) n FROM testimonials WHERE status='published' AND ${testi.clause}`,
      testi.params
    ),
    tryQuery<EnquiryRow>(
      `SELECT id, student_name, parent_name, branch_slug, grade, status, created_at
       FROM enquiries WHERE ${enq.clause}
       ORDER BY created_at DESC LIMIT 5`,
      enq.params
    ),
  ]);

  const scopeLabel = isSuperAdmin(user)
    ? "All campuses"
    : (getBranchBySlug(user.branchSlug ?? "")?.name ?? user.branchSlug);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome, ${user.name}`}
        description={`Scope: ${scopeLabel}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="New enquiries"
          value={newEnq}
          hint={`${totalEnq} total`}
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <path d="M4 5h16v12H7l-3 3z" strokeLinejoin="round" />
              <path d="M8 9h8M8 13h5" strokeLinecap="round" />
            </svg>
          }
        />
        <StatCard
          label="Notifications"
          value={activeNotif}
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" strokeLinejoin="round" />
              <path d="M10 20a2 2 0 0 0 4 0" strokeLinecap="round" />
            </svg>
          }
        />
        <StatCard
          label="Blog posts"
          value={publishedBlogs}
          hint={`${draftBlogs} draft${draftBlogs === 1 ? "" : "s"}`}
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <path d="M4 4h11l5 5v11H4z" strokeLinejoin="round" />
              <path d="M14 4v5h5M8 13h8M8 17h6" strokeLinecap="round" />
            </svg>
          }
        />
        <StatCard
          label="Testimonials"
          value={liveTestimonials}
          hint="live on campus pages"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <path d="M4 5h16v11H9l-5 4z" strokeLinejoin="round" />
              <path d="M8.5 9.5h.01M12 9.5h.01M15.5 9.5h.01" strokeLinecap="round" />
            </svg>
          }
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-lg text-text">Recent enquiries</h2>
            <Link
              href="/admin/enquiries"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View all →
            </Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState>
              No enquiries yet. New admission enquiries submitted from the website
              will appear here.
            </EmptyState>
          ) : (
            <AdminCard className="p-0">
              <ul className="divide-y divide-hairline">
                {recent.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-bg-alt/40"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text">
                        {e.student_name}
                        <span className="text-text-muted">
                          {" "}
                          · {getBranchBySlug(e.branch_slug)?.name ?? e.branch_slug}
                        </span>
                      </p>
                      <p className="truncate text-xs text-text-muted">
                        {e.grade} ·{" "}
                        {new Date(e.created_at).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <StatusBadge tone={e.status}>{e.status}</StatusBadge>
                  </li>
                ))}
              </ul>
            </AdminCard>
          )}
        </section>

        <section>
          <h2 className="mb-3 font-heading text-lg text-text">Quick actions</h2>
          <div className="space-y-2.5">
            {quickActions
              .filter((a) => !a.superAdminOnly || user.role === "super_admin")
              .map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className={`group flex items-center gap-3 rounded-card border border-hairline bg-surface px-4 py-3 ${adminCardShadow} transition-colors hover:border-primary/40`}
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-primary-soft text-primary">
                    {a.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-text">
                      {a.label}
                    </span>
                    <span className="block truncate text-xs text-text-muted">
                      {a.sub}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-text-muted transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}

interface QuickAction {
  href: string;
  label: string;
  sub: string;
  icon: ReactNode;
  superAdminOnly?: boolean;
}

const quickActions: QuickAction[] = [
  {
    href: "/admin/blogs/new",
    label: "Write a blog post",
    sub: "Draft or publish an article",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M12 20h9" strokeLinecap="round" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/admin/notifications",
    label: "Send a notification",
    sub: "Post an alert to the website",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" strokeLinejoin="round" />
        <path d="M10 20a2 2 0 0 0 4 0" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/admin/branches/new",
    label: "Add a branch",
    sub: "Create a new campus",
    superAdminOnly: true,
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M3 21h18M5 21V7l7-4 7 4v14" strokeLinejoin="round" />
        <path d="M9 21v-5h6v5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/admin/testimonials",
    label: "Add a testimonial",
    sub: "A student, parent or teacher voice",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M4 5h16v11H9l-5 4z" strokeLinejoin="round" />
        <path d="M8.5 9.5h.01M12 9.5h.01M15.5 9.5h.01" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/admin/enquiries",
    label: "Review enquiries",
    sub: "Respond to admissions leads",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M4 5h16v12H7l-3 3z" strokeLinejoin="round" />
        <path d="M8 9h8M8 13h5" strokeLinecap="round" />
      </svg>
    ),
  },
];
