import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = PropsWithChildren<{
  className?: string;
}>;

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1240px] px-5 md:px-10 lg:px-16",
        className,
      )}
    >
      {children}
    </div>
  );
}
