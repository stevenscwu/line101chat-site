import { Reveal } from "@/components/ui/reveal";

const stats = [
  { label: "Triage Time Reduction / 弱點分流時間降低", value: "48%" },
  { label: "High-Risk Precision Gain / 高風險辨識精準度提升", value: "31%" },
  { label: "Analyst Throughput / 分析人員處理量提升", value: "+42%" }
];

export function HeroSection() {
  return (
    <section
      id="top"
      className="bg-hero-grid pt-28 dark:bg-hero-grid-dark"
      aria-label="Thesis landing section"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <p className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-200">
            Master&apos;s Thesis Research Portal / 碩士論文研究入口
          </p>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
            AI-Augmented DevSecOps: Integrating SonarQube and GPT-4.1 for Intelligent Vulnerability Triage
            <span className="mt-3 block text-3xl sm:text-4xl">
              AI 強化 DevSecOps：整合 SonarQube 與 GPT-4.1 之智慧化弱點分級與處置排序
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-700 dark:text-slate-300">
            This research addresses security triage overload in modern software delivery by combining static analysis
            with context-aware LLM reasoning. The result is faster, smarter, and more actionable vulnerability
            prioritization.
            <span className="mt-3 block">
              本研究以靜態分析結合具情境推論能力之大型語言模型，處理現代軟體交付中的弱點分流負載問題，提升
              弱點排序效率、準確性與可行動性。
            </span>
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#foundations" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
              Learn Foundations / 學習基礎
            </a>
            <a href="#thesis" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
              Explore Thesis / 瀏覽論文
            </a>
            <a href="#chatbot" className="rounded-lg border border-accent-500 px-4 py-2 text-sm font-semibold text-accent-700 hover:bg-accent-50 dark:text-accent-300 dark:hover:bg-accent-500/10">
              Try AI Chatbot / 體驗聊天機器人
            </a>
            <a href="#enterprise" className="rounded-lg border border-brand-300 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 dark:border-brand-500/60 dark:text-brand-300 dark:hover:bg-brand-500/10">
              Enterprise Solutions / 企業方案
            </a>
          </div>
        </Reveal>

        <Reveal>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">
              Architecture Preview / 架構總覽
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Code - CI/CD - SonarQube - Azure VM - Azure Blob - Azure Function - OpenAI/Azure OpenAI - Human Review -
              Deployment
              <span className="mt-2 block">
                程式碼提交 - CI/CD - SonarQube - Azure 虛擬機器 - Azure Blob 儲存 - Azure Functions -
                OpenAI/Azure OpenAI 推論 - 人工審核 - 安全部署
              </span>
            </p>
            <div className="mt-5 rounded-xl border border-brand-100 bg-white p-4 dark:border-brand-500/30 dark:bg-slate-900">
              <ol className="grid gap-2 text-sm">
                {[
                  "Code push triggers CI/CD / 程式碼提交觸發 CI/CD",
                  "SonarQube generates issues / SonarQube 產生弱點清單",
                  "Findings stored in Azure Blob / 弱點資料寫入 Azure Blob",
                  "Azure Function orchestrates OpenAI inference / Azure Functions 編排 OpenAI 推論",
                  "AI returns contextual prioritization / AI 產生情境化優先排序",
                  "Engineer validates and deploys / 工程師驗證後部署"
                ].map((step, idx) => (
                  <li key={step} className="flex items-center gap-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-200">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700 dark:text-slate-200">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
                  <p className="text-xl font-bold text-brand-700 dark:text-brand-300">{stat.value}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
