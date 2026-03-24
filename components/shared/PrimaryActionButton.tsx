"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ButtonHTMLAttributes, ReactNode } from "react";

type SafeButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

interface PrimaryActionButtonProps extends SafeButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

const baseClass =
  "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const variantClass: Record<NonNullable<PrimaryActionButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/30 hover:brightness-110",
  secondary:
    "bg-slate-800 text-slate-100 ring-1 ring-slate-700 hover:bg-slate-700",
  ghost: "bg-transparent text-cyan-200 ring-1 ring-cyan-500/40 hover:bg-cyan-500/10"
};

export function PrimaryActionButton({
  children,
  className = "",
  variant = "primary",
  ...props
}: PrimaryActionButtonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className="inline-flex"
    >
      <button
        className={`${baseClass} ${variantClass[variant]} ${className}`.trim()}
        {...props}
      >
        {children}
      </button>
    </motion.div>
  );
}
