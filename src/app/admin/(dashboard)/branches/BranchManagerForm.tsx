"use client";

import { useActionState } from "react";
import type { BranchManagerState } from "@/lib/actions/branches";
import {
  FieldLabel,
  adminButtonOutline,
  adminButtonPrimary,
  adminInputClasses,
  adminTextareaClasses,
} from "@/components/admin/ui";

type BranchAction = (
  prev: BranchManagerState | undefined,
  formData: FormData
) => Promise<BranchManagerState>;

export interface BranchManagerValues {
  slug?: string;
  name: string;
  area: string;
  address: string;
  phone: string;
  email: string;
  established: string;
  grades: string;
  principalName: string;
  principalMessage: string;
  /** Currently saved principal photo, "" when none. */
  principalPhotoUrl: string;
  heroImageUrl: string;
  students: string;
  campusSize: string;
  heroTone: string;
  facilities: string;
}

const TONES = ["primary", "accent", "mist", "forest", "dusk", "stone"];

export default function BranchManagerForm({
  action,
  initial,
  mode,
}: {
  action: BranchAction;
  initial: BranchManagerValues;
  mode: "create" | "edit";
}) {
  const [state, formAction, pending] = useActionState<
    BranchManagerState,
    FormData
  >(action, {});

  return (
    <form action={formAction} className="grid gap-5">
      {mode === "edit" ? (
        <input type="hidden" name="slug" value={initial.slug} />
      ) : null}

      {state?.error ? (
        <p
          role="alert"
          className="rounded-card border border-error/30 bg-error/5 px-3.5 py-2.5 text-sm text-error"
        >
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="name">Campus name</FieldLabel>
          <input id="name" name="name" required defaultValue={initial.name} className={adminInputClasses} />
        </div>
        <div>
          <FieldLabel htmlFor="area">Locality / area</FieldLabel>
          <input id="area" name="area" required defaultValue={initial.area} className={adminInputClasses} placeholder="e.g. Malviya Nagar, Jaipur" />
        </div>
      </div>

      {mode === "create" ? (
        <div>
          <FieldLabel htmlFor="slug">URL slug (optional)</FieldLabel>
          <input id="slug" name="slug" defaultValue={initial.slug} className={adminInputClasses} placeholder="auto-generated from name, e.g. malviya-nagar" />
          <p className="mt-1 text-xs text-text-muted">
            Becomes /branches/&lt;slug&gt;. Leave blank to derive from the name.
          </p>
        </div>
      ) : null}

      <div>
        <FieldLabel htmlFor="address">Address</FieldLabel>
        <input id="address" name="address" required defaultValue={initial.address} className={adminInputClasses} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="phone">Phone</FieldLabel>
          <input id="phone" name="phone" required defaultValue={initial.phone} className={adminInputClasses} />
        </div>
        <div>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <input id="email" name="email" type="email" required defaultValue={initial.email} className={adminInputClasses} />
        </div>
        <div>
          <FieldLabel htmlFor="grades">Grades offered</FieldLabel>
          <input id="grades" name="grades" defaultValue={initial.grades} className={adminInputClasses} placeholder="Nursery – Grade 12" />
        </div>
        <div>
          <FieldLabel htmlFor="established">Established (year)</FieldLabel>
          <input id="established" name="established" type="number" defaultValue={initial.established} className={adminInputClasses} placeholder="2025" />
        </div>
        <div>
          <FieldLabel htmlFor="students">Students</FieldLabel>
          <input id="students" name="students" type="number" min="0" defaultValue={initial.students} className={adminInputClasses} />
        </div>
        <div>
          <FieldLabel htmlFor="campus_size">Campus size</FieldLabel>
          <input id="campus_size" name="campus_size" defaultValue={initial.campusSize} className={adminInputClasses} placeholder="4 acres" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="principal_name">Principal name</FieldLabel>
          <input id="principal_name" name="principal_name" defaultValue={initial.principalName} className={adminInputClasses} />
        </div>
        <div>
          <FieldLabel htmlFor="hero_tone">Hero colour</FieldLabel>
          <select id="hero_tone" name="hero_tone" defaultValue={initial.heroTone || "primary"} className={`${adminInputClasses} capitalize`}>
            {TONES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="principal_message">Principal&apos;s message</FieldLabel>
        <textarea id="principal_message" name="principal_message" rows={4} defaultValue={initial.principalMessage} className={adminTextareaClasses} />
      </div>

      <div>
        <FieldLabel htmlFor="principal_photo">Principal&apos;s photo</FieldLabel>
        <div className="flex flex-wrap items-start gap-4">
          {initial.principalPhotoUrl ? (
            <span className="block h-20 w-20 shrink-0 overflow-hidden rounded-card border border-hairline bg-bg-alt">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={initial.principalPhotoUrl}
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
              JPG, PNG or WebP up to 5 MB. Without a photo, a placeholder with
              initials is shown on the public page.
            </p>
            {mode === "edit" && initial.principalPhotoUrl ? (
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

      <div>
        <FieldLabel htmlFor="hero_image">Campus photo</FieldLabel>
        <div className="mt-2 flex flex-wrap items-start gap-4">
          {mode === "edit" && initial.heroImageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={initial.heroImageUrl}
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
              Without one, the hero colour is used.
            </p>
            {mode === "edit" && initial.heroImageUrl ? (
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
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="facilities">Facilities (one per line)</FieldLabel>
        <textarea id="facilities" name="facilities" rows={6} defaultValue={initial.facilities} className={`${adminTextareaClasses} font-mono text-xs`} placeholder={"Library\nScience Lab\nSports Ground"} />
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" name="status" value="published" disabled={pending} className={adminButtonPrimary}>
          {pending ? "Saving…" : mode === "create" ? "Create & publish" : "Save & publish"}
        </button>
        <button type="submit" name="status" value="draft" disabled={pending} className={adminButtonOutline}>
          Save as draft
        </button>
      </div>
    </form>
  );
}
