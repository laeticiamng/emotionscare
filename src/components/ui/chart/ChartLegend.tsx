
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";
import { useChart } from "./context";
import { getPayloadConfigFromPayload } from "./ChartTooltip";

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean;
      nameKey?: string;
      onClick?: (item: any) => void;
      hiddenSeries?: string[];
      activeClassName?: string;
      inactiveClassName?: string;
    }
>(
  (
    { 
      className, 
      hideIcon = false, 
      payload, 
      verticalAlign = "bottom", 
      nameKey,
      onClick,
      hiddenSeries = [],
      activeClassName = "",
      inactiveClassName = ""
    },
    ref
  ) => {
    const { config } = useChart();

    if (!payload?.length) {
      return null;
    }

    const handleClick = (item: any) => {
      if (onClick) {
        onClick(item);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent, item: any) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (onClick) {
          onClick(item);
        }
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const isHidden = hiddenSeries.includes(key);
          
          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground",
                onClick ? "cursor-pointer" : "",
                isHidden ? inactiveClassName : activeClassName
              )}
              onClick={() => handleClick(item)}
              onKeyDown={(e) => handleKeyDown(e, item)}
              tabIndex={onClick ? 0 : undefined}
              role={onClick ? "button" : undefined}
              aria-pressed={isHidden}
              aria-label={onClick ? `Basculer la série ${item.value}` : undefined}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-[2px]",
                    isHidden && "opacity-40"
                  )}
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label || item.value}
            </div>
          );
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = "ChartLegendContent";

export { ChartLegend, ChartLegendContent };
