
import React from 'react';
import { cn } from "@/lib/utils";

export interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  value?: string | number;
  change?: {
    value: number;
    positive?: boolean;
  };
  icon?: React.ReactNode;
  color?: string;
}

export const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  ({ className, label, value, change, icon, color, ...props }, ref) => {
    const indicatorColor = color || '#8884d8';

    return (
      <div
        ref={ref}
        className={cn(
          "min-w-[8rem] max-w-xs rounded-lg border bg-background p-3 shadow-md",
          className
        )}
        {...props}
      >
        {label && (
          <div className="flex items-center">
            {icon && <div className="mr-2">{icon}</div>}
            <div
              className="mr-2 h-2 w-2 rounded-full"
              style={{ backgroundColor: indicatorColor }}
            />
            <p className="text-sm font-medium">{label}</p>
          </div>
        )}
        {value !== undefined && (
          <div className="mt-1 text-2xl font-bold">
            {value}
          </div>
        )}
        {change && (
          <div className={cn(
            "mt-1 text-xs",
            change.positive ? "text-emerald-500" : "text-rose-500"
          )}>
            {change.positive ? '↑' : '↓'} {Math.abs(change.value).toFixed(1)}%
          </div>
        )}
      </div>
    );
  }
);

ChartTooltipContent.displayName = "ChartTooltipContent";
