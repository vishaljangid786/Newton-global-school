"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mutate, query } from "@/lib/db";
import { authorizeAction } from "@/lib/dal";

export interface BranchManagerState {
  error?: string;
}

const TONES = ["primary", "accent", "mist", "forest", "dusk", "stone"];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40)
    .replace(/^-|-$/g, "");
}

interface Parsed {
  name: string;
  area: string;
  address: string;
  phone: string;
  email: string;
  established: number | null;
  grades: string;
  principalName: string;
  principalMessage: string;
  students: number | null;
  campusSize: string;
  facilitiesJson: string | null;
  heroTone: string;
  publish: boolean;
}

function parse(formData: FormData): Parsed | { error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const area = String(formData.get("area") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  if (!name) return { error: "Campus name is required." };
  if (!area) return { error: "Locality / area is required." };
  if (!address) return { error: "Address is required." };
  if (!phone) return { error: "Phone is required." };
  if (!email) return { error: "Email is required." };

  const estRaw = String(formData.get("established") ?? "").trim();
  const established = estRaw ? Number(estRaw) : null;
  if (established !== null && (!Number.isFinite(established) || established < 1800)) {
    return { error: "Enter a valid establishment year." };
  }

  const studentsRaw = String(formData.get("students") ?? "").trim();
  const students = studentsRaw ? Number(studentsRaw) : null;
  if (students !== null && (!Number.isFinite(students) || students < 0)) {
    return { error: "Students must be a positive number." };
  }

  const facilities = String(formData.get("facilities") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const toneRaw = String(formData.get("hero_tone") ?? "primary");

  return {
    name,
    area,
    address,
    phone,
    email,
    established,
    grades: String(formData.get("grades") ?? "").trim(),
    principalName: String(formData.get("principal_name") ?? "").trim(),
    principalMessage: String(formData.get("principal_message") ?? "").trim(),
    students,
    campusSize: String(formData.get("campus_size") ?? "").trim(),
    facilitiesJson: facilities.length ? JSON.stringify(facilities) : null,
    heroTone: TONES.includes(toneRaw) ? toneRaw : "primary",
    publish: String(formData.get("status") ?? "") === "published",
  };
}

export async function createBranch(
  _prev: BranchManagerState | undefined,
  formData: FormData
): Promise<BranchManagerState> {
  const user = await authorizeAction({ superAdmin: true });
  const parsed = parse(formData);
  if ("error" in parsed) return parsed;

  const requested = String(formData.get("slug") ?? "").trim();
  const slug = slugify(requested || parsed.name);
  if (!slug) return { error: "Could not derive a valid slug." };
  const clash = await query<{ slug: string }>(
    "SELECT slug FROM branches WHERE slug = ? LIMIT 1",
    [slug]
  );
  if (clash[0]) return { error: "A branch with that slug already exists." };

  await mutate(
    `INSERT INTO branches
       (slug, name, area, address, phone, email, established, grades,
        principal_name, principal_message, students, campus_size, facilities,
        hero_tone, status, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      slug,
      parsed.name,
      parsed.area,
      parsed.address,
      parsed.phone,
      parsed.email,
      parsed.established,
      parsed.grades,
      parsed.principalName,
      parsed.principalMessage || null,
      parsed.students,
      parsed.campusSize,
      parsed.facilitiesJson,
      parsed.heroTone,
      parsed.publish ? "published" : "draft",
      user.id,
    ]
  );

  revalidatePublic(slug);
  redirect("/admin/branches");
}

export async function updateBranch(
  _prev: BranchManagerState | undefined,
  formData: FormData
): Promise<BranchManagerState> {
  await authorizeAction({ superAdmin: true });
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return { error: "Missing branch." };

  const parsed = parse(formData);
  if ("error" in parsed) return parsed;

  const existing = await query<{ slug: string }>(
    "SELECT slug FROM branches WHERE slug = ? LIMIT 1",
    [slug]
  );
  if (!existing[0]) return { error: "Branch not found." };

  await mutate(
    `UPDATE branches SET
       name = ?, area = ?, address = ?, phone = ?, email = ?, established = ?,
       grades = ?, principal_name = ?, principal_message = ?, students = ?,
       campus_size = ?, facilities = ?, hero_tone = ?, status = ?
     WHERE slug = ?`,
    [
      parsed.name,
      parsed.area,
      parsed.address,
      parsed.phone,
      parsed.email,
      parsed.established,
      parsed.grades,
      parsed.principalName,
      parsed.principalMessage || null,
      parsed.students,
      parsed.campusSize,
      parsed.facilitiesJson,
      parsed.heroTone,
      parsed.publish ? "published" : "draft",
      slug,
    ]
  );

  revalidatePublic(slug);
  redirect("/admin/branches");
}

export async function setBranchStatus(
  slug: string,
  status: "draft" | "published"
): Promise<void> {
  await authorizeAction({ superAdmin: true });
  await mutate("UPDATE branches SET status = ? WHERE slug = ?", [status, slug]);
  revalidatePublic(slug);
}

export async function deleteBranch(slug: string): Promise<void> {
  await authorizeAction({ superAdmin: true });
  await mutate("DELETE FROM branches WHERE slug = ?", [slug]);
  revalidatePublic(slug);
}

function revalidatePublic(slug: string): void {
  revalidatePath("/admin/branches");
  revalidatePath("/branches");
  revalidatePath(`/branches/${slug}`);
}
