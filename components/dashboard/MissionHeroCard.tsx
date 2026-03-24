"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MissionData } from "@/data/site-data";
import { PrimaryActionButton } from "@/components/shared/PrimaryActionButton";

interface MissionHeroCardProps {
  mission: MissionData;
}

export function MissionHeroCard({ mission }: MissionHeroCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-[2rem] border border-cyan-400/30 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_50%),linear-gradient(120deg,rgba(15,23,42,0.96),rgba(30,41,59,0.93))] p-6 shadow-[0_24px_80px_rgba(6,182,212,0.2)]"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">今日任務 Mission</p>
      <h2 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">{mission.title}</h2>
      <p className="mt-3 text-sm text-cyan-100">{mission.supportJa}</p>
      <p className="mt-4 max-w-2xl text-sm text-slate-300">{mission.summary}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <PrimaryActionButton>{mission.ctaPrimary}</PrimaryActionButton>
        <PrimaryActionButton variant="secondary">{mission.ctaSecondary}</PrimaryActionButton>
      </div>
    </motion.section>
  );
}
