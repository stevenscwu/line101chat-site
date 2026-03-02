"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Tooltip
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

const thesisPdfPath = "/thesis/20250709.pdf";

const pipelineSteps = [
  "Code push / 程式碼提交",
  "Pipeline triggered / 觸發管線",
  "SonarQube scan / SonarQube 掃描",
  "Report stored in Azure Blob / 報告存入 Azure Blob",
  "Azure Function + OpenAI analysis / Azure Functions + OpenAI 分析",
  "Prioritized summary / 優先順序摘要",
  "Human approval / 人工審核",
  "Deployment / 部署"
];

const severityData = {
  labels: ["Critical / 嚴重", "High / 高", "Medium / 中", "Low / 低"],
  datasets: [
    {
      label: "Before AI Triage / AI 分流前",
      data: [42, 80, 145, 188],
      backgroundColor: "rgba(56, 93, 245, 0.6)"
    },
    {
      label: "After AI Triage / AI 分流後",
      data: [39, 52, 71, 61],
      backgroundColor: "rgba(6, 182, 212, 0.65)"
    }
  ]
};

const productivityData = {
  labels: ["Week 1 / 第 1 週", "Week 2 / 第 2 週", "Week 3 / 第 3 週", "Week 4 / 第 4 週", "Week 5 / 第 5 週", "Week 6 / 第 6 週"],
  datasets: [
    {
      label: "Manual Triage / 人工分流",
      data: [18, 19, 17, 20, 19, 18],
      borderColor: "rgba(100, 116, 139, 0.95)",
      backgroundColor: "rgba(100, 116, 139, 0.18)",
      tension: 0.35
    },
    {
      label: "AI-Augmented Triage / AI 強化分流",
      data: [20, 24, 26, 29, 30, 31],
      borderColor: "rgba(14, 165, 233, 1)",
      backgroundColor: "rgba(14, 165, 233, 0.15)",
      tension: 0.35
    }
  ]
};

export function ThesisSection() {
  return (
    <Section
      id="thesis"
      eyebrow="Core Thesis / 論文核心"
      title="Research Architecture, Experiments, and Contributions / 研究架構、實驗設計與學術貢獻"
      description="The thesis addresses SAST and DAST triage overload by integrating SonarQube outputs, Azure cloud services, and GPT-4.1 contextual reasoning in a privacy-aware DevSecOps pipeline. / 本論文整合 SonarQube、Azure 雲端服務與 GPT-4.1 情境推論，處理 SAST 與 DAST 弱點分流過載問題，並兼顧隱私與治理。"
      className="bg-white dark:bg-slate-900"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <article className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">
              Problem and Motivation / 問題定義與研究動機
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              <li>
                SAST and DAST tools generate large volumes of alerts, and many findings lack deployable remediation
                context. / SAST 與 DAST 會產生大量告警，且多數弱點缺乏可直接落地之修補脈絡。
              </li>
              <li>
                Teams need prioritization aligned with exploitability, business impact, and service criticality. /
                團隊需要依可利用性、業務衝擊與服務關鍵度進行弱點優先排序。
              </li>
              <li>
                Cloud-native architecture increases system coupling and attack surface complexity. /
                雲原生架構提升系統耦合度，也擴大攻擊面與治理複雜度。
              </li>
            </ul>
          </article>
        </Reveal>

        <Reveal>
          <article className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">
              Proposed Architecture / 所提研究架構
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Code - CI/CD - SonarQube - Azure VM - Azure Blob - Azure Functions - OpenAI/Azure OpenAI - Human review -
              Deployment.
              <span className="mt-3 block">
                程式碼提交 - CI/CD - SonarQube - Azure 虛擬機器 - Azure Blob 儲存 - Azure Functions -
                OpenAI/Azure OpenAI 推論 - 人工審查 - 部署。此設計兼顧可解釋風險排序與人機協作治理。
              </span>
            </p>
            <div className="mt-4 rounded-xl border border-slate-200 p-4 text-xs dark:border-slate-700">
              <p className="font-semibold text-brand-700 dark:text-brand-300">
                Privacy-Preserving Workflow / 隱私保護流程
              </p>
              <p className="mt-1 text-slate-600 dark:text-slate-300">
                Sensitive artifacts can remain inside enterprise-controlled cloud boundaries with selective prompt
                abstraction and audit logging. / 透過選擇性提示詞抽象化與稽核紀錄，敏感資料可維持於企業可控雲端邊界內。
              </p>
            </div>
          </article>
        </Reveal>
      </div>

      <Reveal>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">
            Interactive Pipeline Walkthrough / 互動式流程導覽
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {pipelineSteps.map((step, idx) => (
              <div key={step} className="group rounded-xl border border-brand-100 bg-brand-50/60 p-4 transition hover:-translate-y-1 hover:border-brand-300 dark:border-brand-500/25 dark:bg-brand-500/10 dark:hover:border-brand-400/60">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-700 dark:text-brand-200">
                  Stage {idx + 1} / 階段 {idx + 1}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
              Severity Filtering Results / 嚴重度篩選成效
            </h3>
            <div className="mt-4 h-72">
              <Bar
                data={severityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                  scales: {
                    y: { title: { display: true, text: "Issue Count / 弱點數量" } }
                  }
                }}
              />
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
              Productivity Improvement Over Time / 生產力提升趨勢
            </h3>
            <div className="mt-4 h-72">
              <Line
                data={productivityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                  scales: {
                    y: { title: { display: true, text: "Processed Findings per Week / 每週處理弱點數" } }
                  }
                }}
              />
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <article className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/60">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">
            Research Contributions / 研究貢獻
          </h3>
          <ul className="mt-4 grid gap-3 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-2">
            <li>
              AI-enhanced DevSecOps triage architecture with human-in-the-loop validation. / 提出具人機協作驗證之 AI
              強化 DevSecOps 弱點分流架構。
            </li>
            <li>
              Measured reduction in triage time and improved severity prioritization quality. /
              量化驗證弱點分流時間下降與嚴重度排序品質提升。
            </li>
            <li>
              Reproducible pipeline blueprint suitable for research and enterprise adaptation. /
              建立可重現之流程藍圖，可供學術研究與企業導入。
            </li>
            <li>
              Privacy-aware cloud workflow for sensitive vulnerability processing. / 提供兼顧隱私治理之雲端弱點處理流程。
            </li>
          </ul>
        </article>
      </Reveal>

      <Reveal>
        <article className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">
              Thesis PDF Content (2025-07-09) / 論文文件內容（2025-07-09）
            </h3>
            <a
              href={thesisPdfPath}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-brand-300 px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 dark:border-brand-500/60 dark:text-brand-300 dark:hover:bg-brand-500/10"
            >
              Open / Download PDF / 開啟或下載 PDF
            </a>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            The oral-defense thesis document from July 9, 2025 is embedded below for direct reading in the thesis
            section. / 下方已內嵌 2025 年 7 月 9 日口試文件，使用者可直接於本論文區閱讀原始內容。
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            <iframe
              title="Thesis PDF Viewer / 論文 PDF 檢視器"
              src={`${thesisPdfPath}#page=1`}
              className="h-[34rem] w-full bg-white"
            />
          </div>
        </article>
      </Reveal>
    </Section>
  );
}
