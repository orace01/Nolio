import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // The root layout sits under [lang], so unmatched URLs need a global 404
    globalNotFound: true,
  },
};

export default nextConfig;
