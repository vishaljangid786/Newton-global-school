import { requireSuperAdmin } from "@/lib/dal";
import { tryQuery } from "@/lib/db";
import { roleLabel } from "@/lib/rbac";
import {
  AdminCard,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import { getAllBranches } from "@/lib/branches-store";
import type { UserRow } from "@/lib/admin-types";
import AdminDialog from "@/components/admin/AdminDialog";
import UserCreateForm from "./UserCreateForm";
import UserRowActions from "./UserRowActions";

export const metadata = { title: "Users" };

export default async function UsersPage() {
  const me = await requireSuperAdmin();

  const rows = await tryQuery<UserRow>(
    `SELECT id, email, name, role, branch_slug, created_at
     FROM users ORDER BY role, name`
  );

  const all = await getAllBranches({ includeUnpublished: true });
  const branchOptions = all.map((b) => ({ slug: b.slug, name: b.name }));
  const branchName = (slug: string) =>
    all.find((b) => b.slug === slug)?.name ?? slug;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Users"
        description="Manage admin accounts and their access. Super Admins can see and do everything; Branch Admins are scoped to one campus."
        action={
          <AdminDialog
            label="Add user"
            title="Add a user"
            description="They can sign in immediately with the password you set here."
          >
            <UserCreateForm branches={branchOptions} />
          </AdminDialog>
        }
      />

      <section>
        <h2 className="mb-3 font-heading text-lg text-text">All users</h2>
        {rows.length === 0 ? (
          <EmptyState>No users found.</EmptyState>
        ) : (
          <>
            {/* Mobile: stacked cards (the table needs ~640px, so hide it here) */}
            <ul className="space-y-3 sm:hidden">
              {rows.map((u) => (
                <li key={u.id}>
                  <AdminCard className="p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-text">{u.name}</p>
                        <p className="truncate text-xs text-text-muted">
                          {u.email}
                        </p>
                      </div>
                      <StatusBadge
                        tone={u.role === "super_admin" ? "published" : "info"}
                      >
                        {roleLabel(u.role)}
                      </StatusBadge>
                    </div>
                    <p className="mt-2 text-sm text-text-muted">
                      Campus:{" "}
                      <span className="text-text">
                        {u.branch_slug ? branchName(u.branch_slug) : "—"}
                      </span>
                    </p>
                    <div className="mt-3 border-t border-hairline pt-3">
                      <UserRowActions id={u.id} isSelf={u.id === me.id} />
                    </div>
                  </AdminCard>
                </li>
              ))}
            </ul>

            {/* Desktop: full table */}
            <AdminCard className="relative hidden overflow-x-auto p-0 sm:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Campus</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-medium text-text">{u.name}</td>
                    <td className="px-4 py-3 text-text-muted">{u.email}</td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        tone={u.role === "super_admin" ? "published" : "info"}
                      >
                        {roleLabel(u.role)}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {u.branch_slug ? branchName(u.branch_slug) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <UserRowActions id={u.id} isSelf={u.id === me.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </AdminCard>
          </>
        )}
      </section>
    </div>
  );
}
