import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
        port: "7282",
        pathname: "/**",
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
  experimental: {
    browserDebugInfoInTerminal: true,
  },
};

export default nextConfig;
