import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export function EnterpriseSection() {
  return (
    <Section
      id="enterprise"
      eyebrow="Enterprise RAG Solutions / 企業級 RAG 方案"
      title="Commercialization Path: Private AI for Security and Knowledge / 商業化路徑：企業私有 AI 與知識安全"
      description="Beyond thesis validation, the same architecture can support secure enterprise assistants for engineering, compliance, and operations teams. / 除論文驗證外，此架構可延伸為工程、法遵與營運團隊之企業級安全助理。"
      className="bg-white dark:bg-slate-900"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <article className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">
              Why Enterprises Need Private AI / 企業為何需要私有 AI
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              <li>
                Knowledge overload across tickets, runbooks, and audit artifacts slows decision-making. /
                票務、操作手冊與稽核文件分散，造成決策延遲與認知負荷。
              </li>
              <li>
                Regulated industries require strict data governance and traceable AI outputs. /
                受監管產業需要可追溯的 AI 輸出與嚴格資料治理。
              </li>
              <li>
                Private AI keeps sensitive code and documents within controlled boundaries. /
                私有 AI 可將敏感程式碼與文件維持於可控邊界內。
              </li>
            </ul>
          </article>
        </Reveal>

        <Reveal>
          <article className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">Use Cases / 應用情境</h3>
            <ul className="mt-4 grid gap-2 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-2">
              <li>DevSecOps assistant / DevSecOps 助理</li>
              <li>Enterprise knowledge assistant / 企業知識助理</li>
              <li>Compliance and audit support / 法遵與稽核支援</li>
              <li>Code review assistant / 程式碼審查助理</li>
              <li>Technical support chatbot / 技術支援聊天機器人</li>
            </ul>
          </article>
        </Reveal>
      </div>

      <Reveal>
        <article className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/60">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">
            RAG Architecture Explanation / RAG 架構說明
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Document ingestion / 文件匯入",
              "Vector database indexing / 向量索引建置",
              "Context retrieval / 情境檢索",
              "LLM synthesis with citation / 具引用回應合成"
            ].map((item, idx) => (
              <div key={item} className="rounded-xl border border-accent-100 bg-accent-50/50 p-4 dark:border-accent-500/30 dark:bg-accent-500/10">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent-700 dark:text-accent-200">
                  Module {idx + 1} / 模組 {idx + 1}
                </p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{item}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Deployment options include secure enterprise chatbot services, on-prem AI assistants, Azure-native AI stacks,
            and dedicated DevSecOps copilots. / 部署型態可涵蓋企業安全聊天機器人、地端 AI 助理、Azure 原生 AI 堆疊與
            DevSecOps 專用 Copilot。
          </p>
        </article>
      </Reveal>
    </Section>
  );
}
