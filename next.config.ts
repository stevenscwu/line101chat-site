import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  outputFileTracingIncludes: {
    "/api/avatar/chat": ["./content/avatar/knowledge/**/*.md"],
    "/api/celine/chat": ["./content/avatar/knowledge/**/*.md"],
    "/api/line/avatar-webhook": ["./content/avatar/knowledge/**/*.md"],
  },
};

export default nextConfig;
