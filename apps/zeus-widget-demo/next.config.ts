import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (!dev) {
      // [FIXME] swcMinify cause unknown error on build, disable it for now
      config.optimization.minimize = false;
    }
    return config;
  },
};

export default nextConfig;
