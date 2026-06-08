import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // highlight.js needs to be treated as an external package in server components
  serverExternalPackages: ["highlight.js"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
