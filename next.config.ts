import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: "/email",
        destination: "/mail",
        permanent: true,
      },
      {
        source: "/webmail",
        destination: "/mail",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
