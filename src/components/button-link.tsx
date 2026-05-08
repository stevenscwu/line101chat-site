import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "dark" | "line" | "ghost";
  icon?: LucideIcon;
  className?: string;
  external?: boolean;
};

const baseClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2";

const variants = {
  primary: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700",
  secondary: "border border-slate-300 bg-white text-slate-900 hover:border-emerald-500 hover:text-emerald-700",
  dark: "bg-slate-950 text-white hover:bg-slate-800",
  line: "bg-[#06c755] text-white shadow-sm hover:bg-[#05b54e]",
  ghost: "text-slate-700 hover:bg-slate-100 hover:text-emerald-700",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  icon: Icon = ArrowRight,
  className = "",
  external = false,
}: ButtonLinkProps) {
  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer">
        {children}
        <Icon className="h-4 w-4" aria-hidden="true" />
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
      <Icon className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}
