"use client";

import { motion, useReducedMotion } from "framer-motion";

interface EncouragementBannerProps {
  message: string;
}

export function EncouragementBanner({ message }: EncouragementBannerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
      animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-violet-500/20 p-5"
    >
      <p className="text-center text-base font-semibold text-cyan-50 sm:text-lg">{message}</p>
    </motion.section>
  );
}
