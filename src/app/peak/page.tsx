import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { PEAK_SESSION_COOKIE, verifySession } from "@/lib/peak/auth";
import { isPeakDashboardEnabled } from "@/lib/peak/config";
import { loadPeakSnapshot } from "@/lib/peak/store";
import type { Metric, PeakSnapshot } from "@/lib/peak/types";
import type { StoredPeakSnapshot } from "@/lib/peak/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Peak OS Executive Dashboard",
  robots: { index: false, follow: false, nocache: true },
};

const stateLabels = { normal: "正常", caution: "注意", reduced: "減量", recovery: "恢復", unknown: "未知" };
const sourceLabels = { manual: "手動輸入", phone_imported: "手機匯入", combined: "手動＋手機", unavailable: "無資料" };
const backupLabels = {
  not_configured: "未設定", configuration_incomplete: "設定不完整", encrypted_upload_complete: "已加密上傳",
  restore_not_tested: "尚未測試還原", restore_overdue: "還原測試逾期", verified_recovery: "已驗證復原", failed: "備份失敗",
};

function formatDate(value: string | null, withTime = true) {
  if (!value) return "無資料";
  return new Intl.DateTimeFormat("zh-TW", { timeZone: "Asia/Taipei", month: "2-digit", day: "2-digit", ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}) }).format(new Date(value));
}

function metricValue(metric: Metric) {
  if (metric.value === null) return "未知";
  if (metric.scaleMaximum) return `${metric.value}/${metric.scaleMaximum}`;
  if (metric.unit === "hours") return `${Number(metric.value).toFixed(1)} 小時`;
  if (metric.unit === "minutes") return `${Math.round(Number(metric.value))} 分鐘`;
  return String(metric.value);
}

function MetricCard({ label, metric }: { label: string; metric: Metric }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-sm font-semibold text-slate-500">{label}</p>
    <p className="mt-2 text-2xl font-bold text-slate-950">{metricValue(metric)}</p>
    <p className="mt-2 text-xs text-slate-500">{metric.source ? sourceLabels[metric.source] : metric.reason || "無資料"}{metric.state === "stale" ? " · 資料已過期" : ""}</p>
  </article>;
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl bg-slate-100 p-4 text-sm text-slate-600">{children}</p>;
}

function currentEpochMilliseconds() {
  return Date.now();
}

function Dashboard({ data, receivedAt, currentTime }: { data: PeakSnapshot; receivedAt: string; currentTime: number }) {
  const staleMinutes = Number(process.env.PEAK_DASHBOARD_STALE_AFTER_MINUTES || 30);
  const syncAge = currentTime - Date.parse(receivedAt);
  const snapshotStale = !Number.isFinite(syncAge) || syncAge > staleMinutes * 60_000;
  return <main className="bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div><p className="text-sm font-semibold tracking-[0.18em] text-emerald-300">PEAK OS</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Build the Next Peak</h1><p className="mt-3 max-w-3xl text-sm text-slate-300">{data.guidingQuestion}</p></div>
          <div className="text-right text-sm text-slate-300"><p>{new Intl.DateTimeFormat("zh-TW", { dateStyle: "full", timeZone: "Asia/Taipei" }).format(new Date())}</p><p className="mt-1">同步：{formatDate(receivedAt)} {snapshotStale ? "· 已過期" : ""}</p><div className="mt-3 flex items-center justify-end gap-2"><a href="/peak/password" className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs hover:border-slate-300">設定密碼</a><form action="/api/peak/v1/logout" method="post"><button className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-300">登出</button></form></div></div>
        </div>
        {snapshotStale ? <p role="status" className="mt-5 rounded-xl border border-amber-400/40 bg-amber-400/10 p-3 text-sm text-amber-100">Peak OS 目前可能無法連線。最後成功同步：{formatDate(receivedAt)}。畫面資料可能已過期。</p> : null}
      </header>

      <section aria-labelledby="guardrail" className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 id="guardrail" className="text-xl font-bold">可持續性護欄</h2><span className="rounded-full bg-slate-950 px-4 py-1.5 text-sm font-bold text-white">{stateLabels[data.sustainability.state]}</span></div>
        <p className="mt-4 font-semibold">{data.sustainability.recommendation}</p>
        {data.sustainability.reasons.length ? <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">{data.sustainability.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul> : <p className="mt-3 text-sm text-slate-600">沒有足夠證據時，狀態維持未知，不推論為正常。</p>}
        {data.sustainability.uncertainty ? <p className="mt-3 text-sm text-amber-800">不確定性：{data.sustainability.uncertainty}</p> : null}
      </section>

      <section aria-labelledby="wellbeing"><h2 id="wellbeing" className="sr-only">今日概況</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><MetricCard label="睡眠" metric={data.wellbeing.sleep} /><MetricCard label="精力" metric={data.wellbeing.energy} /><MetricCard label="預計負荷" metric={data.wellbeing.workload} /><MetricCard label="運動" metric={data.wellbeing.exercise} /></div></section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">今日最高槓桿行動</h2>{data.highestLeverageAction ? <div className="mt-4"><p className="text-lg font-semibold">{data.highestLeverageAction.title}</p><p className="mt-2 text-sm text-emerald-700">{data.highestLeverageAction.missionReason}</p></div> : <Empty>目前沒有已記錄的優先行動。</Empty>}<h3 className="mt-6 font-bold">支援任務</h3><ul className="mt-3 space-y-3">{data.priorities.slice(1).map((item) => <li key={item.id} className="rounded-xl border border-slate-200 p-3"><p className="font-medium">{item.title}</p><p className="mt-1 text-xs text-slate-500">優先度 {item.priority} · {item.missionReason}</p></li>)}</ul>{data.deferredTaskCount ? <p className="mt-4 text-sm text-slate-500">另有 {data.deferredTaskCount} 個任務未顯示，避免過載。</p> : null}</section>
        <section className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">最近反思</h2>{data.latestReflection ? <dl className="mt-4 space-y-4 text-sm"><div><dt className="font-bold">完成</dt><dd className="mt-1 text-slate-700">{data.latestReflection.built}</dd></div><div><dt className="font-bold">學到</dt><dd className="mt-1 text-slate-700">{data.latestReflection.learned}</dd></div><div><dt className="font-bold">能量觀察</dt><dd className="mt-1 text-slate-700">{data.latestReflection.energyNote}</dd></div><div><dt className="font-bold">下一步</dt><dd className="mt-1 text-slate-700">{data.latestReflection.nextPeakAction}</dd></div></dl> : <Empty>尚無反思紀錄。</Empty>}</section>
      </div>

      <section className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">活躍專案</h2>{data.projects.length ? <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.projects.map((project) => <article key={project.id} className="rounded-2xl border border-slate-200 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{project.namespace}</p><h3 className="mt-1 font-bold">{project.name}</h3><p className="mt-2 text-sm text-slate-600">{project.summary || "尚無摘要"}</p><p className="mt-3 text-sm"><strong>下一步：</strong>{project.nextAction || "未記錄"}</p>{project.blocker ? <p className="mt-2 text-sm text-amber-800"><strong>阻礙：</strong>{project.blocker}</p> : null}</article>)}</div> : <Empty>尚無專案資料。</Empty>}</section>

      <section className="overflow-x-auto rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">七日概況</h2><table className="mt-4 min-w-full text-left text-sm"><thead><tr className="border-b text-slate-500"><th className="py-3 pr-4">日期</th><th className="px-3">睡眠</th><th className="px-3">精力</th><th className="px-3">負荷</th><th className="px-3">運動</th><th className="px-3">狀態</th><th className="pl-3">反思</th></tr></thead><tbody>{data.week.map((day) => <tr key={day.localDate} className="border-b border-slate-100"><td className="py-3 pr-4 font-medium">{day.localDate.slice(5)}</td><td className="px-3">{day.sleepHours === null ? "無資料" : `${day.sleepHours.toFixed(1)}h`}</td><td className="px-3">{day.energy ?? "無資料"}</td><td className="px-3">{day.workload ?? "無資料"}</td><td className="px-3">{day.exerciseMinutes === null ? "無資料" : `${day.exerciseMinutes}m`}</td><td className="px-3">{stateLabels[day.sustainabilityState]}</td><td className="pl-3">{day.reflected ? "有" : "—"}</td></tr>)}</tbody></table><p className="mt-3 text-xs text-slate-500">七日資料只用於工作量與反思檢視，不代表醫療趨勢。</p></section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">備份與復原</h2><p className="mt-4 text-2xl font-bold">{backupLabels[data.backup.state]}</p><dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><dt className="text-slate-500">最後嘗試</dt><dd>{formatDate(data.backup.lastAttemptAt)}</dd><dt className="text-slate-500">雲端物件驗證</dt><dd>{formatDate(data.backup.lastCloudVerifiedAt)}</dd><dt className="text-slate-500">還原測試</dt><dd>{formatDate(data.backup.lastRestoreTestAt)}</dd><dt className="text-slate-500">下次應測試</dt><dd>{formatDate(data.backup.restoreDueAt)}</dd></dl>{data.backup.state !== "verified_recovery" ? <p className="mt-4 text-sm text-amber-800">成功上傳不等於可靠備份；必須完成下載、解密、完整性及資料庫讀取測試。</p> : null}</section>
        <section className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">系統狀態</h2><dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><dt className="text-slate-500">Peak OS Worker</dt><dd>{data.system.peakWorker === "running" ? "同步時運作中" : "未知"}</dd><dt className="text-slate-500">資料庫</dt><dd>{data.system.database === "available" ? "可用" : "不可用"}</dd><dt className="text-slate-500">Schema</dt><dd>v{data.system.schemaVersion}</dd><dt className="text-slate-500">Telegram</dt><dd>{data.system.telegram === "configured" ? "已設定" : "未知"}</dd><dt className="text-slate-500">最後排程</dt><dd>{formatDate(data.system.lastScheduledProcessAt)}</dd><dt className="text-slate-500">最近錯誤</dt><dd>{data.system.lastErrorCode || "無"}</dd></dl></section>
      </div>
      <p className="pb-4 text-center text-xs text-slate-500">此頁為唯讀。Peak OS 的健康與工作量政策仍由本機確定性邏輯決定；人類保有最後決定權。</p>
    </div>
  </main>;
}

export default async function PeakDashboardPage() {
  if (!isPeakDashboardEnabled()) notFound();
  const token = (await cookies()).get(PEAK_SESSION_COOKIE)?.value;
  if (!verifySession(token)) redirect("/peak/login");
  let record: StoredPeakSnapshot | null = null;
  try { record = await loadPeakSnapshot(); } catch { /* Render the safe offline state below. */ }
  if (record) return <Dashboard data={record.snapshot} receivedAt={record.receivedAt} currentTime={currentEpochMilliseconds()} />;
  return <main className="min-h-[70vh] bg-slate-100 px-5 py-16"><section className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-sm"><p className="text-sm font-semibold text-amber-700">PEAK OS OFFLINE</p><h1 className="mt-2 text-3xl font-bold">目前無法取得 Peak OS 資料</h1><p className="mt-4 text-slate-600">尚未收到安全同步快照，或私人儲存服務暫時無法使用。沒有資料不代表數值為零。</p><form action="/api/peak/v1/logout" method="post"><button className="mt-6 rounded-xl border border-slate-300 px-4 py-2 font-semibold">登出</button></form></section></main>;
}
