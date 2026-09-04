"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  uploadGalleryImage,
  type GalleryFormState,
} from "@/lib/actions/gallery";
import {
  FieldLabel,
  adminButtonPrimary,
  adminInputClasses,
} from "@/components/admin/ui";
import { useDialogClose } from "@/components/admin/AdminDialog";

interface CampusOption {
  value: string;
  label: string;
}

const CATEGORIES = ["Sports", "Annual Day", "Classrooms", "Trips"];

export default function GalleryUploadForm({
  campuses,
}: {
  campuses: CampusOption[];
}) {
  const [state, action, pending] = useActionState<GalleryFormState, FormData>(
    uploadGalleryImage,
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);
  /* No-op unless this form is rendered inside an AdminDialog. */
  const closeDialog = useDialogClose();

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
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
          Photo uploaded — it is live on the public gallery.
        </p>
      ) : null}

      <div>
        <FieldLabel htmlFor="image">Image (JPG, PNG, WebP — max 5 MB)</FieldLabel>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          required
          className={`${adminInputClasses} file:mr-3 file:rounded-btn file:border-0 file:bg-primary-soft file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary`}
        />
      </div>

      <div>
        <FieldLabel htmlFor="caption">Caption</FieldLabel>
        <input
          id="caption"
          name="caption"
          required
          className={adminInputClasses}
          placeholder="e.g. Senior football final on the main field"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="branch_ref">Campus</FieldLabel>
          <select
            id="branch_ref"
            name="branch_ref"
            className={adminInputClasses}
            defaultValue={campuses[0]?.value}
          >
            {campuses.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel htmlFor="category">Category</FieldLabel>
          <select
            id="category"
            name="category"
            className={adminInputClasses}
            defaultValue="Sports"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <button type="submit" disabled={pending} className={adminButtonPrimary}>
          {pending ? "Uploading…" : "Upload photo"}
        </button>
      </div>
    </form>
  );
}
