import Image from "next/image";
import Link from "next/link";

const lineAddFriendUrl = "https://line.me/R/ti/p/@539iuksp";

const steps = [
  "Send an Indonesian or Chinese message",
  "The bot detects the language automatically",
  "Receive a short, natural translation",
];

const useCases = [
  {
    title: "Daily chat",
    description: "Keep simple conversations moving with friends, classmates, and family.",
  },
  {
    title: "Travel",
    description: "Ask for directions, check details, and translate quick on-the-go messages.",
  },
  {
    title: "Work communication",
    description: "Clarify schedules, tasks, and short workplace messages without friction.",
  },
  {
    title: "Caregiver / employer communication",
    description: "Make everyday home and care conversations easier for both sides.",
  },
  {
    title: "Shopping and services",
    description: "Translate practical questions about orders, prices, pickup, and support.",
  },
  {
    title: "Taiwanese-Indonesian communication",
    description: "Bridge everyday Indonesian and Traditional Chinese conversation in LINE.",
  },
];

const features = [
  "Indonesian to Traditional Chinese",
  "Traditional Chinese to Indonesian",
  "Short and natural daily conversation style",
  "No long explanations",
  "Works inside LINE",
  "Powered by local AI backend",
];

function QrCard({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`mx-auto w-full max-w-[290px] rounded-lg border border-[#cdeed9] bg-white p-4 text-center shadow-[0_24px_70px_rgba(4,120,56,0.16)] sm:max-w-sm ${
        compact ? "sm:max-w-xs" : ""
      }`}
    >
      <div className="rounded-lg border border-[#e3f6ea] bg-[#f7fff9] p-3">
        <Image
          src="/line-qr.png"
          width={294}
          height={296}
          priority={!compact}
          alt="QR code to add the LINE Indonesian Chinese translation bot"
          className="mx-auto h-auto w-full max-w-[224px] sm:max-w-[272px]"
        />
      </div>
      <p className="mt-4 text-sm font-semibold text-[#0b5d2a]">
        Scan QR Code to Add LINE Bot
      </p>
      <p className="mt-1 text-xs text-[#52665a]">
        Open LINE and scan this code to start translating.
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f5fbf6] text-[#102018]">
      <section className="relative overflow-hidden border-b border-[#d7eddf] bg-[#f7fff9] px-5 pb-12 pt-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href="/" className="text-base font-black tracking-[0] text-[#0b5d2a]">
            LINE101 Chat
          </Link>
          <a
            href={lineAddFriendUrl}
            className="shrink-0 rounded-full bg-[#06c755] px-4 py-2 text-sm font-bold text-white shadow-[0_12px_30px_rgba(6,199,85,0.25)] transition hover:bg-[#05b84f]"
            aria-label="Add the translation bot on LINE"
          >
            Add on LINE
          </a>
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-8 py-8 md:grid-cols-[1.05fr_0.95fr] md:py-16 lg:gap-14">
          <div className="min-w-0">
            <p className="mb-5 hidden max-w-full rounded-full border border-[#b9e9c9] bg-white px-4 py-2 text-sm font-bold text-[#087a35] shadow-sm sm:inline-flex">
              Indonesian ↔ Traditional Chinese directly in LINE
            </p>
            <h1 className="max-w-3xl text-3xl font-black leading-[1.08] tracking-[0] text-[#112018] sm:text-5xl lg:text-6xl">
              Indonesian ↔ Chinese Translation, Right Inside LINE
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#415348] sm:mt-6 sm:text-xl sm:leading-8">
              Need to chat across Indonesian and Traditional Chinese? Add our LINE bot and
              get short, natural translations for everyday conversation.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
              <a
                href={lineAddFriendUrl}
                className="inline-flex w-full justify-center rounded-full bg-[#06c755] px-6 py-3 text-base font-black text-white shadow-[0_16px_36px_rgba(6,199,85,0.28)] transition hover:bg-[#05b84f] sm:w-auto"
              >
                Add on LINE
              </a>
              <span className="text-sm font-semibold text-[#52665a]">
                Scan to add the LINE translation bot
              </span>
            </div>
          </div>

          <div className="relative min-w-0">
            <div className="absolute inset-x-8 top-10 h-64 rounded-lg bg-[#bdf4cf] opacity-45 blur-3xl" />
            <div className="relative rounded-lg border border-[#cdeed9] bg-white/[0.82] p-4 shadow-[0_28px_90px_rgba(17,80,42,0.18)] backdrop-blur">
              <QrCard />
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:max-w-3xl lg:translate-y-2">
          <div className="rounded-lg border border-[#dcefe3] bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase text-[#087a35]">Indonesian</p>
            <p className="mt-2 text-sm text-[#283a30]">Besok mulai kerja jam berapa?</p>
          </div>
          <div className="rounded-lg border border-[#dcefe3] bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase text-[#087a35]">
              Traditional Chinese
            </p>
            <p className="mt-2 text-sm text-[#283a30]">明天幾點開始上班？</p>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-12" aria-labelledby="how-it-works">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase text-[#087a35]">How it works</p>
            <h2 id="how-it-works" className="mt-3 text-3xl font-black tracking-[0] sm:text-4xl">
              Send a message. Get the translation. Keep the conversation going.
            </h2>
          </div>

          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <li
                key={step}
                className="rounded-lg border border-[#dcefe3] bg-white p-6 shadow-[0_16px_44px_rgba(31,72,45,0.08)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#06c755] text-sm font-black text-white">
                  {index + 1}
                </span>
                <p className="mt-5 text-lg font-bold text-[#14251a]">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:px-8 lg:px-12" aria-labelledby="use-cases">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase text-[#087a35]">Use cases</p>
              <h2 id="use-cases" className="mt-3 text-3xl font-black tracking-[0] sm:text-4xl">
                Practical translation for real everyday moments.
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-[#52665a]">
              Helpful for Taiwanese people, Indonesian speakers in Taiwan, caregivers,
              travelers, and small businesses.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-[#e0ece5] bg-[#fbfdfb] p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(31,72,45,0.1)]"
              >
                <h3 className="text-lg font-black text-[#14251a]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#52665a]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-12" aria-labelledby="features">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase text-[#087a35]">Features</p>
            <h2 id="features" className="mt-3 text-3xl font-black tracking-[0] sm:text-4xl">
              Lightweight, friendly, and built for daily conversation.
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-3 rounded-lg border border-[#dcefe3] bg-white p-4 shadow-sm"
              >
                <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#06c755]" />
                <p className="font-semibold text-[#283a30]">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-6 sm:px-8 lg:px-12" aria-labelledby="privacy">
        <div className="mx-auto max-w-6xl rounded-lg border border-[#cdeed9] bg-[#eaffef] p-6 shadow-sm sm:p-8">
          <p className="text-sm font-black uppercase text-[#087a35]">Privacy and trust</p>
          <h2 id="privacy" className="mt-3 text-2xl font-black tracking-[0]">
            Simple translation, without extra clutter.
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#415348]">
            Messages are processed only for translation. The service is designed to keep the
            experience simple and practical.
          </p>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-12" aria-labelledby="final-cta">
        <div className="mx-auto grid max-w-6xl items-center gap-8 rounded-lg bg-[#102018] p-6 text-white shadow-[0_24px_70px_rgba(16,32,24,0.25)] md:grid-cols-[1fr_360px] sm:p-8 lg:p-10">
          <div>
            <p className="text-sm font-black uppercase text-[#8af1ad]">Start translating</p>
            <h2 id="final-cta" className="mt-3 text-3xl font-black tracking-[0] sm:text-4xl">
              Open LINE, scan the QR code, and start translating.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#d9eadf]">
              Indonesian ↔ Chinese translation directly in LINE for daily chat, work,
              travel, services, and Taiwanese-Indonesian communication.
            </p>
            <a
              href={lineAddFriendUrl}
              className="mt-7 inline-flex rounded-full bg-[#06c755] px-6 py-3 text-base font-black text-white shadow-[0_16px_36px_rgba(6,199,85,0.28)] transition hover:bg-[#05b84f]"
            >
              Add on LINE
            </a>
          </div>
          <QrCard compact />
        </div>
      </section>
    </main>
  );
}
