# Executive State 2.0 website contract

Peak OS SQLite is authoritative. The website stores only the latest valid, sanitized projection;
it never reads SQLite or computes an independent research, learning, business, system, or priority
judgment.

The TypeScript contract is in `src/lib/peak/executive-types.ts`, with strict bounded validation in
`src/lib/peak/executive-validation.ts`. Required top-level fields are:

- `schema_version: "2.0"`;
- `state_hash`: the semantic SHA-256 supplied by Peak OS;
- UTC `generated_at` and an explicit timezone;
- `overall`, `research`, `japanese`, `business`, and `system` states;
- optional `chief` coordination state, represented explicitly as an object or `null`;
- `today`, typed changes, opportunities, and confidence limits.

Unknown top-level or nested fields are rejected. Unsupported versions are rejected rather than
coerced. A failed upload never replaces the last-known-good record.

Domain scores are integers from 0–100 or `null`; overall confidence is a value from 0–1 or
`null`. `null` means unscored and is never converted to zero. Domain status is one of `stable`,
`attention`, `critical`, `deferred`, or `unknown`.

Agent state explicitly distinguishes `not_scheduled`, `scheduled_not_run`, `running`,
`completed_successfully`, `completed_with_findings`, `failed`, `stale`, and `unknown`. Evidence
records include a source, bounded summary, verification status, timestamp, and optional record
identifier.

The Portfolio Chief projection includes its cycle and decision hashes, lifecycle state, primary
focus, rationale, `operating_constraint`, optional owner action, up to two bounded work orders,
deferred count, and next check time. The website presents this state but does not recalculate it.

The signed request uses these headers:

```text
X-Peak-Timestamp: Unix seconds
X-Peak-Nonce: 32 lowercase hex characters
X-Peak-Signature: HMAC-SHA256(timestamp + "." + nonce + "." + exact body)
```

The server validates clock skew, signature, nonce replay, byte limit, and the entire schema before
atomically replacing `peak/executive/v2/latest.json` in private Blob storage.
