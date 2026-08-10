import type {
  ChiefState,
  ChiefWorkOrder,
  DomainBase,
  ExecutiveAgent,
  ExecutiveEvidence,
  ExecutiveState,
  ExecutiveStatus,
} from "@/lib/peak/executive-types";

type RecordValue = Record<string, unknown>;

const record = (value: unknown): value is RecordValue =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const exactKeys = (value: unknown, keys: readonly string[]): value is RecordValue =>
  record(value) &&
  Object.keys(value).length === keys.length &&
  keys.every((key) => Object.prototype.hasOwnProperty.call(value, key));
const text = (value: unknown, maximum = 1_000) =>
  typeof value === "string" && value.length <= maximum ? value : null;
const requiredText = (value: unknown, maximum = 1_000) => {
  const result = text(value, maximum);
  return result !== null && result.length > 0 ? result : null;
};
const nullableText = (value: unknown, maximum = 1_000): string | null | undefined =>
  value === null ? null : text(value, maximum) ?? undefined;
const iso = (value: unknown) => {
  const result = requiredText(value, 64);
  return result && Number.isFinite(Date.parse(result)) ? result : null;
};
const nullableIso = (value: unknown): string | null | undefined =>
  value === null ? null : iso(value) ?? undefined;
const oneOf = <T extends string>(value: unknown, values: readonly T[]) =>
  typeof value === "string" && values.includes(value as T) ? (value as T) : null;
const status = (value: unknown) =>
  oneOf(value, ["stable", "attention", "critical", "deferred", "unknown"] as const);
const agentState = (value: unknown) =>
  oneOf(
    value,
    [
      "not_scheduled",
      "scheduled_not_run",
      "running",
      "completed_successfully",
      "completed_with_findings",
      "failed",
      "stale",
      "unknown",
    ] as const,
  );
const score = (value: unknown) =>
  value === null
    ? null
    : typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 100
      ? value
      : undefined;
const confidenceScore = (value: unknown) =>
  value === null
    ? null
    : typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1
      ? value
      : undefined;
const strings = (value: unknown, maximum = 20, length = 500): string[] | null => {
  if (!Array.isArray(value) || value.length > maximum) return null;
  const parsed = value.map((item) => text(item, length));
  return parsed.some((item) => item === null) ? null : (parsed as string[]);
};
const mapped = <T>(
  value: unknown,
  maximum: number,
  parser: (item: unknown) => T | null,
): T[] | null => {
  if (!Array.isArray(value) || value.length > maximum) return null;
  const parsed = value.map(parser);
  return parsed.some((item) => item === null) ? null : (parsed as T[]);
};

const DOMAIN_KEYS = [
  "status",
  "score",
  "summary",
  "evidence",
  "last_successful_activity_at",
  "warnings",
  "next_action",
] as const;

function evidence(value: unknown): ExecutiveEvidence | null {
  if (!exactKeys(value, ["source", "summary", "status", "observed_at", "record_id"])) {
    return null;
  }
  const source = requiredText(value.source, 100);
  const summary = requiredText(value.summary, 500);
  const evidenceStatus = oneOf(
    value.status,
    ["verified", "reported", "preliminary", "stale", "missing"] as const,
  );
  const observedAt = nullableIso(value.observed_at);
  const recordId = nullableText(value.record_id, 200);
  return source && summary && evidenceStatus && observedAt !== undefined && recordId !== undefined
    ? {
        source,
        summary,
        status: evidenceStatus,
        observed_at: observedAt,
        record_id: recordId,
      }
    : null;
}

function domain(value: unknown, extraKeys: readonly string[] = []): DomainBase | null {
  if (!exactKeys(value, [...DOMAIN_KEYS, ...extraKeys])) return null;
  const domainStatus = status(value.status);
  const domainScore = score(value.score);
  const summary = requiredText(value.summary, 1_000);
  const entries = mapped(value.evidence, 20, evidence);
  const warnings = strings(value.warnings, 20, 500);
  const nextAction = text(value.next_action, 700);
  const last = nullableIso(value.last_successful_activity_at);
  if (
    !domainStatus ||
    domainScore === undefined ||
    !summary ||
    !entries ||
    !warnings ||
    nextAction === null ||
    last === undefined
  ) {
    return null;
  }
  return {
    status: domainStatus,
    score: domainScore,
    summary,
    evidence: entries,
    last_successful_activity_at: last,
    warnings,
    next_action: nextAction,
  };
}

function agent(value: unknown): ExecutiveAgent | null {
  if (
    !exactKeys(value, [
      "name",
      "state",
      "last_scheduled_run",
      "last_actual_run",
      "last_success",
      "duration_seconds",
      "latest_result",
      "failure_reason",
      "next_scheduled_run",
    ])
  ) {
    return null;
  }
  const name = requiredText(value.name, 100);
  const state = agentState(value.state);
  const duration =
    value.duration_seconds === null
      ? null
      : typeof value.duration_seconds === "number" &&
          Number.isFinite(value.duration_seconds) &&
          value.duration_seconds >= 0
        ? value.duration_seconds
        : undefined;
  const latest = text(value.latest_result, 700);
  const failure = nullableText(value.failure_reason, 300);
  const scheduled = nullableIso(value.last_scheduled_run);
  const actual = nullableIso(value.last_actual_run);
  const success = nullableIso(value.last_success);
  const next = nullableIso(value.next_scheduled_run);
  return name &&
    state &&
    duration !== undefined &&
    latest !== null &&
    failure !== undefined &&
    scheduled !== undefined &&
    actual !== undefined &&
    success !== undefined &&
    next !== undefined
    ? {
        name,
        state,
        last_scheduled_run: scheduled,
        last_actual_run: actual,
        last_success: success,
        duration_seconds: duration,
        latest_result: latest,
        failure_reason: failure,
        next_scheduled_run: next,
      }
    : null;
}

function audit(value: unknown): ExecutiveState["system"]["audits"][number] | null {
  if (!exactKeys(value, ["audit_id", "status", "scheduled_for", "completed_at"])) return null;
  const auditId = requiredText(value.audit_id, 200);
  const auditStatus = requiredText(value.status, 100);
  const scheduledFor = iso(value.scheduled_for);
  const completedAt = nullableIso(value.completed_at);
  return auditId && auditStatus && scheduledFor && completedAt !== undefined
    ? {
        audit_id: auditId,
        status: auditStatus,
        scheduled_for: scheduledFor,
        completed_at: completedAt,
      }
    : null;
}

function workOrder(value: unknown): ChiefWorkOrder | null {
  if (
    !exactKeys(value, [
      "order_id",
      "pm_name",
      "action",
      "reason_code",
      "status",
      "materiality",
      "issued_at",
      "updated_at",
      "failure_reason",
    ])
  ) {
    return null;
  }
  const orderId = requiredText(value.order_id, 100);
  const pmName = requiredText(value.pm_name, 100);
  const action = requiredText(value.action, 700);
  const reasonCode = requiredText(value.reason_code, 100);
  const orderStatus = oneOf(
    value.status,
    ["issued_unclaimed", "claimed", "running", "completed", "failed", "cancelled"] as const,
  );
  const materiality = oneOf(value.materiality, ["routine", "material", "critical"] as const);
  const issuedAt = iso(value.issued_at);
  const updatedAt = iso(value.updated_at);
  const failureReason = nullableText(value.failure_reason, 100);
  return orderId &&
    pmName &&
    action &&
    reasonCode &&
    orderStatus &&
    materiality &&
    issuedAt &&
    updatedAt &&
    failureReason !== undefined
    ? {
        order_id: orderId,
        pm_name: pmName,
        action,
        reason_code: reasonCode,
        status: orderStatus,
        materiality,
        issued_at: issuedAt,
        updated_at: updatedAt,
        failure_reason: failureReason,
      }
    : null;
}

function chief(value: unknown): ChiefState | null {
  if (
    !exactKeys(value, [
      "cycle_id",
      "decision_hash",
      "state",
      "summary",
      "primary_focus",
      "rationale",
      "operating_constraint",
      "last_cycle_at",
      "owner_action",
      "work_orders",
      "deferred_count",
      "next_check_at",
    ])
  ) {
    return null;
  }
  const cycleId = requiredText(value.cycle_id, 100);
  const decisionHash = requiredText(value.decision_hash, 64);
  const state = agentState(value.state);
  const summary = requiredText(value.summary, 1_000);
  const primaryFocus = requiredText(value.primary_focus, 1_000);
  const rationale = requiredText(value.rationale, 1_000);
  const operatingConstraint = requiredText(value.operating_constraint, 700);
  const lastCycleAt = iso(value.last_cycle_at);
  const ownerAction = text(value.owner_action, 700);
  const workOrders = mapped(value.work_orders, 2, workOrder);
  const deferredCount =
    typeof value.deferred_count === "number" &&
    Number.isInteger(value.deferred_count) &&
    value.deferred_count >= 0 &&
    value.deferred_count <= 10
      ? value.deferred_count
      : null;
  const nextCheckAt = nullableIso(value.next_check_at);
  return cycleId &&
    decisionHash &&
    /^[a-f0-9]{64}$/u.test(decisionHash) &&
    state &&
    summary &&
    primaryFocus &&
    rationale &&
    operatingConstraint &&
    lastCycleAt &&
    ownerAction !== null &&
    workOrders &&
    deferredCount !== null &&
    nextCheckAt !== undefined
    ? {
        cycle_id: cycleId,
        decision_hash: decisionHash,
        state,
        summary,
        primary_focus: primaryFocus,
        rationale,
        operating_constraint: operatingConstraint,
        last_cycle_at: lastCycleAt,
        owner_action: ownerAction,
        work_orders: workOrders,
        deferred_count: deferredCount,
        next_check_at: nextCheckAt,
      }
    : null;
}

function scheduleItem(value: unknown): ExecutiveState["today"]["schedule"][number] | null {
  if (!exactKeys(value, ["label", "scheduled_at", "state"])) return null;
  const label = requiredText(value.label, 200);
  const scheduledAt = requiredText(value.scheduled_at, 100);
  const state = agentState(value.state);
  return label && scheduledAt && state ? { label, scheduled_at: scheduledAt, state } : null;
}

function change(value: unknown): ExecutiveState["changes_since_previous"][number] | null {
  if (!exactKeys(value, ["domain", "kind", "summary", "previous", "current", "observed_at"])) {
    return null;
  }
  const domainName = requiredText(value.domain, 100);
  const kind = oneOf(value.kind, ["improved", "declined", "changed", "new", "resolved"] as const);
  const summary = requiredText(value.summary, 500);
  const previous = nullableText(value.previous, 500);
  const current = nullableText(value.current, 500);
  const observedAt = iso(value.observed_at);
  return domainName &&
    kind &&
    summary &&
    previous !== undefined &&
    current !== undefined &&
    observedAt
    ? { domain: domainName, kind, summary, previous, current, observed_at: observedAt }
    : null;
}

export function parseExecutiveState(value: unknown): ExecutiveState | null {
  if (
    !exactKeys(value, [
      "schema_version",
      "state_hash",
      "generated_at",
      "timezone",
      "overall",
      "research",
      "japanese",
      "business",
      "system",
      "chief",
      "today",
      "changes_since_previous",
      "opportunities",
      "confidence",
    ]) ||
    value.schema_version !== "2.0"
  ) {
    return null;
  }

  const stateHash = requiredText(value.state_hash, 64);
  const generatedAt = iso(value.generated_at);
  const timezone = requiredText(value.timezone, 100);
  if (
    !stateHash ||
    !/^[a-f0-9]{64}$/u.test(stateHash) ||
    !generatedAt ||
    !timezone ||
    !exactKeys(value.overall, ["score", "status", "summary"])
  ) {
    return null;
  }

  const overallStatus = status(value.overall.status);
  const overallScore = score(value.overall.score);
  const overallSummary = requiredText(value.overall.summary, 1_000);
  const researchBase = domain(value.research, [
    "current_focus",
    "progress",
    "blockers",
    "last_successful_run",
  ]);
  const japaneseBase = domain(value.japanese, ["recent_activity"]);
  const businessBase = domain(value.business, ["opportunities"]);
  const systemBase = domain(value.system, ["agents", "audits", "failures"]);
  if (
    !overallStatus ||
    overallScore === undefined ||
    !overallSummary ||
    !researchBase ||
    !japaneseBase ||
    !businessBase ||
    !systemBase ||
    !record(value.research) ||
    !record(value.japanese) ||
    !record(value.business) ||
    !record(value.system) ||
    !exactKeys(value.today, [
      "primary_focus",
      "rationale",
      "estimated_effort_minutes",
      "recommended_actions",
      "schedule",
      "biggest_opportunity",
    ]) ||
    !exactKeys(value.confidence, ["overall", "missing_inputs", "stale_inputs"])
  ) {
    return null;
  }

  const focus = text(value.research.current_focus, 1_000);
  const progress = strings(value.research.progress, 20, 500);
  const blockers = strings(value.research.blockers, 20, 500);
  const lastRun = nullableIso(value.research.last_successful_run);
  const recentActivity = strings(value.japanese.recent_activity, 12, 500);
  const businessOpportunities = strings(value.business.opportunities, 12, 500);
  const audits = mapped(value.system.audits, 12, audit);
  const failures = strings(value.system.failures, 20, 500);
  const agents = mapped(value.system.agents, 20, agent);
  const chiefState = value.chief === null ? null : chief(value.chief);
  const primaryFocus = text(value.today.primary_focus, 1_000);
  const rationale = text(value.today.rationale, 1_000);
  const biggestOpportunity = text(value.today.biggest_opportunity, 700);
  const estimated =
    value.today.estimated_effort_minutes === null
      ? null
      : typeof value.today.estimated_effort_minutes === "number" &&
          Number.isInteger(value.today.estimated_effort_minutes) &&
          value.today.estimated_effort_minutes >= 1 &&
          value.today.estimated_effort_minutes <= 1_440
        ? value.today.estimated_effort_minutes
        : undefined;
  const actions = strings(value.today.recommended_actions, 10, 1_000);
  const schedule = mapped(value.today.schedule, 12, scheduleItem);
  const changes = mapped(value.changes_since_previous, 30, change);
  const opportunities = strings(value.opportunities, 20, 500);
  const confidenceOverall = confidenceScore(value.confidence.overall);
  const missing = strings(value.confidence.missing_inputs, 30, 500);
  const stale = strings(value.confidence.stale_inputs, 30, 500);
  if (
    focus === null ||
    !progress ||
    !blockers ||
    lastRun === undefined ||
    !recentActivity ||
    !businessOpportunities ||
    !audits ||
    !failures ||
    !agents ||
    (value.chief !== null && !chiefState) ||
    primaryFocus === null ||
    rationale === null ||
    biggestOpportunity === null ||
    estimated === undefined ||
    !actions ||
    !schedule ||
    !changes ||
    !opportunities ||
    confidenceOverall === undefined ||
    !missing ||
    !stale
  ) {
    return null;
  }

  return {
    schema_version: "2.0",
    state_hash: stateHash,
    generated_at: generatedAt,
    timezone,
    overall: {
      score: overallScore,
      status: overallStatus as ExecutiveStatus,
      summary: overallSummary,
    },
    research: {
      ...researchBase,
      current_focus: focus,
      progress,
      blockers,
      last_successful_run: lastRun,
    },
    japanese: { ...japaneseBase, recent_activity: recentActivity },
    business: { ...businessBase, opportunities: businessOpportunities },
    system: { ...systemBase, agents, audits, failures },
    chief: chiefState,
    today: {
      primary_focus: primaryFocus,
      rationale,
      estimated_effort_minutes: estimated,
      recommended_actions: actions,
      schedule,
      biggest_opportunity: biggestOpportunity,
    },
    changes_since_previous: changes,
    opportunities,
    confidence: { overall: confidenceOverall, missing_inputs: missing, stale_inputs: stale },
  };
}
