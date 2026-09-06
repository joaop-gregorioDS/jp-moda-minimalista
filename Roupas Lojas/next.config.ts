import type { NextConfig } from "next";

function apiOrigin() {
  return (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(
    /\/$/,
    ""
  );
}

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.68.107",
    "192.168.0.1",
    "192.168.1.1",
    "10.0.0.1",
    "127.0.0.1",
  ],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    const api = apiOrigin();
    return [
      {
        source: "/api/:path*",
        destination: `${api}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
