import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `next build` and `next dev` both write to `.next`, so building while a dev
  // server is up corrupts it — broken images and stale chunks until it restarts.
  // Set NEXT_DIST_DIR to build into a scratch directory instead and leave the
  // running dev server alone.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    // Next 16 raised the default from 60s to 4 hours, which meant replacing a
    // file in /public under its existing name kept serving the stale optimised
    // copy for the rest of the day. These are hand-swapped school photos, so
    // seeing the new file matters more than shaving revalidations.
    minimumCacheTTL: 60,
  },
  experimental: {
    serverActions: {
      // Image uploads (principal photos, gallery) go through Server Actions.
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
