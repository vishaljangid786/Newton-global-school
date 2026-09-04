"use client";

import { useActionState } from "react";
import {
  saveBranchOverride,
  type BranchFormState,
} from "@/lib/actions/branch";
import {
  FieldLabel,
  adminButtonPrimary,
  adminInputClasses,
  adminTextareaClasses,
} from "@/components/admin/ui";

export interface BranchEditorValues {
  slug: string;
  principalName: string;
  principalMessage: string;
  /** Currently saved principal photo (override or branch), "" when none. */
  principalPhotoUrl: string;
  heroImageUrl: string;
  students: string;
  campusSize: string;
  grades: string;
  phone: string;
  email: string;
  address: string;
  facilities: string;
}

export default function BranchEditorForm({
  values,
}: {
  values: BranchEditorValues;
}) {
  const [state, action, pending] = useActionState<BranchFormState, FormData>(
    saveBranchOverride,
    {}
  );

  return (
    // key forces the uncontrolled fields to reset when switching branch tabs.
    <form key={values.slug} action={action} className="grid gap-5">
      <input type="hidden" name="slug" value={values.slug} />

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
          Saved. The public branch page has been updated.
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="principal_name">Principal name</FieldLabel>
          <input
            id="principal_name"
            name="principal_name"
            defaultValue={values.principalName}
            className={adminInputClasses}
          />
        </div>
        <div>
          <FieldLabel htmlFor="grades">Grades offered</FieldLabel>
          <input
            id="grades"
            name="grades"
            defaultValue={values.grades}
            className={adminInputClasses}
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="principal_message">Principal&apos;s message</FieldLabel>
        <textarea
          id="principal_message"
          name="principal_message"
          rows={5}
          defaultValue={values.principalMessage}
          className={adminTextareaClasses}
        />
      </div>

      <div>
        <FieldLabel htmlFor="principal_photo">Principal&apos;s photo</FieldLabel>
        <div className="flex flex-wrap items-start gap-4">
          {values.principalPhotoUrl ? (
            <span className="block h-20 w-20 shrink-0 overflow-hidden rounded-card border border-hairline bg-bg-alt">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={values.principalPhotoUrl}
                alt="Current principal photo"
                className="h-full w-full object-cover"
              />
            </span>
          ) : null}
          <div className="min-w-[min(16rem,100%)] flex-1">
            <input
              id="principal_photo"
              name="principal_photo"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className={`${adminInputClasses} file:mr-3 file:rounded-btn file:border-0 file:bg-primary-soft file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary`}
            />
            <p className="mt-1 text-xs text-text-muted">
              JPG, PNG or WebP up to 5 MB. Uploading replaces the current
              photo; without one, a placeholder with initials is shown.
            </p>
            {values.principalPhotoUrl ? (
              <label className="mt-2 flex items-center gap-2 text-sm text-text">
                <input
                  type="checkbox"
                  name="principal_photo_remove"
                  value="1"
                  className="h-4 w-4 rounded border-border text-primary"
                />
                Remove the current photo
              </label>
            ) : null}
          </div>
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="hero_image">Campus photo</FieldLabel>
        <div className="mt-2 flex flex-wrap items-start gap-4">
          {values.heroImageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={values.heroImageUrl}
              alt="Current campus photo"
              className="h-24 w-40 rounded-card border border-border object-cover"
            />
          ) : null}
          <div className="min-w-[min(16rem,100%)] flex-1">
            <input
              id="hero_image"
              name="hero_image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className={`${adminInputClasses} file:mr-3 file:rounded-btn file:border-0 file:bg-primary-soft file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary`}
            />
            <p className="mt-1 text-xs text-text-muted">
              Shown on the campus card and at the top of the branch page.
              Without one, the hero colour below is used.
            </p>
            {values.heroImageUrl ? (
              <label className="mt-2 flex items-center gap-2 text-sm text-text">
                <input
                  type="checkbox"
                  name="hero_image_remove"
                  value="1"
                  className="h-4 w-4 rounded border-border text-primary"
                />
                Remove the current photo
              </label>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="students">Students</FieldLabel>
          <input
            id="students"
            name="students"
            type="number"
            min="0"
            defaultValue={values.students}
            className={adminInputClasses}
          />
        </div>
        <div>
          <FieldLabel htmlFor="campus_size">Campus size</FieldLabel>
          <input
            id="campus_size"
            name="campus_size"
            defaultValue={values.campusSize}
            className={adminInputClasses}
          />
        </div>
        <div>
          <FieldLabel htmlFor="phone">Phone</FieldLabel>
          <input
            id="phone"
            name="phone"
            defaultValue={values.phone}
            className={adminInputClasses}
          />
        </div>
        <div>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <input
            id="email"
            name="email"
            defaultValue={values.email}
            className={adminInputClasses}
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="address">Address</FieldLabel>
        <input
          id="address"
          name="address"
          defaultValue={values.address}
          className={adminInputClasses}
        />
      </div>

      <div>
        <FieldLabel htmlFor="facilities">Facilities (one per line)</FieldLabel>
        <textarea
          id="facilities"
          name="facilities"
          rows={8}
          defaultValue={values.facilities}
          className={`${adminTextareaClasses} font-mono text-xs`}
        />
        <p className="mt-1 text-xs text-text-muted">
          Leave a field empty to revert it to the site default.
        </p>
      </div>

      <div>
        <button type="submit" disabled={pending} className={adminButtonPrimary}>
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
