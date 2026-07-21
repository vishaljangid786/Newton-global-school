import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { canManageBranch } from "@/lib/rbac";
import { getBranchContent } from "@/lib/branch-content";
import { AdminCard, PageHeader } from "@/components/admin/ui";
import BranchEditorForm, {
  type BranchEditorValues,
} from "../../BranchEditorForm";

export const metadata = { title: "Branch Page Content" };

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Public-page content editor for one branch — lives under the unified
 * Branches section (/admin/branches). Branch admins reach their own campus
 * here; super admins reach any campus from the branches list.
 */
export default async function BranchContentPage({ params }: PageProps) {
  const user = await requireUser();
  const { slug } = await params;

  if (!canManageBranch(user, slug)) notFound();

  // Effective (merged) content pre-fills the form.
  const content = await getBranchContent(slug, { includeUnpublished: true });
  if (!content) notFound();

  const values: BranchEditorValues = {
    slug: content.slug,
    principalName: content.principal.name,
    principalMessage: content.principal.message,
    principalPhotoUrl: content.principal.photoUrl ?? "",
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
        title={`${content.name} — Page Content`}
        description="Edit the public branch page. Changes publish immediately."
        action={
          <div className="flex items-center gap-4">
            <Link
              href="/admin/branches"
              className="text-sm font-medium text-text-muted hover:text-text hover:underline"
            >
              ← All branches
            </Link>
            <Link
              href={`/branches/${slug}`}
              className="text-sm font-semibold text-primary hover:underline"
              target="_blank"
            >
              View live page →
            </Link>
          </div>
        }
      />

      <AdminCard>
        <BranchEditorForm values={values} />
      </AdminCard>
    </div>
  );
}
