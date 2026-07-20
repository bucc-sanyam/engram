import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // "Review" was renamed to "Recall" (2026-07-20) — keep old bookmarks/deep-links working.
    // Query params (?topic=, ?series=) pass through automatically since they aren't in the source.
    return [{ source: "/review", destination: "/recall", permanent: true }];
  },
};

export default nextConfig;
