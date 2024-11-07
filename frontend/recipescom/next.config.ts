import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/app",
        permanent: false
      },
      {
        source: "/app",
        destination: "/app/homepage",
        permanent: false
      }
    ]
  }
};

export default nextConfig;