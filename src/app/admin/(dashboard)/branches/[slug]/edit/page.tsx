import { notFound } from "next/navigation";
import { requireSuperAdmin } from "@/lib/dal";
import { query } from "@/lib/db";
import { updateBranch } from "@/lib/actions/branches";
import { AdminCard, PageHeader } from "@/components/admin/ui";
import type { CustomBranchRow } from "@/lib/branches-store";
import BranchManagerForm, {
  type BranchManagerValues,
} from "../../BranchManagerForm";

export const metadata = { title: "Edit Branch" };

interface PageProps {
  params: Promise<{ slug: string }>;
}

function facilitiesToText(value: unknown): string {
  if (Array.isArray(value)) return (value as string[]).join("\n");
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.join("\n") : "";
    } catch {
      return "";
    }
  }
  return "";
}

export default async function EditBranchPage({ params }: PageProps) {
  await requireSuperAdmin();
  const { slug } = await params;

  const rows = await query<CustomBranchRow>(
    "SELECT * FROM branches WHERE slug = ? LIMIT 1",
    [slug]
  );
  const b = rows[0];
  if (!b) notFound();

  const initial: BranchManagerValues = {
    slug: b.slug,
    name: b.name,
    area: b.area,
    address: b.address,
    phone: b.phone,
    email: b.email,
    established: b.established ? String(b.established) : "",
    grades: b.grades ?? "",
    principalName: b.principal_name ?? "",
    principalPhotoUrl: b.principal_photo_url ?? "",
    principalMessage: b.principal_message ?? "",
    students: b.students != null ? String(b.students) : "",
    campusSize: b.campus_size ?? "",
    heroTone: b.hero_tone || "primary",
    facilities: facilitiesToText(b.facilities),
  };

  return (
    <div className="space-y-6">
      <PageHeader title={`Edit ${b.name}`} description={`Status: ${b.status}`} />
      <AdminCard>
        <BranchManagerForm action={updateBranch} initial={initial} mode="edit" />
      </AdminCard>
    </div>
  );
}
