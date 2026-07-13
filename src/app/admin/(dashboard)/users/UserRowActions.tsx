"use client";

import { useTransition } from "react";
import { deleteUser, resetUserPassword } from "@/lib/actions/users";
import { adminButtonDanger } from "@/components/admin/ui";

export default function UserRowActions({
  id,
  isSelf,
}: {
  id: number;
  isSelf: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          const pw = prompt("New password (min 8 characters):");
          if (pw && pw.length >= 8) {
            startTransition(() => resetUserPassword(id, pw));
          } else if (pw !== null) {
            alert("Password must be at least 8 characters.");
          }
        }}
        className="rounded-card border border-border px-3 py-2 text-sm text-text hover:border-primary hover:bg-primary/5"
      >
        Reset password
      </button>
      {isSelf ? (
        <span className="text-xs text-text-muted">You</span>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (confirm("Delete this user? This cannot be undone.")) {
              startTransition(() => deleteUser(id));
            }
          }}
          className={adminButtonDanger}
        >
          Delete
        </button>
      )}
    </div>
  );
}
