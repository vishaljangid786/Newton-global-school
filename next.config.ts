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
    // AVIF first: roughly a fifth smaller than WebP on these photographs, and
    // every browser that cannot take it still gets the WebP below it.
    formats: ["image/avif", "image/webp"],
    /*
     * Next generates a srcset entry per width in these two lists — 15 by
     * default. On the gallery that meant 1,560 URLs in one HTML document.
     * No source image here is wider than 1600px, so anything above that was
     * upscaling, and the small end only needs enough steps for the mosaic
     * tiles and thumbnails.
     */
    deviceSizes: [640, 828, 1080, 1600],
    imageSizes: [96, 160, 256, 384],
    // Gallery videos added as a YouTube link have no uploaded poster — the
    // tile shows YouTube's own thumbnail for that video id, and next/image
    // refuses any host not named here.
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
    ],
  },
  experimental: {
    serverActions: {
      // Uploads (principal photos, gallery photographs and videos) go through
      // Server Actions, which buffer the whole body before the handler runs.
      // Must stay ABOVE lib/uploads.ts MAX_VIDEO_BYTES (48 MB) — a request over
      // this limit is rejected by the framework with a far less helpful message
      // than the size check in saveUploadedVideo. Raise both together.
      bodySizeLimit: "56mb",
    },
  },
};

export default nextConfig;
