import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type BakerySectionProps = PropsWithChildren<{
  title?: string;
  description?: string;
  className?: string;
}>;

export function BakerySection({ title, description, className, children }: BakerySectionProps) {
  return (
    <section className={cn("mt-8 rounded-[1.8rem] border border-amber-200/80 bg-white/80 p-6 shadow-[0_12px_34px_rgba(120,79,32,0.08)] md:p-8", className)}>
      {title ? <h2 className="text-2xl font-semibold tracking-tight text-amber-950 md:text-3xl">{title}</h2> : null}
      {description ? <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-700 md:text-base">{description}</p> : null}
      <div className={cn(title || description ? "mt-6" : "")}>{children}</div>
    </section>
  );
}
