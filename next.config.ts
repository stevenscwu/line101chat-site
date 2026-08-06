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
  async headers() {
    const privateHeaders = [
      { key: "Cache-Control", value: "private, no-store, max-age=0" },
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    return [
      { source: "/peak/:path*", headers: privateHeaders },
      { source: "/peak-os/:path*", headers: privateHeaders },
      { source: "/api/peak/:path*", headers: privateHeaders },
    ];
  },
};

export default nextConfig;
