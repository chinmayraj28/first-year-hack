import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ['convex'],
  // Turbopack configuration (Next.js 16+ uses Turbopack by default)
  turbopack: {},
};

export default nextConfig;
