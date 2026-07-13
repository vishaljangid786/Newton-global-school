import { notFound } from "next/navigation";
import BranchContextBar from "@/components/layout/BranchContextBar";
import { getAllBranchSlugs, getBranchBySlugAsync } from "@/lib/branches-store";

/** Pre-render every published branch (built-in + custom) at build time. */
export async function generateStaticParams() {
  const slugs = await getAllBranchSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function BranchLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const branch = await getBranchBySlugAsync(slug);
  if (!branch) notFound();

  return (
    <>
      <BranchContextBar branch={branch} />
      {children}
    </>
  );
}
