"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Route } from "next";
import { ComponentType } from "react";
import {
  Award,
  BookCopy,
  BookOpenText,
  Compass,
  Home,
  LayoutDashboard,
  Lightbulb,
  Mic2,
  NotebookPen,
  Settings,
  Sparkles
} from "lucide-react";
import { primaryNavItems } from "@/lib/site-config";

interface SidebarNavProps {
  compact?: boolean;
  onNavigate?: () => void;
}

const iconByRoute: Partial<Record<Route, ComponentType<{ className?: string }>>> = {
  "/": Home,
  "/dashboard": LayoutDashboard,
  "/learn": Compass,
  "/pronunciation": Mic2,
  "/vocabulary": BookOpenText,
  "/materials": BookCopy,
  "/journal": NotebookPen,
  "/social-ideas": Lightbulb,
  "/achievements": Award,
  "/about": Sparkles,
  "/settings": Settings
};

export function SidebarNav({ compact = false, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav className={compact ? "space-y-1.5" : "space-y-2"} aria-label="主要導航">
      {primaryNavItems.map((item) => {
        const Icon = iconByRoute[item.href] ?? Home;
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition ${
              active
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-100 ring-1 ring-cyan-400/50"
                : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
            }`}
          >
            <Icon
              className={`h-4 w-4 transition ${
                active ? "text-cyan-200" : "text-slate-500 group-hover:text-slate-200"
              }`}
            />
            <span>{compact ? item.shortLabel ?? item.label : item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
