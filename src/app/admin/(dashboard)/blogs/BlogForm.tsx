"use client";

import { useActionState } from "react";
import type { BlogFormState } from "@/lib/actions/blogs";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  FieldLabel,
  adminButtonOutline,
  adminButtonPrimary,
  adminInputClasses,
  adminTextareaClasses,
} from "@/components/admin/ui";

type BlogAction = (
  prev: BlogFormState | undefined,
  formData: FormData
) => Promise<BlogFormState>;

interface AudienceOption {
  value: string;
  label: string;
}

export interface BlogFormValues {
  id?: number;
  title: string;
  branch_ref: string;
  excerpt: string;
  body: string;
  cover_tone: string;
  cover_image_url?: string | null;
}

const TONES = ["primary", "accent", "mist", "forest", "dusk", "stone"];

export default function BlogForm({
  action,
  audiences,
  initial,
}: {
  action: BlogAction;
  audiences: AudienceOption[];
  initial: BlogFormValues;
}) {
  const [state, formAction, pending] = useActionState<
    BlogFormState,
    FormData
  >(action, {});

  return (
    <form action={formAction} className="grid gap-5">
      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}

      {state?.error ? (
        <p
          role="alert"
          className="rounded-card border border-error/30 bg-error/5 px-3.5 py-2.5 text-sm text-error"
        >
          {state.error}
        </p>
      ) : null}

      <div>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <input
          id="title"
          name="title"
          required
          defaultValue={initial.title}
          className={adminInputClasses}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="branch_ref">Audience</FieldLabel>
          <select
            id="branch_ref"
            name="branch_ref"
            defaultValue={initial.branch_ref || audiences[0]?.value}
            className={adminInputClasses}
          >
            {audiences.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel htmlFor="cover_image">Cover photo</FieldLabel>
          <input
            id="cover_image"
            name="cover_image"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className={adminInputClasses}
          />
          <p className="mt-1.5 text-xs text-faint">
            JPG, PNG or WebP up to 5&nbsp;MB.{" "}
            {initial.cover_image_url
              ? "Uploading replaces the current photo."
              : "Without one, the cover colour below is used."}
          </p>
          {initial.cover_image_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={initial.cover_image_url}
              alt="Current cover"
              className="mt-3 h-24 w-40 rounded-card border border-border object-cover"
            />
          ) : null}
        </div>
        <div>
          <FieldLabel htmlFor="cover_tone">Cover colour</FieldLabel>
          <select
            id="cover_tone"
            name="cover_tone"
            defaultValue={initial.cover_tone || "primary"}
            className={`${adminInputClasses} capitalize`}
          >
            {TONES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="excerpt">Excerpt</FieldLabel>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          required
          defaultValue={initial.excerpt}
          className={adminTextareaClasses}
          placeholder="One or two sentences shown on cards and previews."
        />
      </div>

      <div>
        <FieldLabel htmlFor="body">Body</FieldLabel>
        <RichTextEditor
          name="body"
          defaultValue={initial.body}
          placeholder="Write the post. Use the toolbar for headings, lists, quotes and links."
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          name="status"
          value="published"
          disabled={pending}
          className={adminButtonPrimary}
        >
          {pending ? "Saving…" : "Publish"}
        </button>
        <button
          type="submit"
          name="status"
          value="draft"
          disabled={pending}
          className={adminButtonOutline}
        >
          Save as draft
        </button>
      </div>
    </form>
  );
}
