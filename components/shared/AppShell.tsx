"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ReactNode, useState } from "react";
import { SidebarNav } from "@/components/shared/SidebarNav";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#060914] text-slate-100">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-24 top-[-8rem] h-[22rem] w-[22rem] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-8rem] top-[20rem] h-[20rem] w-[20rem] rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-[-9rem] left-[20%] h-[22rem] w-[22rem] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-800/80 bg-slate-950/70 p-5 backdrop-blur-xl lg:block">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">Japanese After 50</p>
          <h1 className="mt-2 text-xl font-black text-white">50後學日語</h1>
          <p className="mt-1 text-xs text-slate-400">50+ 日本語修行中</p>
        </div>
        <div className="mt-5">
          <SidebarNav />
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-slate-950/80 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Japanese After 50</p>
            <p className="text-sm font-bold">50後學日語</p>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "關閉選單" : "開啟選單"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            className="fixed inset-0 z-20 bg-slate-950/75 p-4 lg:hidden"
          >
            <motion.div
              initial={reduceMotion ? undefined : { x: -20, opacity: 0 }}
              animate={reduceMotion ? undefined : { x: 0, opacity: 1 }}
              exit={reduceMotion ? undefined : { x: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="mt-16 rounded-3xl border border-slate-700 bg-slate-900 p-4"
            >
              <SidebarNav compact onNavigate={() => setMobileOpen(false)} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main className="relative z-10 px-4 pb-16 pt-6 lg:ml-72 lg:px-8 lg:pt-8">
        <div className="mx-auto w-full max-w-[1240px]">{children}</div>
        <footer className="mt-12 border-t border-slate-800/70 pt-6 text-sm text-slate-400">
          50後學日語，不急，天天進步。今日も一歩ずつ。
        </footer>
      </main>
    </div>
  );
}
