import type { NextConfig } from "next";

/* Images stored by Supabase (imported photos, generated images, logos) */
const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  experimental: {
    // The root layout sits under [lang], so unmatched URLs need a global 404
    globalNotFound: true,
  },
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  // Server-only packages: Chrome for the PDFs stays out of the bundle
  serverExternalPackages: ["puppeteer-core"],
};

export default nextConfig;
