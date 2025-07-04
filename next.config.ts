import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    useCache: true,
    dynamicIO: true,
    ppr: true,
  },
};

export default nextConfig;
