import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  reactStrictMode: true,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  // react compiler its bullshit.
};

export default nextConfig;
