# Executive State 1.0 website contract

Peak OS SQLite is authoritative. The website stores only the latest valid, sanitized projection;
it never reads SQLite or computes an independent health, research, or priority judgment.

The TypeScript contract is in `src/lib/peak/executive-types.ts`, with strict bounded validation in
`src/lib/peak/executive-validation.ts`. Required top-level fields include:

- `schema_version: "1.0"`;
- `state_hash`: semantic SHA-256 supplied by Peak OS;
- UTC `generated_at` and an explicit timezone;
- overall, health, research, Japanese, business, and system states;
- today's focus and evidence-backed actions;
- typed changes from the previous semantic state;
- separate risks and opportunities; and
- confidence, missing inputs, and stale inputs.

Domain scores are integers from 0–100 or `null`; overall confidence is a value from 0–1 or
`null`. `null` means unscored; it is never converted to zero.
Agent state explicitly distinguishes `not_scheduled`, `scheduled_not_run`, `running`,
`completed_successfully`, `completed_with_findings`, `failed`, `stale`, and `unknown`.

Domain status is one of `stable`, `attention`, `critical`, `recovery`, `deferred`, or `unknown`.
Evidence records include source, summary, verification status, timestamp, and an optional record
identifier. Risks, opportunities, and recommended actions are bounded strings from the canonical
backend model; the website does not reinterpret them.

The signed request uses these headers:

```text
X-Peak-Timestamp: Unix seconds
X-Peak-Nonce: 32 lowercase hex characters
X-Peak-Signature: HMAC-SHA256(timestamp + "." + nonce + "." + exact body)
```

The server validates time skew, signature, nonce replay, byte limit, and the entire schema before
atomically replacing the last-known-good private record. Invalid input never replaces valid state.
