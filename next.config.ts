import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Server mandiri untuk Docker di Fly.io
  output: "standalone",
  // www.444s.store selalu diarahkan ke 444s.store
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.444s.store" }],
        destination: "https://444s.store/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.discordapp.com" },
      { protocol: "https", hostname: "tr.rbxcdn.com" },
      { protocol: "https", hostname: "444s.fly.dev" },
    ],
  },
};

export default nextConfig;
