import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const foundationCards = [
  {
    id: "cloud",
    title: "Cloud Computing Foundations / 雲端運算基礎",
    points: [
      "Cloud computing delivers elastic infrastructure, platforms, and software over networked environments. / 雲端運算透過網路提供可彈性擴展之基礎設施、平台與軟體服務。",
      "In this thesis, IaaS is represented by Virtual Machine (VM) resources for scanner and service hosting; FaaS/PaaS is represented by Azure Functions for event-driven orchestration. / 本論文以虛擬機器（Virtual Machine, VM）承載掃描與服務節點，並以 Azure Functions（函式即服務）進行事件驅動式流程編排。",
      "Core cloud stack includes Azure Blob Storage, CI/CD pipeline services, identity controls, and operational monitoring. / 核心雲端技術包含 Azure Blob 儲存、CI/CD 管線服務、身分存取控管與營運監控機制。",
      "LLM reasoning is implemented with OpenAI or Azure OpenAI services for contextual vulnerability interpretation. / 大型語言模型推論層採用 OpenAI 或 Azure OpenAI，以提供具情境脈絡之弱點解釋與排序建議。"
    ]
  },
  {
    id: "devsecops",
    title: "DevOps to DevSecOps / 從 DevOps 到 DevSecOps",
    points: [
      "DevOps integrates development and operations to improve release velocity and reliability. / DevOps 強調開發與維運整合，以提升發布速度與穩定性。",
      "Security bottlenecks emerge when assurance activities happen only near production. / 若安全檢查僅在上線前執行，將形成流程瓶頸。",
      "Shift-left security introduces controls during coding, pull request review, and CI stages. / 左移安全（Shift-left Security）於撰碼、合併審查與 CI 階段即導入安全控制。",
      "DevSecOps operationalizes continuous security validation with traceable governance. / DevSecOps 透過持續驗證與可追溯治理，實現安全內建之交付流程。"
    ]
  },
  {
    id: "testing",
    title: "Security Testing: SAST and DAST / 安全測試：SAST 與 DAST",
    points: [
      "SAST (Static Application Security Testing) examines source code, bytecode, or intermediate representations without runtime execution. / SAST（靜態應用程式安全測試）在不執行程式的情況下分析原始碼或中介表示。",
      "DAST (Dynamic Application Security Testing) evaluates the running system through external interaction and attack simulation. / DAST（動態應用程式安全測試）以外部互動與攻擊模擬評估執行中系統。",
      "SAST is strong at early defect discovery; DAST is strong at runtime and configuration exposure detection. / SAST 擅長早期缺陷偵測；DAST 擅長執行期與部署設定弱點發現。",
      "A combined SAST+DAST strategy reduces blind spots and improves vulnerability coverage. / 採用 SAST 與 DAST 互補策略，可降低檢測盲區並提升弱點覆蓋率。"
    ]
  },
  {
    id: "triage",
    title: "Vulnerability Triage Framework / 弱點分流與處置框架",
    points: [
      "Triage converts raw alerts into prioritized actions using exploitability, business impact, and deployment criticality. / 弱點分流將原始告警轉為可執行任務，並依可利用性、業務衝擊與系統關鍵度進行排序。",
      "Academic triage materials include CWE classification, CVSS scoring, attack path context, and remediation SLA mapping. / 研究與實務常用分流材料包含 CWE 類型、CVSS 風險分數、攻擊路徑情境與修補 SLA 對應。",
      "False-positive suppression and duplicate-merging are required for scalable operations. / 於大規模場景中，需執行誤報抑制與重複弱點合併。",
      "Human-in-the-loop review remains mandatory for high-impact findings and policy exceptions. / 對高影響弱點與政策例外案件，仍須保留人機協作審查機制。"
    ]
  },
  {
    id: "ai-security",
    title: "AI in Software Security / AI 於軟體安全之應用",
    points: [
      "LLMs summarize technical findings into operator-friendly language with explainable rationale. / 大型語言模型可將技術弱點轉譯為易於決策之敘述，並附帶可解釋理由。",
      "AI can classify severity based on code context, dependency relationships, and business impact signals. / AI 可依程式脈絡、相依關係與業務衝擊訊號進行弱點嚴重度分類。",
      "Context-aware triage reduces alert fatigue and improves analyst throughput. / 具情境感知之分流可降低告警疲勞並提升分析人員處理效率。",
      "Governed deployment requires prompt controls, audit logs, and review checkpoints. / 受治理之 AI 部署需搭配提示詞控管、稽核紀錄與審查檢核點。"
    ]
  }
];

export function FoundationsSection() {
  return (
    <Section
      id="foundations"
      eyebrow="Educational Foundations / 教育基礎"
      title="Build Shared Context Before Deep Research / 研究前之共同知識建構"
      description="This section introduces cloud computing, DevSecOps, SAST, DAST, and vulnerability triage with academically precise terminology. / 本區以學術化術語整理雲端運算、DevSecOps、SAST、DAST 與弱點分流核心概念。"
      className="bg-slate-50 dark:bg-slate-950"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {foundationCards.map((card) => (
          <Reveal key={card.id}>
            <article className="glass-card rounded-2xl p-6">
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">{card.title}</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {card.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent-500" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
            Cloud Security Flow Illustration / 雲端安全流程示意
          </h3>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
            {[
              "Developer Commit / 開發者提交",
              "Cloud CI/CD Pipeline / 雲端 CI/CD 管線",
              "SAST + DAST + Policy Gates / SAST + DAST + 政策閘門",
              "Vulnerability Triage and Secure Deployment / 弱點分流與安全部署"
            ].map((item, idx) => (
              <div key={item} className="rounded-lg border border-brand-100 bg-brand-50/50 p-3 text-center dark:border-brand-500/30 dark:bg-brand-500/10">
                <p className="font-semibold text-brand-700 dark:text-brand-200">Step {idx + 1} / 步驟 {idx + 1}</p>
                <p className="mt-1 text-slate-700 dark:text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
