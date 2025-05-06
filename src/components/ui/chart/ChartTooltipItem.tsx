
import * as React from "react";
import { cn } from "@/lib/utils";
import { useChart } from "./context";
import { getPayloadConfigFromPayload } from "./ChartTooltip";

interface ChartTooltipItemProps {
  item: any;
  index: number;
  nameKey?: string;
  formatter?: (value: any, name: string, item: any, index: number, payload: any) => React.ReactNode;
  indicator?: "line" | "dot" | "dashed";
  hideIndicator?: boolean;
  color?: string;
  nestLabel?: boolean;
  tooltipLabel: React.ReactNode;
}

export function ChartTooltipItem({
  item,
  index,
  nameKey,
  formatter,
  indicator = "dot",
  hideIndicator = false,
  color,
  nestLabel = false,
  tooltipLabel,
}: ChartTooltipItemProps) {
  const { config } = useChart();
  const key = `${nameKey || item.name || item.dataKey || "value"}`;
  const itemConfig = getPayloadConfigFromPayload(config, item, key);
  const indicatorColor = color || item.payload?.fill || item.color;
  
  // Calculate delta if available - handle string or number dataKey
  let previousValueKey: string;
  if (typeof item.dataKey === 'string') {
    previousValueKey = item.dataKey === 'value' ? 'previousValue' : 
      `previous${item.dataKey.charAt(0).toUpperCase() + item.dataKey.slice(1)}`;
  } else {
    previousValueKey = 'previousValue';
  }
  
  const previousValue = item.payload && previousValueKey in item.payload ? 
    item.payload[previousValueKey] : null;
  
  let delta = null;
  if (previousValue !== null && item.value !== null && previousValue !== 0) {
    delta = Math.round(((item.value - previousValue) / Math.abs(previousValue)) * 100);
  }
  
  const isDeltaPositive = delta !== null && delta >= 0;
  const isDeltaNegative = delta !== null && delta < 0;
  
  // Choose colors for delta badges
  const deltaColor = isDeltaPositive ? 'text-green-600' : 
                    isDeltaNegative ? 'text-red-600' : '';
  
  if (formatter && item?.value !== undefined && item.name) {
    return formatter(item.value, item.name, item, index, item.payload);
  }
  
  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
        indicator === "dot" && "items-center"
      )}
    >
      {itemConfig?.icon ? (
        <itemConfig.icon />
      ) : (
        !hideIndicator && (
          <div
            className={cn(
              "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
              {
                "h-2.5 w-2.5": indicator === "dot",
                "w-1": indicator === "line",
                "w-0 border-[1.5px] border-dashed bg-transparent":
                  indicator === "dashed",
                "my-0.5": nestLabel && indicator === "dashed",
              }
            )}
            style={
              {
                "--color-bg": indicatorColor,
                "--color-border": indicatorColor,
              } as React.CSSProperties
            }
          />
        )
      )}
      <div
        className={cn(
          "flex flex-1 justify-between leading-none",
          nestLabel ? "items-end" : "items-center"
        )}
      >
        <div className="grid gap-1.5">
          {nestLabel ? tooltipLabel : null}
          <span className="text-muted-foreground">
            {itemConfig?.label || item.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {item.value && (
            <span className="font-mono font-medium tabular-nums text-foreground">
              {item.value.toLocaleString()}
            </span>
          )}
          
          {delta !== null && (
            <span className={cn(
              "text-xs font-medium",
              deltaColor
            )}>
              {delta > 0 ? '+' : ''}{delta}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
