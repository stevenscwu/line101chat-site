import "server-only";
import { createHash } from "node:crypto";

export type DashboardPermission = "product:manage" | "security:triage";

/** Returned only by a trusted server adapter after verifying the provider session/token.
 * The adapter must verify signature, issuer, audience, expiry and revocation; load
 * permissions from trusted server data, never request headers/body or editable metadata.
 */
export type VerifiedIdentity = Readonly<{
  issuer: string;
  subject: string;
  expiresAt: number;
  authentication: "session-cookie" | "bearer-token";
  permissions: readonly DashboardPermission[];
}>;

export type Authenticate = (request: Request) => Promise<VerifiedIdentity | null>;

export class AccountError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) {
    super(message);
    this.name = "AccountError";
  }
}

export function unavailable(): never {
  throw new AccountError(503, "ACCOUNT_SERVICE_UNAVAILABLE", "Account library is not available yet. Your device library is unchanged.");
}

/** A fixed-length owner namespace prevents collisions between identity providers.
 * This is a database partition key, not a credential or proof of authentication.
 */
export function ownerKey(identity: VerifiedIdentity): string {
  return createHash("sha256").update(JSON.stringify([identity.issuer, identity.subject])).digest("hex");
}

export async function requireIdentity(request: Request, authenticate: Authenticate, now = Date.now()): Promise<VerifiedIdentity> {
  const identity = await authenticate(request);
  if (!identity || typeof identity.issuer !== "string" || !identity.issuer.trim() || identity.issuer.length > 2048 ||
      typeof identity.subject !== "string" || !identity.subject.trim() || identity.subject.length > 512 ||
      !Number.isFinite(identity.expiresAt) || identity.expiresAt <= now ||
      !["session-cookie", "bearer-token"].includes(identity.authentication) || !Array.isArray(identity.permissions)) {
    throw new AccountError(401, "AUTHENTICATION_REQUIRED", "Sign in again to access your account library.");
  }
  return identity;
}

/** Cookie writes require same origin. Native Android bearer calls can omit Origin,
 * but only after a real bearer token has been verified by the server adapter.
 */
export function requireAccountWrite(request: Request, identity: VerifiedIdentity): void {
  const origin = request.headers.get("origin");
  const ownOrigin = new URL(request.url).origin;
  if (request.headers.get("sec-fetch-site") === "cross-site" || (origin !== null && origin !== ownOrigin) ||
      (identity.authentication === "session-cookie" && origin !== ownOrigin)) {
    throw new AccountError(403, "ORIGIN_NOT_ALLOWED", "Open this website to change your account library.");
  }
}

/** Separate explicit grants. There is intentionally no generic admin bypass.
 * Security/research additionally requires the one server-configured project owner.
 * Neither dashboard grant confers access to private learner lessons.
 */
export async function requireDashboardPermission(request: Request, authenticate: Authenticate, dashboard: "product" | "security", researchOwnerKey?: string): Promise<VerifiedIdentity> {
  const identity = await requireIdentity(request, authenticate);
  const permission: DashboardPermission = dashboard === "product" ? "product:manage" : "security:triage";
  if (!identity.permissions.includes(permission) || (dashboard === "security" &&
      (!researchOwnerKey || !/^[a-f0-9]{64}$/.test(researchOwnerKey) || ownerKey(identity) !== researchOwnerKey))) {
    throw new AccountError(403, "DASHBOARD_ACCESS_DENIED", "You do not have access to this dashboard.");
  }
  return identity;
}
