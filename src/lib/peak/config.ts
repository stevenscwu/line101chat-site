const truthy = new Set(["1", "true", "yes", "on"]);

export function isPeakDashboardEnabled() {
  return truthy.has((process.env.PEAK_DASHBOARD_ENABLED || "").trim().toLowerCase());
}

export function getOwnerEmails() {
  return new Set(
    (process.env.PEAK_DASHBOARD_OWNER_EMAILS || "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function requirePeakServerConfig() {
  if (!isPeakDashboardEnabled()) throw new Error("Peak dashboard is disabled.");
  const ownerEmails = getOwnerEmails();
  const passwordHash = process.env.PEAK_DASHBOARD_PASSWORD_HASH?.trim();
  const sessionSecret = process.env.PEAK_DASHBOARD_SESSION_SECRET?.trim();
  if (!ownerEmails.size || !passwordHash || !sessionSecret || sessionSecret.length < 32) {
    throw new Error("Peak dashboard authentication is not configured.");
  }
  return { ownerEmails, passwordHash, sessionSecret };
}

export function getPeakRedisConfig() {
  const url =
    process.env.PEAK_DASHBOARD_UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.KV_REST_API_URL?.trim();
  const token =
    process.env.PEAK_DASHBOARD_UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.KV_REST_API_TOKEN?.trim();
  return url && token ? { url, token } : null;
}

export function requireSyncSecret() {
  const secret = process.env.PEAK_DASHBOARD_SYNC_SECRET?.trim();
  if (!secret || secret.length < 32) throw new Error("Peak dashboard sync is not configured.");
  return secret;
}
