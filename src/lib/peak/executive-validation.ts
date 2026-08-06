import type {
  AgentRunState,
  DomainBase,
  ExecutiveAgent,
  ExecutiveEvidence,
  ExecutiveState,
  ExecutiveStatus,
} from "@/lib/peak/executive-types";

type RecordValue = Record<string, unknown>;
const record = (value: unknown): value is RecordValue => typeof value === "object" && value !== null && !Array.isArray(value);
const text = (value: unknown, maximum = 1_000) => typeof value === "string" && value.length <= maximum ? value : null;
const nullableText = (value: unknown, maximum = 1_000): string | null | undefined => value === null ? null : text(value, maximum) ?? undefined;
const iso = (value: unknown) => { const result = text(value, 64); return result && Number.isFinite(Date.parse(result)) ? result : null; };
const nullableIso = (value: unknown): string | null | undefined => value === null ? null : iso(value) ?? undefined;
const oneOf = <T extends string>(value: unknown, values: readonly T[]) => typeof value === "string" && values.includes(value as T) ? value as T : null;
const status = (value: unknown) => oneOf(value, ["stable", "attention", "critical", "recovery", "deferred", "unknown"] as const);
const score = (value: unknown) => value === null ? null : typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 100 ? value : undefined;
const confidenceScore = (value: unknown) => value === null ? null : typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1 ? value : undefined;
const strings = (value: unknown, maximum = 20, length = 500) => Array.isArray(value) && value.length <= maximum
  ? value.map((item) => text(item, length)).filter((item): item is string => item !== null)
  : null;

function evidence(value: unknown): ExecutiveEvidence | null {
  if (!record(value)) return null;
  const source = text(value.source, 100); const summary = text(value.summary, 500);
  const evidenceStatus = oneOf(value.status, ["verified", "reported", "preliminary", "stale", "missing"] as const);
  const observedAt = nullableIso(value.observed_at); const recordId = nullableText(value.record_id, 200);
  return source !== null && source.length > 0 && summary !== null && summary.length > 0 && evidenceStatus && observedAt !== undefined && recordId !== undefined
    ? { source, summary, status: evidenceStatus, observed_at: observedAt, record_id: recordId }
    : null;
}

function domain(value: unknown): DomainBase | null {
  if (!record(value)) return null;
  const domainStatus = status(value.status); const domainScore = score(value.score); const summary = text(value.summary, 1_000);
  const entries = Array.isArray(value.evidence) && value.evidence.length <= 20 ? value.evidence.map(evidence) : null;
  const warnings = strings(value.warnings, 20, 500); const nextAction = text(value.next_action, 500);
  const last = nullableIso(value.last_successful_activity_at);
  if (!domainStatus || domainScore === undefined || summary === null || !entries || entries.some((item) => !item) || !warnings || nextAction === null || last === undefined) return null;
  return { status: domainStatus, score: domainScore, summary, evidence: entries as ExecutiveEvidence[], last_successful_activity_at: last, warnings, next_action: nextAction };
}

function agent(value: unknown): ExecutiveAgent | null {
  if (!record(value)) return null;
  const name = text(value.name, 100);
  const state = oneOf(value.state, ["not_scheduled", "scheduled_not_run", "running", "completed_successfully", "completed_with_findings", "failed", "stale", "unknown"] as const) as AgentRunState | null;
  const duration = value.duration_seconds === null ? null : typeof value.duration_seconds === "number" && Number.isFinite(value.duration_seconds) && value.duration_seconds >= 0 ? value.duration_seconds : undefined;
  const latest = text(value.latest_result, 1_000); const failure = nullableText(value.failure_reason, 500);
  const scheduled = nullableIso(value.last_scheduled_run); const actual = nullableIso(value.last_actual_run); const success = nullableIso(value.last_success); const next = nullableIso(value.next_scheduled_run);
  return name && state && duration !== undefined && latest !== null && failure !== undefined && scheduled !== undefined && actual !== undefined && success !== undefined && next !== undefined
    ? { name, state, last_scheduled_run: scheduled, last_actual_run: actual, last_success: success, duration_seconds: duration, latest_result: latest, failure_reason: failure, next_scheduled_run: next }
    : null;
}

function audit(value: unknown) {
  if (!record(value)) return null;
  const auditId = text(value.audit_id, 200); const auditStatus = text(value.status, 100); const scheduledFor = iso(value.scheduled_for); const completedAt = nullableIso(value.completed_at);
  return auditId && auditStatus && scheduledFor && completedAt !== undefined
    ? { audit_id: auditId, status: auditStatus, scheduled_for: scheduledFor, completed_at: completedAt }
    : null;
}

export function parseExecutiveState(value: unknown): ExecutiveState | null {
  if (!record(value) || value.schema_version !== "1.0") return null;
  const stateHash = text(value.state_hash, 64);
  const generatedAt = iso(value.generated_at); const timezone = text(value.timezone, 80);
  if (!stateHash || !/^[a-f0-9]{64}$/u.test(stateHash) || !generatedAt || !timezone || !record(value.overall)) return null;
  const overallStatus = status(value.overall.status); const overallScore = score(value.overall.score); const overallSummary = text(value.overall.summary, 1_000);
  const healthBase = domain(value.health); const researchBase = domain(value.research); const japaneseBase = domain(value.japanese); const businessBase = domain(value.business); const systemBase = domain(value.system);
  if (!overallStatus || overallScore === undefined || overallSummary === null || !healthBase || !researchBase || !japaneseBase || !businessBase || !systemBase || !record(value.health) || !record(value.research) || !record(value.japanese) || !record(value.business) || !record(value.system) || !record(value.today) || !record(value.confidence)) return null;
  const riskFlags = strings(value.health.risk_flags); const recommendation = text(value.health.recommendation, 1_000);
  const focus = text(value.research.current_focus, 500); const progress = strings(value.research.progress); const blockers = strings(value.research.blockers); const lastRun = nullableIso(value.research.last_successful_run);
  const recentActivity = strings(value.japanese.recent_activity); const businessOpportunities = strings(value.business.opportunities);
  const audits = Array.isArray(value.system.audits) && value.system.audits.length <= 12 ? value.system.audits.map(audit) : null;
  const failures = strings(value.system.failures);
  const agents = Array.isArray(value.system.agents) && value.system.agents.length <= 30 ? value.system.agents.map(agent) : null;
  const primaryFocus = text(value.today.primary_focus, 500); const rationale = text(value.today.rationale, 1_000); const biggestRisk = text(value.today.biggest_risk, 500); const biggestOpportunity = text(value.today.biggest_opportunity, 500);
  const estimated = value.today.estimated_effort_minutes === null ? null : typeof value.today.estimated_effort_minutes === "number" && Number.isInteger(value.today.estimated_effort_minutes) && value.today.estimated_effort_minutes >= 1 && value.today.estimated_effort_minutes <= 1_440 ? value.today.estimated_effort_minutes : undefined;
  const actions = strings(value.today.recommended_actions, 10, 1_000);
  const schedule = Array.isArray(value.today.schedule) && value.today.schedule.length <= 12 ? value.today.schedule.map((item) => {
    if (!record(item)) return null; const label = text(item.label, 200); const scheduledAt = text(item.scheduled_at, 100); const scheduleState = oneOf(item.state, ["not_scheduled", "scheduled_not_run", "running", "completed_successfully", "completed_with_findings", "failed", "stale", "unknown"] as const);
    return label && scheduledAt && scheduleState ? { label, scheduled_at: scheduledAt, state: scheduleState } : null;
  }) : null;
  const changes = Array.isArray(value.changes_since_previous) && value.changes_since_previous.length <= 30 ? value.changes_since_previous.map((item) => {
    if (!record(item)) return null; const domainName = text(item.domain, 100); const summary = text(item.summary, 500); const kind = oneOf(item.kind, ["improved", "declined", "changed", "new", "resolved"] as const); const previous = nullableText(item.previous, 500); const current = nullableText(item.current, 500); const observedAt = iso(item.observed_at);
    return domainName !== null && summary !== null && kind && previous !== undefined && current !== undefined && observedAt ? { domain: domainName, kind, summary, previous, current, observed_at: observedAt } : null;
  }) : null;
  const risks = strings(value.risks); const opportunities = strings(value.opportunities);
  const confidenceOverall = confidenceScore(value.confidence.overall); const missing = strings(value.confidence.missing_inputs, 30); const stale = strings(value.confidence.stale_inputs, 30);
  if (!riskFlags || recommendation === null || focus === null || !progress || !blockers || lastRun === undefined || !recentActivity || !businessOpportunities || !audits || audits.some((item) => !item) || !failures || !agents || agents.some((item) => !item) || primaryFocus === null || rationale === null || biggestRisk === null || biggestOpportunity === null || estimated === undefined || !actions || !schedule || schedule.some((item) => !item) || !changes || changes.some((item) => !item) || !risks || !opportunities || confidenceOverall === undefined || !missing || !stale) return null;
  return {
    schema_version: "1.0", state_hash: stateHash, generated_at: generatedAt, timezone,
    overall: { score: overallScore, status: overallStatus as ExecutiveStatus, summary: overallSummary },
    health: { ...healthBase, risk_flags: riskFlags, recommendation },
    research: { ...researchBase, current_focus: focus, progress, blockers, last_successful_run: lastRun },
    japanese: { ...japaneseBase, recent_activity: recentActivity },
    business: { ...businessBase, opportunities: businessOpportunities },
    system: { ...systemBase, agents: agents as ExecutiveAgent[], audits: audits as ExecutiveState["system"]["audits"], failures },
    today: { primary_focus: primaryFocus, rationale, estimated_effort_minutes: estimated, recommended_actions: actions, schedule: schedule as ExecutiveState["today"]["schedule"], biggest_risk: biggestRisk, biggest_opportunity: biggestOpportunity },
    changes_since_previous: changes as ExecutiveState["changes_since_previous"], risks, opportunities,
    confidence: { overall: confidenceOverall, missing_inputs: missing, stale_inputs: stale },
  };
}
