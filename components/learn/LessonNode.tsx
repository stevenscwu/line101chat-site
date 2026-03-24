"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Flag, Lock, Trophy } from "lucide-react";
import { LearningPathNode } from "@/data/site-data";

interface LessonNodeProps {
  node: LearningPathNode;
  index: number;
}

function getNodeBadge(node: LearningPathNode) {
  if (node.status === "locked") {
    return <Lock className="h-4 w-4" />;
  }
  if (node.type === "milestone" || node.type === "challenge") {
    return <Trophy className="h-4 w-4" />;
  }
  return <Flag className="h-4 w-4" />;
}

export function LessonNode({ node, index }: LessonNodeProps) {
  const reduceMotion = useReducedMotion();
  const statusClass =
    node.status === "completed"
      ? "border-emerald-400/60 bg-emerald-500/15"
      : node.status === "current"
        ? "border-cyan-400/60 bg-cyan-500/15"
        : "border-slate-700 bg-slate-800/50";

  return (
    <motion.article
      initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ delay: reduceMotion ? 0 : index * 0.06, duration: 0.25 }}
      className={`relative rounded-3xl border p-4 ${statusClass}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/80 text-cyan-100">
          {getNodeBadge(node)}
        </span>
        <span className="text-xs text-slate-300">+{node.xpReward} XP</span>
      </div>
      <h4 className="mt-3 text-sm font-semibold text-white">{node.title}</h4>
      <p className="mt-1 text-xs text-slate-300">{node.subtitle}</p>
      <span
        className={`mt-3 inline-flex rounded-full px-2 py-1 text-[11px] ${
          node.status === "completed"
            ? "bg-emerald-500/20 text-emerald-100"
            : node.status === "current"
              ? "bg-cyan-500/20 text-cyan-100"
              : "bg-slate-700 text-slate-300"
        }`}
      >
        {node.status === "completed" ? "已完成" : node.status === "current" ? "目前關卡" : "尚未解鎖"}
      </span>
    </motion.article>
  );
}
