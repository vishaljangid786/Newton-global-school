"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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

/**
 * What the person is adding. The three arms post to the same Server Action
 * under a `media` field — see uploadGalleryImage.
 */
type MediaMode = "image" | "video" | "youtube";

const MODES: ReadonlyArray<{
  value: MediaMode;
  label: string;
  hint: string;
}> = [
  { value: "image", label: "Photo", hint: "JPG, PNG or WebP — up to 5 MB" },
  {
    value: "video",
    label: "Video file",
    hint: "MP4, WebM or MOV — up to 48 MB, stored on this server",
  },
  {
    value: "youtube",
    label: "YouTube link",
    hint: "No upload and no size limit — best for anything long",
  },
];

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
  const [mode, setMode] = useState<MediaMode>("image");
  /* No-op unless this form is rendered inside an AdminDialog. */
  const closeDialog = useDialogClose();

  /* No setMode here: AdminDialog only mounts its children while it is open, so
     closing unmounts this form and the next opening starts on "Photo" anyway.
     Setting it synchronously in the effect would just be a wasted render. */
  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      closeDialog();
    }
  }, [state?.ok, closeDialog]);

  const active = MODES.find((m) => m.value === mode)!;

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
          Uploaded — it is live on the public gallery.
        </p>
      ) : null}

      {/* The Server Action reads this to pick its arm. A hidden input rather
          than a <select> so the three choices can be real buttons. */}
      <input type="hidden" name="media" value={mode} />

      <div>
        <FieldLabel htmlFor="media-photo">What are you adding?</FieldLabel>
        <div
          role="radiogroup"
          aria-label="What are you adding?"
          className="mt-1 grid gap-2 sm:grid-cols-3"
        >
          {MODES.map((m) => (
            <button
              key={m.value}
              id={`media-${m.value}`}
              type="button"
              role="radio"
              aria-checked={mode === m.value}
              onClick={() => setMode(m.value)}
              className={`rounded-card border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                mode === m.value
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border bg-surface text-text hover:border-primary/40"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-faint">{active.hint}</p>
      </div>

      {/*
        Each arm's fields are mounted only while that arm is chosen. They are
        unmounted rather than hidden on purpose: a hidden-but-present `required`
        file input blocks submission with a validation message the person cannot
        see, and a stale file from another arm would still be posted.
      */}
      {mode === "image" ? (
        <div>
          <FieldLabel htmlFor="image">Image</FieldLabel>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            required
            className={`${adminInputClasses} file:mr-3 file:rounded-btn file:border-0 file:bg-primary-soft file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary`}
          />
        </div>
      ) : null}

      {mode === "video" ? (
        <>
          <div>
            <FieldLabel htmlFor="video">Video file</FieldLabel>
            <input
              id="video"
              name="video"
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              required
              className={`${adminInputClasses} file:mr-3 file:rounded-btn file:border-0 file:bg-primary-soft file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary`}
            />
          </div>
          <div>
            <FieldLabel htmlFor="poster">
              Cover image <span className="font-normal text-faint">(optional)</span>
            </FieldLabel>
            <input
              id="poster"
              name="poster"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className={`${adminInputClasses} file:mr-3 file:rounded-btn file:border-0 file:bg-primary-soft file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary`}
            />
            <p className="mt-1.5 text-xs text-faint">
              The still shown on the tile before anyone presses play. Leave it
              empty and the video&apos;s own first frame is used.
            </p>
          </div>
        </>
      ) : null}

      {mode === "youtube" ? (
        <div>
          <FieldLabel htmlFor="youtube_url">YouTube link</FieldLabel>
          <input
            id="youtube_url"
            name="youtube_url"
            type="url"
            required
            className={adminInputClasses}
            placeholder="https://www.youtube.com/watch?v=…"
          />
          <p className="mt-1.5 text-xs text-faint">
            Paste the address from the browser bar or the Share button — watch,
            youtu.be and Shorts links all work. The cover picture is taken from
            YouTube automatically.
          </p>
        </div>
      ) : null}

      <div>
        <FieldLabel htmlFor="caption">Caption</FieldLabel>
        <input
          id="caption"
          name="caption"
          required
          className={adminInputClasses}
          placeholder="e.g. Annual Day dance performance, Class 5"
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
          {pending
            ? mode === "image"
              ? "Uploading…"
              : "Uploading — large videos take a minute…"
            : `Add ${active.label.toLowerCase()}`}
        </button>
      </div>
    </form>
  );
}
