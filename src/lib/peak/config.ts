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

export function getSingleOwnerEmail() {
  const ownerEmails = [...getOwnerEmails()];
  return ownerEmails.length === 1 ? ownerEmails[0] : "";
}

export function requirePeakSessionConfig() {
  if (!isPeakDashboardEnabled()) throw new Error("Peak dashboard is disabled.");
  const ownerEmails = getOwnerEmails();
  const sessionSecret = process.env.PEAK_DASHBOARD_SESSION_SECRET?.trim();
  if (!ownerEmails.size || !sessionSecret || sessionSecret.length < 32) {
    throw new Error("Peak dashboard sessions are not configured.");
  }
  return { ownerEmails, sessionSecret };
}

export function requirePeakPasswordConfig() {
  const session = requirePeakSessionConfig();
  const passwordHash = process.env.PEAK_DASHBOARD_PASSWORD_HASH?.trim();
  if (!passwordHash || !/^pbkdf2-sha512\$\d+\$[A-Za-z0-9_-]+\$[A-Za-z0-9_-]+$/u.test(passwordHash)) {
    throw new Error("Peak dashboard password login is not configured.");
  }
  return { ...session, passwordHash };
}

export function requirePeakServerConfig() {
  return requirePeakPasswordConfig();
}

export function hasPeakPrivateBlobConfig() {
  const staticToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  const oidcToken = process.env.VERCEL_OIDC_TOKEN?.trim();
  const storeId = process.env.BLOB_STORE_ID?.trim();
  return Boolean(staticToken || (oidcToken && storeId));
}

export function requireSyncSecret() {
  const secret = process.env.PEAK_DASHBOARD_SYNC_SECRET?.trim();
  if (!secret || secret.length < 32) throw new Error("Peak dashboard sync is not configured.");
  return secret;
}

export function requireLoginSecret() {
  const secret = process.env.PEAK_DASHBOARD_LOGIN_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error("Peak dashboard Telegram login is not configured.");
  }
  return secret;
}
