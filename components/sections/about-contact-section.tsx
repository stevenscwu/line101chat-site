import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export function AboutContactSection() {
  return (
    <Section
      id="about"
      eyebrow="About and Contact"
      title="Creator Profile and Collaboration"
      description="Open to collaborations, guest appearances, and partnership opportunities aligned with Japanese learning, mature learners, and practical career reinvention."
      className="bg-slate-50 dark:bg-slate-950"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <article className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">Profile Snapshot</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              I am a 50+ IT professional documenting my Japanese learning journey and building a new social identity
              from zero. The goal is practical and real: improve life, stay authentic, and create dependable income to
              support my family.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <a href="https://github.com" className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                GitHub
              </a>
              <a href="https://www.youtube.com" className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                YouTube
              </a>
              <a href="https://www.instagram.com" className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                Instagram
              </a>
              <a href="https://www.threads.com" className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                Threads
              </a>
              <a href="https://line.me" className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                LINE Community
              </a>
              <a href="mailto:hello@example.com" className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                Email
              </a>
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              Replace links above with your real profiles when ready.
            </p>
          </article>
        </Reveal>

        <Reveal>
          <article className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">Contact</h3>
            <form className="mt-4 space-y-3">
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700 dark:text-slate-200">Name</span>
                <input className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700 dark:text-slate-200">Email</span>
                <input type="email" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700 dark:text-slate-200">Message</span>
                <textarea rows={4} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900" />
              </label>
              <button
                type="button"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Send Inquiry
              </button>
            </form>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}
