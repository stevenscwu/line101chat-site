import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export function AboutContactSection() {
  return (
    <Section
      id="about"
      eyebrow="About and Contact / 關於與聯絡"
      title="Research Collaboration and Industry Engagement / 研究合作與產學連結"
      description="Connect for research partnerships, enterprise pilots, and academic-industry technology transfer opportunities. / 歡迎洽談研究合作、企業 PoC 試點與產學技術移轉。"
      className="bg-slate-50 dark:bg-slate-950"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <article className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">
              Researcher Profile / 研究者簡介
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Focus areas: DevSecOps automation, cloud security analytics, LLM-assisted software assurance, and secure AI
              systems engineering. / 研究主軸：DevSecOps 自動化、雲端安全分析、LLM 輔助軟體保證與安全 AI 系統工程。
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <a href="https://github.com" className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                GitHub
              </a>
              <a href="https://scholar.google.com" className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                Publications / 發表成果
              </a>
            </div>
          </article>
        </Reveal>

        <Reveal>
          <article className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">Contact / 聯絡方式</h3>
            <form className="mt-4 space-y-3">
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700 dark:text-slate-200">Name / 姓名</span>
                <input className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700 dark:text-slate-200">Email / 電子郵件</span>
                <input type="email" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700 dark:text-slate-200">Message / 訊息內容</span>
                <textarea rows={4} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900" />
              </label>
              <button
                type="button"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Send Inquiry / 送出詢問
              </button>
            </form>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}
