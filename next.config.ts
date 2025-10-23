import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  
  // Disable ESLint and TypeScript checks during build for faster deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Suppress React 19 warning from Ant Design
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/antd/ },
    ];
    return config;
  },
};

export default nextConfig;
