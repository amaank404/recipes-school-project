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
      { source: "/static/image_api/:path*", destination: ( process.env.API_BASE || "http://localhost:9422/" ) + "/static/image/:path*"  ,}
    ]
  }
};

export default nextConfig;
