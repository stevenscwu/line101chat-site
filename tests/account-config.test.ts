import { afterEach, describe, expect, it, vi } from "vitest";
import nextConfig from "../next.config";
import { readAccountConfig } from "../src/lib/account-config";

afterEach(() => vi.unstubAllEnvs());
describe("account public configuration and content security", () => {
  it("returns only the verified origin and publishable key from server environment", () => {
    const output = readAccountConfig({ ACCOUNT_BACKEND: "supabase", SUPABASE_URL: "https://config-tests.supabase.co",
      SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test", SECRET_UNRELATED: "not-for-browser" });
    expect(output).toEqual({ url: "https://config-tests.supabase.co", publishableKey: "sb_publishable_test" });
  });
  it("adds only the configured Auth subtree to CSP and keeps account HTML uncacheable", async () => {
    vi.stubEnv("ACCOUNT_BACKEND", "supabase"); vi.stubEnv("SUPABASE_URL", "https://config-tests.supabase.co");
    vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");
    const headers = await nextConfig.headers!();
    const csp = headers[0].headers.find((entry) => entry.key === "Content-Security-Policy")!.value;
    expect(csp).toContain("connect-src 'self' https://config-tests.supabase.co/auth/v1/;");
    expect(csp).not.toContain("sb_publishable_");
    expect(headers.find((entry) => entry.source === "/account/:path*")?.headers).toContainEqual({ key: "Cache-Control", value: "private, no-store" });
  });
  it("does not open outbound Auth connections for disabled or privileged-key configuration", async () => {
    vi.stubEnv("ACCOUNT_BACKEND", "supabase"); vi.stubEnv("SUPABASE_URL", "https://config-tests.supabase.co");
    vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "sb_secret_never_allowed");
    const headers = await nextConfig.headers!();
    expect(headers[0].headers.find((entry) => entry.key === "Content-Security-Policy")!.value).toContain("connect-src 'self';");
  });
});
