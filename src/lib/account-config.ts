/** Public connection information only. Never return the environment itself or
 * accept a secret/service-role key as a browser or learner API credential.
 */
export type PublicAccountConfig = Readonly<{ url: string; publishableKey: string }>;

export function readAccountConfig(env: Record<string, string | undefined>): PublicAccountConfig | null {
  if (env.ACCOUNT_BACKEND !== "supabase") return null;
  const key = env.SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!key || !/^sb_publishable_[A-Za-z0-9_-]+$/.test(key)) return null;
  try {
    const url = new URL(env.SUPABASE_URL ?? "");
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/") return null;
    return Object.freeze({ url: url.origin, publishableKey: key });
  } catch { return null; }
}
