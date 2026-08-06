export type ExecutiveStatus =
  | "stable"
  | "attention"
  | "critical"
  | "recovery"
  | "deferred"
  | "unknown";

export type AgentRunState =
  | "not_scheduled"
  | "scheduled_not_run"
  | "running"
  | "completed_successfully"
  | "completed_with_findings"
  | "failed"
  | "stale"
  | "unknown";

export type ExecutiveEvidence = {
  source: string;
  summary: string;
  status: "verified" | "reported" | "preliminary" | "stale" | "missing";
  observed_at: string | null;
  record_id: string | null;
};

export type ExecutiveAgent = {
  name: string;
  state: AgentRunState;
  last_scheduled_run: string | null;
  last_actual_run: string | null;
  last_success: string | null;
  duration_seconds: number | null;
  latest_result: string;
  failure_reason: string | null;
  next_scheduled_run: string | null;
};

export type DomainBase = {
  status: ExecutiveStatus;
  score: number | null;
  summary: string;
  evidence: ExecutiveEvidence[];
  last_successful_activity_at: string | null;
  warnings: string[];
  next_action: string;
};

export type ExecutiveState = {
  schema_version: "1.0";
  state_hash: string;
  generated_at: string;
  timezone: string;
  overall: { score: number | null; status: ExecutiveStatus; summary: string };
  health: DomainBase & { risk_flags: string[]; recommendation: string };
  research: DomainBase & {
    current_focus: string;
    progress: string[];
    blockers: string[];
    last_successful_run: string | null;
  };
  japanese: DomainBase & { recent_activity: string[] };
  business: DomainBase & { opportunities: string[] };
  system: DomainBase & {
    agents: ExecutiveAgent[];
    audits: Array<{
      audit_id: string;
      status: string;
      scheduled_for: string;
      completed_at: string | null;
    }>;
    failures: string[];
  };
  today: {
    primary_focus: string;
    rationale: string;
    estimated_effort_minutes: number | null;
    recommended_actions: string[];
    schedule: Array<{ label: string; scheduled_at: string; state: AgentRunState }>;
    biggest_risk: string;
    biggest_opportunity: string;
  };
  changes_since_previous: Array<{
    domain: string;
    kind: "improved" | "declined" | "changed" | "new" | "resolved";
    summary: string;
    previous: string | null;
    current: string | null;
    observed_at: string;
  }>;
  risks: string[];
  opportunities: string[];
  confidence: {
    overall: number | null;
    missing_inputs: string[];
    stale_inputs: string[];
  };
};

export type StoredExecutiveState = { state: ExecutiveState; received_at: string };
