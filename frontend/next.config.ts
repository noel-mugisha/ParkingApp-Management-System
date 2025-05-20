import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    API_URL: process.env.API_URL
  },
  images: {
    domains: ['eu.ui-avatars.com'],
    unoptimized: true,
  },
};

export default nextConfig;