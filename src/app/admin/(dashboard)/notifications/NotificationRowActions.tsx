"use client";

import { useTransition } from "react";
import {
  deleteNotification,
  toggleNotification,
} from "@/lib/actions/notifications";
import { adminButtonDanger } from "@/components/admin/ui";

export default function NotificationRowActions({
  id,
  active,
}: {
  id: number;
  active: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => toggleNotification(id, !active))}
        className="rounded-card border border-border px-3 py-2 text-sm text-text hover:border-primary hover:bg-primary/5"
      >
        {active ? "Deactivate" : "Activate"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm("Delete this notification?")) {
            startTransition(() => deleteNotification(id));
          }
        }}
        className={adminButtonDanger}
      >
        Delete
      </button>
    </div>
  );
}
