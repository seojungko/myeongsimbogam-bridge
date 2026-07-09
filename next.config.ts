import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  async headers() {
    const noStoreHeaders = [
      {
        key: "Cache-Control",
        value: "no-store, max-age=0, must-revalidate"
      }
    ];

    return [
      {
        source: "/",
        headers: noStoreHeaders
      },
      {
        source: "/study",
        headers: noStoreHeaders
      },
      {
        source: "/enter",
        headers: noStoreHeaders
      },
      {
        source: "/dev/:path*",
        headers: noStoreHeaders
      },
      {
        source: "/sw.js",
        headers: noStoreHeaders
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, max-age=0, must-revalidate"
          }
        ]
      },
      {
        source: "/.well-known/assetlinks.json",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, max-age=0, must-revalidate"
          },
          {
            key: "Content-Type",
            value: "application/json; charset=utf-8"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
