import "server-only";
import { tryQuery } from "@/lib/db";
import { isBranchSlug } from "@/data/branches";
import type { BlogPostRow } from "@/lib/admin-types";

/** Public blog reads. All resilient — an offline DB yields an empty list. */

export interface PublicBlogCard {
  slug: string;
  title: string;
  branch_ref: string;
  excerpt: string;
  cover_tone: string;
  /** Uploaded cover photo; null falls back to the tone placeholder. */
  cover_image_url: string | null;
  author_name: string;
  published_at: string | null;
}

const CARD_COLUMNS =
  "slug, title, branch_ref, excerpt, cover_tone, cover_image_url, author_name, published_at";

/** All published posts (the group blog hub), newest first. */
export async function getPublishedBlogs(): Promise<PublicBlogCard[]> {
  return tryQuery<PublicBlogCard>(
    `SELECT ${CARD_COLUMNS} FROM blog_posts
     WHERE status = 'published'
     ORDER BY published_at DESC, id DESC
     LIMIT 60`
  );
}

/** Published posts for one branch, plus group-wide ('all') posts. */
export async function getBranchBlogs(slug: string): Promise<PublicBlogCard[]> {
  if (!isBranchSlug(slug)) return [];
  return tryQuery<PublicBlogCard>(
    `SELECT ${CARD_COLUMNS} FROM blog_posts
     WHERE status = 'published' AND (branch_ref = ? OR branch_ref = 'all')
     ORDER BY published_at DESC, id DESC
     LIMIT 60`,
    [slug]
  );
}

/** A single published post by slug (or null). */
export async function getPublishedBlogBySlug(
  slug: string
): Promise<BlogPostRow | null> {
  const rows = await tryQuery<BlogPostRow>(
    `SELECT * FROM blog_posts WHERE slug = ? AND status = 'published' LIMIT 1`,
    [slug]
  );
  return rows[0] ?? null;
}
