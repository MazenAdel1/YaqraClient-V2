import type { NextConfig } from "next";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

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
  logging: {
    browserToTerminal: true,
  },
};

export default nextConfig;
