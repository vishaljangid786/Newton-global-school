"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Hides the public site chrome (Header/Footer) on the admin dashboard, which
 * has its own shell. Keeps the root layout otherwise static.
 */
export default function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
