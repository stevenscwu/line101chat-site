export type DataState = "known" | "unknown" | "stale";
export type DataSource = "manual" | "phone_imported" | "combined" | "unavailable";

export type Metric = {
  value: number | null;
  unit: string | null;
  scaleMaximum: number | null;
  state: DataState;
  source: DataSource | null;
  observedAt: string | null;
  reason: string | null;
};

export type Priority = {
  id: string;
  title: string;
  status: "open" | "in_progress" | "waiting" | "completed" | "cancelled";
  priority: number;
  projectId: string | null;
  missionReason: string;
  deadlineAt: string | null;
};

export type PeakSnapshot = {
  schemaVersion: 1;
  generatedAt: string;
  timezone: string;
  freshness: {
    state: "fresh" | "stale" | "unavailable" | "error" | "partial";
    latestEvidenceAt: string | null;
    reason: string | null;
  };
  guidingQuestion: string;
  wellbeing: {
    sleep: Metric;
    energy: Metric;
    workload: Metric;
    exercise: Metric;
  };
  sustainability: {
    state: "normal" | "caution" | "reduced" | "recovery" | "unknown";
    reasons: string[];
    evidenceFreshness: "fresh" | "stale" | "partial" | "unavailable";
    recommendation: string;
    uncertainty: string | null;
  };
  highestLeverageAction: Priority | null;
  priorities: Priority[];
  deferredTaskCount: number;
  projects: Array<{
    id: string;
    name: string;
    namespace: string;
    summary: string;
    nextAction: string | null;
    blocker: string | null;
    updatedAt: string;
  }>;
  latestReflection: {
    localDate: string;
    built: string;
    learned: string;
    energyNote: string;
    nextPeakAction: string;
    createdAt: string;
  } | null;
  week: Array<{
    localDate: string;
    sleepHours: number | null;
    energy: number | null;
    workload: number | null;
    exerciseMinutes: number | null;
    sustainabilityState: "normal" | "caution" | "recovery" | "unknown";
    reflected: boolean;
  }>;
  backup: {
    state:
      | "not_configured"
      | "configuration_incomplete"
      | "encrypted_upload_complete"
      | "restore_not_tested"
      | "restore_overdue"
      | "verified_recovery"
      | "failed";
    configured: boolean;
    lastAttemptAt: string | null;
    lastEncryptedAt: string | null;
    lastCloudVerifiedAt: string | null;
    lastRestoreTestAt: string | null;
    restoreDueAt: string | null;
    errorCode: string | null;
  };
  system: {
    peakWorker: "running" | "unknown";
    database: "available" | "unavailable";
    schemaVersion: number;
    telegram: "configured" | "unknown";
    lastScheduledProcessAt: string | null;
    lastErrorCode: string | null;
  };
};

export type StoredPeakSnapshot = {
  snapshot: PeakSnapshot;
  receivedAt: string;
};
