import Link from "next/link";
import { requireUser } from "@/lib/dal";
import { canManageBranch } from "@/lib/rbac";
import { getBranchContent } from "@/lib/branch-content";
import { getAllBranches } from "@/lib/branches-store";
import { AdminCard, EmptyState, PageHeader } from "@/components/admin/ui";
import BranchEditorForm, {
  type BranchEditorValues,
} from "./BranchEditorForm";

export const metadata = { title: "Branch Content" };

interface PageProps {
  searchParams: Promise<{ slug?: string }>;
}

export default async function BranchContentPage({ searchParams }: PageProps) {
  const user = await requireUser();
  const { slug: requested } = await searchParams;

  // Branches this user may edit (built-in + custom).
  const all = await getAllBranches({ includeUnpublished: true });
  const editable = all.filter((b) => canManageBranch(user, b.slug));

  if (editable.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Branch Content" />
        <EmptyState>You don&apos;t have a branch assigned to edit.</EmptyState>
      </div>
    );
  }

  const active =
    editable.find((b) => b.slug === requested) ?? editable[0];

  // Effective (merged) content pre-fills the form.
  const content =
    (await getBranchContent(active.slug, { includeUnpublished: true })) ?? active;

  const values: BranchEditorValues = {
    slug: content.slug,
    principalName: content.principal.name,
    principalMessage: content.principal.message,
    students: String(content.quickFacts.students),
    campusSize: content.quickFacts.campusSize,
    grades: content.grades,
    phone: content.phone,
    email: content.email,
    address: content.address,
    facilities: content.facilities.join("\n"),
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Branch Content"
        description="Edit the public branch page. Changes publish immediately."
        action={
          <Link
            href={`/branches/${active.slug}`}
            className="text-sm font-semibold text-primary hover:underline"
            target="_blank"
          >
            View live page →
          </Link>
        }
      />

      {editable.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {editable.map((b) => (
            <Link
              key={b.slug}
              href={`/admin/branch?slug=${b.slug}`}
              className={`rounded-pill border px-3.5 py-1.5 text-sm transition-colors ${
                b.slug === active.slug
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-bg text-text hover:border-primary"
              }`}
            >
              {b.name}
            </Link>
          ))}
        </div>
      ) : null}

      <AdminCard>
        <BranchEditorForm values={values} />
      </AdminCard>
    </div>
  );
}
