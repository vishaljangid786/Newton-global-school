import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireUser } from "@/lib/dal";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: { template: "%s | Newton Admin", default: "Newton Admin" },
  robots: { index: false, follow: false },
};

// Admin pages read cookies + the DB — always render dynamically.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="admin-scope min-h-screen bg-bg-alt lg:flex">
      <AdminSidebar user={user} />
      <div className="flex-1">
        <div className="mx-auto w-full max-w-6xl py-8 lg:py-10 px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          {children}
        </div>
      </div>
    </div>
  );
}
