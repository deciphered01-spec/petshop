import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://*.supabase.co;",
          },
        ],
      },
    ];
  },
  /* @ts-expect-error - turbo config exists at runtime but missing from current types */
  turbo: {
    root: '.',
  },
};

export default nextConfig;
