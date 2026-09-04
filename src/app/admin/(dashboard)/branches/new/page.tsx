import { requireSuperAdmin } from "@/lib/dal";
import { createBranch } from "@/lib/actions/branches";
import { AdminCard, PageHeader } from "@/components/admin/ui";
import BranchManagerForm from "../BranchManagerForm";

export const metadata = { title: "Add Branch" };

const EMPTY = {
  name: "",
  area: "",
  address: "",
  phone: "",
  email: "",
  established: "",
  grades: "",
  principalName: "",
  principalPhotoUrl: "",
  heroImageUrl: "",
  principalMessage: "",
  students: "",
  campusSize: "",
  heroTone: "primary",
  facilities: "",
};

export default async function NewBranchPage() {
  await requireSuperAdmin();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add a branch"
        description="Create a new campus. Save as draft to prepare it privately, or publish to make it live."
      />
      <AdminCard>
        <BranchManagerForm action={createBranch} initial={EMPTY} mode="create" />
      </AdminCard>
    </div>
  );
}
