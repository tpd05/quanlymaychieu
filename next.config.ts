import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  
  // Suppress React 19 warning from Ant Design
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/antd/ },
    ];
    return config;
  },
};

export default nextConfig;
