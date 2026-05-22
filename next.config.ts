import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // highlight.js needs to be treated as an external package in server components
  serverExternalPackages: ["highlight.js"],
};

export default nextConfig;
