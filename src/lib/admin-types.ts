import type { BranchSlug } from "@/data/types";

/** RBAC roles. Super Admin = group-wide; Branch Admin = one campus. */
export type Role = "super_admin" | "branch_admin";

/** A branch reference used across notifications/blogs: a slug or group-wide. */
export type BranchRef = BranchSlug | "all";

/** The authenticated user as carried in the session cookie. */
export interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: Role;
  /** null for super_admin; the campus slug for branch_admin. */
  branchSlug: BranchSlug | null;
}

export interface EnquiryRow {
  id: number;
  student_name: string;
  parent_name: string;
  phone: string;
  email: string;
  branch_slug: string;
  grade: string;
  message: string | null;
  status: "new" | "contacted" | "closed";
  created_at: string;
}

export interface NotificationRow {
  id: number;
  title: string;
  body: string;
  branch_ref: string;
  level: "info" | "success" | "warning";
  active: 0 | 1;
  created_by: number | null;
  created_at: string;
}

export interface BranchOverrideRow {
  branch_slug: string;
  principal_name: string | null;
  principal_message: string | null;
  principal_photo_url: string | null;
  hero_image_url: string | null;
  students: number | null;
  campus_size: string | null;
  grades: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  facilities: string[] | null;
  updated_at: string;
}

export interface BlogPostRow {
  id: number;
  slug: string;
  title: string;
  branch_ref: string;
  excerpt: string;
  body: string;
  cover_tone: string;
  cover_image_url: string | null;
  status: "draft" | "published";
  author_id: number | null;
  author_name: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRow {
  id: number;
  email: string;
  name: string;
  role: Role;
  branch_slug: string | null;
  created_at: string;
}
