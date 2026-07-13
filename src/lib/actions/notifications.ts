"use server";

import { revalidatePath } from "next/cache";
import { mutate } from "@/lib/db";
import { authorizeAction } from "@/lib/dal";
import { canManageBranch } from "@/lib/rbac";
import { isValidBranchRef } from "@/lib/branches-store";

export interface NotificationFormState {
  error?: string;
  ok?: boolean;
}

const LEVELS = ["info", "success", "warning"] as const;

export async function createNotification(
  _prev: NotificationFormState | undefined,
  formData: FormData
): Promise<NotificationFormState> {
  const user = await authorizeAction();

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const level = String(formData.get("level") ?? "info");
  const branchRaw = String(formData.get("branch_ref") ?? "");

  if (!title) return { error: "A title is required." };
  const ref = branchRaw;
  if (!(await isValidBranchRef(ref))) {
    return { error: "Please choose a valid audience." };
  }
  if (!canManageBranch(user, ref)) {
    return { error: "You can only send notifications for your own branch." };
  }
  const safeLevel = LEVELS.includes(level as never) ? level : "info";

  await mutate(
    `INSERT INTO notifications (title, body, branch_ref, level, active, created_by)
     VALUES (?, ?, ?, ?, 1, ?)`,
    [title, body, ref, safeLevel, user.id]
  );

  revalidatePath("/admin/notifications");
  revalidatePath("/admin");
  return { ok: true };
}

export async function toggleNotification(
  id: number,
  active: boolean
): Promise<void> {
  const user = await authorizeAction();
  if (user.role === "super_admin") {
    await mutate("UPDATE notifications SET active = ? WHERE id = ?", [
      active ? 1 : 0,
      id,
    ]);
  } else {
    await mutate(
      "UPDATE notifications SET active = ? WHERE id = ? AND branch_ref = ?",
      [active ? 1 : 0, id, user.branchSlug]
    );
  }
  revalidatePath("/admin/notifications");
  revalidatePath("/admin");
}

export async function deleteNotification(id: number): Promise<void> {
  const user = await authorizeAction();
  if (user.role === "super_admin") {
    await mutate("DELETE FROM notifications WHERE id = ?", [id]);
  } else {
    await mutate(
      "DELETE FROM notifications WHERE id = ? AND branch_ref = ?",
      [id, user.branchSlug]
    );
  }
  revalidatePath("/admin/notifications");
  revalidatePath("/admin");
}
