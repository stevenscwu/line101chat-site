import type { PropsWithChildren } from "react";

import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

type SectionTone = "light" | "dark" | "neutral";

type SectionProps = PropsWithChildren<{
  id?: string;
  className?: string;
  contentClassName?: string;
  tone?: SectionTone;
}>;

const toneClasses: Record<SectionTone, string> = {
  light: "bg-[var(--surface-light)] text-[var(--text-primary)]",
  dark: "bg-[var(--surface-dark)] text-[var(--text-inverse)]",
  neutral: "bg-[var(--surface-neutral)] text-[var(--text-primary)]",
};

export function Section({
  id,
  className,
  contentClassName,
  tone = "light",
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative overflow-hidden py-20 md:py-28", toneClasses[tone], className)}
    >
      <Container className={contentClassName}>{children}</Container>
    </section>
  );
}
