import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { inspectSession, PEAK_SESSION_COOKIE } from "@/lib/peak/auth";
import { isPeakDashboardEnabled } from "@/lib/peak/config";
import type { DomainBase, ExecutiveState, ExecutiveStatus } from "@/lib/peak/executive-types";
import { loadExecutiveState } from "@/lib/peak/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Peak OS Executive Cockpit",
  robots: { index: false, follow: false, nocache: true },
};

const statusLabel: Record<ExecutiveStatus, string> = {
  stable: "穩定",
  attention: "需注意",
  critical: "嚴重",
  deferred: "延後",
  unknown: "未知",
};
const agentLabel: Record<ExecutiveState["system"]["agents"][number]["state"], string> = {
  not_scheduled: "未排程",
  scheduled_not_run: "已排程未執行",
  running: "執行中",
  completed_successfully: "成功完成",
  completed_with_findings: "完成並有發現",
  failed: "失敗",
  stale: "過期",
  unknown: "未知",
};

function when(value: string | null) {
  if (!value) return "未記錄";
  return new Intl.DateTimeFormat("zh-TW", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Taipei",
  }).format(new Date(value));
}

function score(value: number | null) {
  return value === null ? "未評分" : `${value}/100`;
}

function confidence(value: number | null) {
  return value === null ? "未知" : `${Math.round(value * 100)}%`;
}

function currentEpochMilliseconds() {
  return Date.now();
}

function DomainCard({ title, value }: { title: string; value: DomainBase }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-bold text-slate-950">{title}</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
          {statusLabel[value.status]}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        {score(value.score)} · 最近成功：{when(value.last_successful_activity_at)}
      </p>
      <p className="mt-4 text-sm text-slate-700">{value.summary || "目前沒有足夠資料。"}</p>
      {value.evidence.length ? (
        <ul className="mt-3 space-y-1 text-xs text-slate-500">
          {value.evidence.slice(0, 3).map((item, index) => (
            <li key={item.record_id ?? `${item.source}-${index}`}>
              • {item.source} [{item.status}]：{item.summary}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-amber-700">證據：未知</p>
      )}
      {value.warnings.length ? (
        <p className="mt-3 text-xs font-semibold text-amber-800">注意：{value.warnings[0]}</p>
      ) : null}
      <p className="mt-4 border-t border-slate-100 pt-3 text-sm">
        <strong>下一步：</strong>
        {value.next_action || "尚未決定"}
      </p>
    </article>
  );
}

function Offline({ canAdminister }: { canAdminister: boolean }) {
  return (
    <main className="min-h-[72vh] bg-slate-100 px-5 py-16">
      <section className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm font-bold tracking-wider text-amber-700">
          OFFLINE · LAST-KNOWN-GOOD UNAVAILABLE
        </p>
        <h1 className="mt-3 text-3xl font-bold">Peak OS Executive Cockpit</h1>
        <p className="mt-4 text-slate-600">
          尚未收到有效的 Executive State 2.0，或私人儲存暫時無法讀取。缺少資料不能解讀為成功。
        </p>
        <div className="mt-6 flex gap-3">
          {canAdminister ? (
            <Link href="/peak/password" className="rounded-xl border border-slate-300 px-4 py-2 font-semibold">
              設定密碼
            </Link>
          ) : null}
          <form action="/api/peak/v1/logout" method="post">
            <button className="rounded-xl border border-slate-300 px-4 py-2 font-semibold">登出</button>
          </form>
        </div>
      </section>
    </main>
  );
}

function Cockpit({
  state,
  receivedAt,
  currentTime,
  canAdminister,
}: {
  state: ExecutiveState;
  receivedAt: string;
  currentTime: number;
  canAdminister: boolean;
}) {
  const staleAfter = Math.max(1, Number(process.env.PEAK_DASHBOARD_STALE_AFTER_MINUTES || 30));
  const receiptAge = currentTime - Date.parse(receivedAt);
  const sourceAge = currentTime - Date.parse(state.generated_at);
  const connection =
    !Number.isFinite(receiptAge) || receiptAge > staleAfter * 60_000
      ? "stale"
      : sourceAge > staleAfter * 60_000
        ? "cached"
        : "live";
  const connectionLabel = connection === "live" ? "LIVE" : connection === "cached" ? "CACHED" : "STALE";

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-7 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-emerald-300">
                PEAK OS EXECUTIVE COCKPIT
              </p>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                {statusLabel[state.overall.status]} · {score(state.overall.score)}
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-slate-300">{state.overall.summary}</p>
            </div>
            <div className="text-right text-xs text-slate-300">
              <span
                className={`inline-block rounded-full px-3 py-1 font-bold ${
                  connection === "live" ? "bg-emerald-400 text-slate-950" : "bg-amber-300 text-slate-950"
                }`}
              >
                {connectionLabel}
              </span>
              <p className="mt-3">資料產生：{when(state.generated_at)}</p>
              <p>網站接收：{when(receivedAt)}</p>
              <div className="mt-4 flex justify-end gap-2">
                {canAdminister ? (
                  <Link href="/peak/password" className="rounded-lg border border-slate-600 px-3 py-1.5">
                    設定密碼
                  </Link>
                ) : null}
                <form action="/api/peak/v1/logout" method="post">
                  <button className="rounded-lg border border-slate-600 px-3 py-1.5">登出</button>
                </form>
              </div>
            </div>
          </div>
          {connection !== "live" ? (
            <p
              role="status"
              className="mt-5 rounded-xl border border-amber-300/40 bg-amber-300/10 p-3 text-sm text-amber-100"
            >
              目前顯示最後已知有效狀態，並非即時資料。請勿將未更新視為成功。
            </p>
          ) : null}
        </header>

        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
          <p className="text-xs font-bold tracking-wider text-emerald-800">
            {"TODAY'S HIGHEST-LEVERAGE ACTION"}
          </p>
          <h2 className="mt-2 text-2xl font-bold">{state.today.primary_focus || "尚未決定"}</h2>
          <p className="mt-2 text-sm text-slate-700">{state.today.rationale}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-white px-3 py-1">
              信心：{confidence(state.confidence.overall)}
            </span>
            {state.today.estimated_effort_minutes !== null ? (
              <span className="rounded-full bg-white px-3 py-1">
                估計 {state.today.estimated_effort_minutes} 分鐘
              </span>
            ) : null}
          </div>
          {state.today.biggest_opportunity ? (
            <p className="mt-4 text-sm text-emerald-900">
              <strong>最大機會：</strong>
              {state.today.biggest_opportunity}
            </p>
          ) : null}
        </section>

        {state.chief ? (
          <section className="rounded-3xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-[0.18em] text-indigo-700">PORTFOLIO CHIEF</p>
                <h2 className="mt-2 text-xl font-bold">{state.chief.primary_focus}</h2>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold">
                {agentLabel[state.chief.state]}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-700">{state.chief.summary}</p>
            <dl className="mt-4 grid gap-3 text-sm md:grid-cols-[11rem_1fr]">
              <dt className="font-semibold text-slate-500">決策理由</dt>
              <dd>{state.chief.rationale}</dd>
              <dt className="font-semibold text-slate-500">運作限制</dt>
              <dd>{state.chief.operating_constraint}</dd>
              <dt className="font-semibold text-slate-500">最近協調</dt>
              <dd>{when(state.chief.last_cycle_at)}</dd>
              <dt className="font-semibold text-slate-500">下次檢查</dt>
              <dd>{when(state.chief.next_check_at)}</dd>
            </dl>
            {state.chief.owner_action ? (
              <p className="mt-4 rounded-xl bg-white p-4 text-sm">
                <strong>Steven 下一步：</strong>
                {state.chief.owner_action}
              </p>
            ) : null}
            {state.chief.work_orders.length ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {state.chief.work_orders.map((order) => (
                  <article key={order.order_id} className="rounded-xl border border-indigo-100 bg-white p-4">
                    <p className="text-xs font-bold uppercase text-indigo-700">
                      {order.pm_name} · {order.status}
                    </p>
                    <p className="mt-2 text-sm font-semibold">{order.action}</p>
                  </article>
                ))}
              </div>
            ) : null}
            {state.chief.deferred_count ? (
              <p className="mt-3 text-xs text-slate-500">
                另有 {state.chief.deferred_count} 個項目依規則延後。
              </p>
            ) : null}
          </section>
        ) : (
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
            Portfolio Chief 尚無可驗證的協調週期。
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DomainCard title="論文研究" value={state.research} />
          <DomainCard title="日文學習" value={state.japanese} />
          <DomainCard title="商業機會" value={state.business} />
          <DomainCard title="系統與代理" value={state.system} />
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">與前次相比</h2>
            {state.changes_since_previous.length ? (
              <ul className="mt-4 space-y-3">
                {state.changes_since_previous.map((item, index) => (
                  <li key={`${item.domain}-${index}`} className="rounded-xl border border-slate-200 p-3">
                    <span className="text-xs font-bold uppercase text-emerald-700">
                      {item.domain} · {item.kind}
                    </span>
                    <p className="mt-1 text-sm">{item.summary}</p>
                    {item.previous !== null || item.current !== null ? (
                      <p className="mt-1 text-xs text-slate-500">
                        {item.previous ?? "未知"} → {item.current ?? "未知"}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-500">沒有已驗證的重大變更。</p>
            )}
          </section>
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">機會</h2>
            {state.opportunities.length ? (
              state.opportunities.map((item, index) => (
                <p key={index} className="mt-3 text-sm">
                  • {item}
                </p>
              ))
            ) : (
              <p className="mt-4 text-sm text-slate-500">尚無已驗證機會。</p>
            )}
          </section>
        </div>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Agent Operations</h2>
          {state.system.agents.length ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {state.system.agents.map((agent, index) => (
                <details key={`${agent.name}-${index}`} className="rounded-xl border border-slate-200 p-4">
                  <summary className="cursor-pointer font-semibold">
                    {agent.name} · {agentLabel[agent.state]}
                  </summary>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <dt className="text-slate-500">最近排程</dt>
                    <dd>{when(agent.last_scheduled_run)}</dd>
                    <dt className="text-slate-500">實際執行</dt>
                    <dd>{when(agent.last_actual_run)}</dd>
                    <dt className="text-slate-500">最近成功</dt>
                    <dd>{when(agent.last_success)}</dd>
                    <dt className="text-slate-500">下次排程</dt>
                    <dd>{when(agent.next_scheduled_run)}</dd>
                  </dl>
                  <p className="mt-3 text-sm">{agent.latest_result || "未記錄結果"}</p>
                  {agent.failure_reason ? (
                    <p className="mt-2 text-sm text-rose-800">失敗原因：{agent.failure_reason}</p>
                  ) : null}
                </details>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-amber-700">Agent 狀態未知；未執行不能解讀為成功。</p>
          )}
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">今日建議順序</h2>
          {state.today.recommended_actions.length ? (
            <ol className="mt-4 space-y-3">
              {state.today.recommended_actions.map((action, index) => (
                <li
                  key={`${action}-${index}`}
                  className="flex gap-3 rounded-xl border border-slate-200 p-4"
                >
                  <span className="font-bold text-emerald-700">{index + 1}</span>
                  <p className="font-semibold">{action}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 text-sm text-slate-500">尚無可驗證的建議行動。</p>
          )}
        </section>

        {state.confidence.missing_inputs.length || state.confidence.stale_inputs.length ? (
          <aside className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            <strong>資料限制：</strong>缺少 {state.confidence.missing_inputs.join("、") || "無"}；過期{" "}
            {state.confidence.stale_inputs.join("、") || "無"}。
          </aside>
        ) : null}
        <p className="pb-4 text-center text-xs text-slate-500">
          所有資訊均來自 Peak OS Executive State 2.0；Steven 保有最終決定權。
        </p>
      </div>
    </main>
  );
}

export default async function PeakOsPage() {
  if (!isPeakDashboardEnabled()) notFound();
  const token = (await cookies()).get(PEAK_SESSION_COOKIE)?.value;
  const session = inspectSession(token);
  if (session.status !== "valid") {
    redirect(`/peak/login${session.status === "expired" ? "?error=expired" : ""}`);
  }
  const canAdminister = session.payload.scope === "admin";
  let record = null;
  try {
    record = await loadExecutiveState();
  } catch {
    console.error("peak_cockpit_render_failed", { reason: "private_store" });
  }
  return record ? (
    <Cockpit
      state={record.state}
      receivedAt={record.received_at}
      currentTime={currentEpochMilliseconds()}
      canAdminister={canAdminister}
    />
  ) : (
    <Offline canAdminister={canAdminister} />
  );
}
