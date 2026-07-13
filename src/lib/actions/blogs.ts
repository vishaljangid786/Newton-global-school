"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mutate, query } from "@/lib/db";
import { authorizeAction } from "@/lib/dal";
import { canManageBranch } from "@/lib/rbac";
import { isValidBranchRef } from "@/lib/branches-store";
import { htmlToText, sanitizeHtml } from "@/lib/sanitize-html";
import type { BranchRef, BlogPostRow } from "@/lib/admin-types";

export interface BlogFormState {
  error?: string;
}

const TONES = ["primary", "accent", "mist", "forest", "dusk", "stone"];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/^-|-$/g, "");
}

/** Ensure the slug is unique (append -2, -3, … on collision). */
async function uniqueSlug(base: string, excludeId?: number): Promise<string> {
  const seed = base || "post";
  let candidate = seed;
  let n = 1;
  // Loop until no other row (besides excludeId) uses the candidate.
  for (;;) {
    const rows = await query<{ id: number }>(
      "SELECT id FROM blog_posts WHERE slug = ? LIMIT 1",
      [candidate]
    );
    const clash = rows[0];
    if (!clash || clash.id === excludeId) return candidate;
    n += 1;
    candidate = `${seed}-${n}`;
  }
}

interface ParsedFields {
  title: string;
  ref: BranchRef;
  excerpt: string;
  body: string;
  tone: string;
  publish: boolean;
}

function parseForm(formData: FormData): ParsedFields | { error: string } {
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = sanitizeHtml(String(formData.get("body") ?? "").trim());
  const toneRaw = String(formData.get("cover_tone") ?? "primary");
  const ref = String(formData.get("branch_ref") ?? "").trim();
  const publish = String(formData.get("status") ?? "") === "published";

  if (!title) return { error: "A title is required." };
  if (!excerpt) return { error: "A short excerpt is required." };
  if (!htmlToText(body)) return { error: "Post body cannot be empty." };
  if (!ref) return { error: "Choose a valid audience." };
  const tone = TONES.includes(toneRaw) ? toneRaw : "primary";

  return { title, ref, excerpt, body, tone, publish };
}

export async function createBlog(
  _prev: BlogFormState | undefined,
  formData: FormData
): Promise<BlogFormState> {
  const user = await authorizeAction();
  const parsed = parseForm(formData);
  if ("error" in parsed) return parsed;

  if (!(await isValidBranchRef(parsed.ref))) {
    return { error: "Choose a valid audience." };
  }
  if (!canManageBranch(user, parsed.ref)) {
    return { error: "You can only publish for your own branch." };
  }

  const slug = await uniqueSlug(slugify(parsed.title));
  await mutate(
    `INSERT INTO blog_posts
       (slug, title, branch_ref, excerpt, body, cover_tone, status,
        author_id, author_name, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      slug,
      parsed.title,
      parsed.ref,
      parsed.excerpt,
      parsed.body,
      parsed.tone,
      parsed.publish ? "published" : "draft",
      user.id,
      user.name,
      parsed.publish ? new Date() : null,
    ]
  );

  revalidatePath("/admin/blogs");
  if (parsed.publish) revalidateBlogPublic(parsed.ref, slug);
  redirect("/admin/blogs");
}

export async function updateBlog(
  _prev: BlogFormState | undefined,
  formData: FormData
): Promise<BlogFormState> {
  const user = await authorizeAction();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { error: "Invalid post." };

  const parsed = parseForm(formData);
  if ("error" in parsed) return parsed;

  const existing = await query<BlogPostRow>(
    "SELECT * FROM blog_posts WHERE id = ? LIMIT 1",
    [id]
  );
  const post = existing[0];
  if (!post) return { error: "Post not found." };

  if (!(await isValidBranchRef(parsed.ref))) {
    return { error: "Choose a valid audience." };
  }
  // Must be allowed to manage both the current and the new audience.
  if (
    !canManageBranch(user, post.branch_ref as BranchRef) ||
    !canManageBranch(user, parsed.ref)
  ) {
    return { error: "You can only edit posts for your own branch." };
  }

  const nowPublished = parsed.publish;
  const wasPublished = post.status === "published";
  // Set published_at when transitioning draft → published; keep otherwise.
  const publishedAt =
    nowPublished && !wasPublished ? new Date() : post.published_at;

  await mutate(
    `UPDATE blog_posts SET
       title = ?, branch_ref = ?, excerpt = ?, body = ?, cover_tone = ?,
       status = ?, published_at = ?
     WHERE id = ?`,
    [
      parsed.title,
      parsed.ref,
      parsed.excerpt,
      parsed.body,
      parsed.tone,
      nowPublished ? "published" : "draft",
      publishedAt,
      id,
    ]
  );

  revalidatePath("/admin/blogs");
  revalidateBlogPublic(parsed.ref, post.slug);
  redirect("/admin/blogs");
}

export async function setBlogStatus(
  id: number,
  status: "draft" | "published"
): Promise<void> {
  const user = await authorizeAction();
  const rows = await query<BlogPostRow>(
    "SELECT branch_ref, slug, status FROM blog_posts WHERE id = ? LIMIT 1",
    [id]
  );
  const post = rows[0];
  if (!post) return;
  if (!canManageBranch(user, post.branch_ref as BranchRef)) return;

  const publishedAt =
    status === "published" && post.status !== "published" ? new Date() : undefined;

  if (publishedAt) {
    await mutate(
      "UPDATE blog_posts SET status = ?, published_at = ? WHERE id = ?",
      [status, publishedAt, id]
    );
  } else {
    await mutate("UPDATE blog_posts SET status = ? WHERE id = ?", [status, id]);
  }

  revalidatePath("/admin/blogs");
  revalidateBlogPublic(post.branch_ref as BranchRef, post.slug);
}

export async function deleteBlog(id: number): Promise<void> {
  const user = await authorizeAction();
  const rows = await query<BlogPostRow>(
    "SELECT branch_ref, slug FROM blog_posts WHERE id = ? LIMIT 1",
    [id]
  );
  const post = rows[0];
  if (!post) return;
  if (!canManageBranch(user, post.branch_ref as BranchRef)) return;

  await mutate("DELETE FROM blog_posts WHERE id = ?", [id]);
  revalidatePath("/admin/blogs");
  revalidateBlogPublic(post.branch_ref as BranchRef, post.slug);
}

/** Refresh the public surfaces a post can appear on. */
function revalidateBlogPublic(ref: BranchRef, slug: string): void {
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  if (ref === "all") {
    // Group posts appear on every branch blog.
    revalidatePath("/branches/[slug]/blog", "page");
  } else {
    revalidatePath(`/branches/${ref}/blog`);
  }
}
