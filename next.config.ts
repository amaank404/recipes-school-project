import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/app",
        permanent: false,
      },
      {
        source: "/app",
        destination: "/app/homepage",
        permanent: false,
      },
    ];
  },

  async rewrites() {
    return [
      { source: "/api/:path*", destination: process.env.NODE_ENV === 'development'
        ? 'http://127.0.0.1:9422/api/:path*'
        : '/api/' ,}
    ]
  }
};

export default nextConfig;
