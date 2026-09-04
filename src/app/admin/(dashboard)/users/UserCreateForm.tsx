"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createUser, type UserFormState } from "@/lib/actions/users";
import {
  FieldLabel,
  adminButtonPrimary,
  adminInputClasses,
} from "@/components/admin/ui";
import { useDialogClose } from "@/components/admin/AdminDialog";

interface BranchOption {
  slug: string;
  name: string;
}

export default function UserCreateForm({
  branches,
}: {
  branches: BranchOption[];
}) {
  const [state, action, pending] = useActionState<UserFormState, FormData>(
    createUser,
    {}
  );
  const [role, setRole] = useState("branch_admin");
  const formRef = useRef<HTMLFormElement>(null);
  /* No-op unless this form is rendered inside an AdminDialog. */
  const closeDialog = useDialogClose();

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      setRole("branch_admin");
      closeDialog();
    }
  }, [state?.ok, closeDialog]);

  return (
    <form ref={formRef} action={action} className="grid gap-4">
      {state?.error ? (
        <p
          role="alert"
          className="rounded-card border border-error/30 bg-error/5 px-3.5 py-2.5 text-sm text-error"
        >
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="rounded-card border border-success/30 bg-success/5 px-3.5 py-2.5 text-sm text-success">
          User created.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <input id="name" name="name" required className={adminInputClasses} />
        </div>
        <div>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={adminInputClasses}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="password">Temporary password</FieldLabel>
          <input
            id="password"
            name="password"
            type="text"
            required
            minLength={8}
            className={adminInputClasses}
            placeholder="At least 8 characters"
          />
        </div>
        <div>
          <FieldLabel htmlFor="role">Role</FieldLabel>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={adminInputClasses}
          >
            <option value="branch_admin">Branch Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
      </div>

      {role === "branch_admin" ? (
        <div>
          <FieldLabel htmlFor="branch_slug">Assigned campus</FieldLabel>
          <select
            id="branch_slug"
            name="branch_slug"
            className={adminInputClasses}
            defaultValue={branches[0]?.slug}
          >
            {branches.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div>
        <button type="submit" disabled={pending} className={adminButtonPrimary}>
          {pending ? "Creating…" : "Create user"}
        </button>
      </div>
    </form>
  );
}
