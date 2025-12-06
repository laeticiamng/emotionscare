
import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
  max?: number;
}

export const ProgressBar = React.forwardRef<
  HTMLDivElement,
  ProgressBarProps
>(({ className, value, indicatorClassName, max = 100, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/10",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full w-full flex-1 transition-all bg-primary",
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - (value / max) * 100}%)` }}
      />
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";
