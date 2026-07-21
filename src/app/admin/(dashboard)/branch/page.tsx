import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ slug?: string }>;
}

/**
 * Legacy route — Branch Content merged into the Branches section.
 * /admin/branch?slug=x → /admin/branches/x/content, otherwise the list.
 */
export default async function LegacyBranchContentPage({
  searchParams,
}: PageProps) {
  const { slug } = await searchParams;
  redirect(slug ? `/admin/branches/${slug}/content` : "/admin/branches");
}
