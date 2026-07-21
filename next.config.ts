import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Image uploads (principal photos, gallery) go through Server Actions.
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
