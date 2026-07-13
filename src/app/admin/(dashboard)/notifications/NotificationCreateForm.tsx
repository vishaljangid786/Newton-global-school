"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createNotification,
  type NotificationFormState,
} from "@/lib/actions/notifications";
import {
  FieldLabel,
  adminButtonPrimary,
  adminInputClasses,
} from "@/components/admin/ui";

interface AudienceOption {
  value: string;
  label: string;
}

export default function NotificationCreateForm({
  audiences,
}: {
  audiences: AudienceOption[];
}) {
  const [state, action, pending] = useActionState<
    NotificationFormState,
    FormData
  >(createNotification, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state?.ok]);

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
          Notification published.
        </p>
      ) : null}

      <div>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <input id="title" name="title" required className={adminInputClasses} />
      </div>

      <div>
        <FieldLabel htmlFor="body">Message</FieldLabel>
        <textarea
          id="body"
          name="body"
          rows={2}
          className={adminInputClasses}
          placeholder="Optional supporting text"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="branch_ref">Audience</FieldLabel>
          <select
            id="branch_ref"
            name="branch_ref"
            className={adminInputClasses}
            defaultValue={audiences[0]?.value}
          >
            {audiences.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel htmlFor="level">Style</FieldLabel>
          <select
            id="level"
            name="level"
            className={adminInputClasses}
            defaultValue="info"
          >
            <option value="info">Info (navy)</option>
            <option value="success">Success (green)</option>
            <option value="warning">Warning (amber)</option>
          </select>
        </div>
      </div>

      <div>
        <button type="submit" disabled={pending} className={adminButtonPrimary}>
          {pending ? "Publishing…" : "Publish notification"}
        </button>
      </div>
    </form>
  );
}
