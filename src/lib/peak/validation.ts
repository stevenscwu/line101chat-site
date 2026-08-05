import type { Metric, PeakSnapshot, Priority } from "@/lib/peak/types";

type RecordValue = Record<string, unknown>;

const isRecord = (value: unknown): value is RecordValue =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const text = (value: unknown, max = 1_000) =>
  typeof value === "string" && value.length <= max ? value : null;
const nullableText = (value: unknown, max = 1_000) =>
  value === null ? null : text(value, max);
const iso = (value: unknown) => {
  const result = text(value, 64);
  return result && Number.isFinite(Date.parse(result)) ? result : null;
};
const nullableIso = (value: unknown) => (value === null ? null : iso(value));
const finite = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : null;
const oneOf = <T extends string>(value: unknown, options: readonly T[]): T | null =>
  typeof value === "string" && options.includes(value as T) ? (value as T) : null;

function metric(value: unknown): Metric | null {
  if (!isRecord(value)) return null;
  const state = oneOf(value.state, ["known", "unknown", "stale"] as const);
  const source =
    value.source === null
      ? null
      : oneOf(value.source, ["manual", "phone_imported", "combined", "unavailable"] as const);
  const numberValue = value.value === null ? null : finite(value.value);
  if (!state || (value.source !== null && !source) || (value.value !== null && numberValue === null)) return null;
  return {
    value: numberValue,
    unit: nullableText(value.unit, 32),
    scaleMaximum: value.scaleMaximum === null ? null : finite(value.scaleMaximum),
    state,
    source,
    observedAt: nullableIso(value.observedAt),
    reason: nullableText(value.reason, 300),
  };
}

function priority(value: unknown): Priority | null {
  if (!isRecord(value)) return null;
  const id = text(value.id, 160);
  const title = text(value.title, 300);
  const status = oneOf(value.status, ["open", "in_progress", "waiting", "completed", "cancelled"] as const);
  const priorityValue = finite(value.priority);
  const missionReason = text(value.missionReason, 300);
  if (!id || !title || !status || !missionReason || priorityValue === null || priorityValue < 1 || priorityValue > 5) return null;
  return {
    id,
    title,
    status,
    priority: priorityValue,
    projectId: nullableText(value.projectId, 160),
    missionReason,
    deadlineAt: nullableIso(value.deadlineAt),
  };
}

export function parsePeakSnapshot(value: unknown): PeakSnapshot | null {
  if (!isRecord(value) || value.schemaVersion !== 1) return null;
  const generatedAt = iso(value.generatedAt);
  const timezone = text(value.timezone, 80);
  const guidingQuestion = text(value.guidingQuestion, 500);
  if (!generatedAt || !timezone || !guidingQuestion || !isRecord(value.freshness) || !isRecord(value.wellbeing) || !isRecord(value.sustainability) || !isRecord(value.backup) || !isRecord(value.system)) return null;
  const freshnessState = oneOf(value.freshness.state, ["fresh", "stale", "unavailable", "error", "partial"] as const);
  const sleep = metric(value.wellbeing.sleep);
  const energy = metric(value.wellbeing.energy);
  const workload = metric(value.wellbeing.workload);
  const exercise = metric(value.wellbeing.exercise);
  const sustainabilityState = oneOf(value.sustainability.state, ["normal", "caution", "reduced", "recovery", "unknown"] as const);
  const evidenceFreshness = oneOf(value.sustainability.evidenceFreshness, ["fresh", "stale", "partial", "unavailable"] as const);
  const recommendation = text(value.sustainability.recommendation, 1_000);
  if (!freshnessState || !sleep || !energy || !workload || !exercise || !sustainabilityState || !evidenceFreshness || !recommendation) return null;

  const priorities = Array.isArray(value.priorities)
    ? value.priorities.slice(0, 4).map(priority)
    : [];
  if (priorities.some((item) => !item)) return null;
  const highest = value.highestLeverageAction === null ? null : priority(value.highestLeverageAction);
  if (value.highestLeverageAction !== null && !highest) return null;

  const projects = Array.isArray(value.projects) ? value.projects.slice(0, 12).map((item) => {
    if (!isRecord(item)) return null;
    const id = text(item.id, 160); const name = text(item.name, 160); const namespace = text(item.namespace, 80);
    const summary = text(item.summary, 500); const updatedAt = iso(item.updatedAt);
    return id && name && namespace && summary !== null && updatedAt ? {
      id, name, namespace, summary,
      nextAction: nullableText(item.nextAction, 300), blocker: nullableText(item.blocker, 300), updatedAt,
    } : null;
  }) : [];
  if (projects.some((item) => !item)) return null;

  let latestReflection: PeakSnapshot["latestReflection"] = null;
  if (value.latestReflection !== null) {
    if (!isRecord(value.latestReflection)) return null;
    const localDate = text(value.latestReflection.localDate, 10);
    const built = text(value.latestReflection.built, 1_000);
    const learned = text(value.latestReflection.learned, 1_000);
    const energyNote = text(value.latestReflection.energyNote, 1_000);
    const nextPeakAction = text(value.latestReflection.nextPeakAction, 1_000);
    const createdAt = iso(value.latestReflection.createdAt);
    if (!localDate || built === null || learned === null || energyNote === null || nextPeakAction === null || !createdAt) return null;
    latestReflection = { localDate, built, learned, energyNote, nextPeakAction, createdAt };
  }

  const week = Array.isArray(value.week) ? value.week.slice(0, 7).map((item) => {
    if (!isRecord(item)) return null;
    const localDate = text(item.localDate, 10);
    const sustainabilityState = oneOf(item.sustainabilityState, ["normal", "caution", "recovery", "unknown"] as const);
    const nullableNumber = (candidate: unknown) => candidate === null ? null : finite(candidate);
    if (!localDate || !sustainabilityState || typeof item.reflected !== "boolean") return null;
    return { localDate, sleepHours: nullableNumber(item.sleepHours), energy: nullableNumber(item.energy), workload: nullableNumber(item.workload), exerciseMinutes: nullableNumber(item.exerciseMinutes), sustainabilityState, reflected: item.reflected };
  }) : [];
  if (week.some((item) => !item)) return null;

  const backupState = oneOf(value.backup.state, ["not_configured", "configuration_incomplete", "encrypted_upload_complete", "restore_not_tested", "restore_overdue", "verified_recovery", "failed"] as const);
  const peakWorker = oneOf(value.system.peakWorker, ["running", "unknown"] as const);
  const database = oneOf(value.system.database, ["available", "unavailable"] as const);
  const telegram = oneOf(value.system.telegram, ["configured", "unknown"] as const);
  const schemaVersion = finite(value.system.schemaVersion);
  if (!backupState || typeof value.backup.configured !== "boolean" || !peakWorker || !database || !telegram || schemaVersion === null) return null;

  return {
    schemaVersion: 1, generatedAt, timezone,
    freshness: { state: freshnessState, latestEvidenceAt: nullableIso(value.freshness.latestEvidenceAt), reason: nullableText(value.freshness.reason, 300) },
    guidingQuestion,
    wellbeing: { sleep, energy, workload, exercise },
    sustainability: {
      state: sustainabilityState,
      reasons: Array.isArray(value.sustainability.reasons) ? value.sustainability.reasons.slice(0, 8).map((item) => text(item, 300)).filter((item): item is string => item !== null) : [],
      evidenceFreshness, recommendation, uncertainty: nullableText(value.sustainability.uncertainty, 500),
    },
    highestLeverageAction: highest,
    priorities: priorities as Priority[],
    deferredTaskCount: Math.max(0, finite(value.deferredTaskCount) ?? 0),
    projects: projects as PeakSnapshot["projects"], latestReflection,
    week: week as PeakSnapshot["week"],
    backup: {
      state: backupState, configured: value.backup.configured,
      lastAttemptAt: nullableIso(value.backup.lastAttemptAt), lastEncryptedAt: nullableIso(value.backup.lastEncryptedAt),
      lastCloudVerifiedAt: nullableIso(value.backup.lastCloudVerifiedAt), lastRestoreTestAt: nullableIso(value.backup.lastRestoreTestAt),
      restoreDueAt: nullableIso(value.backup.restoreDueAt), errorCode: nullableText(value.backup.errorCode, 100),
    },
    system: {
      peakWorker, database, schemaVersion, telegram,
      lastScheduledProcessAt: nullableIso(value.system.lastScheduledProcessAt), lastErrorCode: nullableText(value.system.lastErrorCode, 100),
    },
  };
}
