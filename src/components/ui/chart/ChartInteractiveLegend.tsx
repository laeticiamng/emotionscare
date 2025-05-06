
import * as React from "react";
import { Legend } from "recharts";
import { cn } from "@/lib/utils";
import { useChart } from "./context";
import { ChartLegendContent } from "./ChartLegend";

interface ChartInteractiveLegendProps {
  onToggleSeries?: (dataKey: string, isActive: boolean) => void;
  hiddenSeries?: string[];
  verticalAlign?: "top" | "middle" | "bottom";
  align?: "left" | "center" | "right";
  iconType?: "line" | "plainline" | "square" | "rect" | "circle" | "cross" | "diamond" | "star" | "triangle" | "wye";
  layout?: "horizontal" | "vertical";
  wrapperClassName?: string;
}

export const ChartInteractiveLegend = React.forwardRef<
  HTMLDivElement,
  ChartInteractiveLegendProps
>(
  ({
    onToggleSeries,
    hiddenSeries = [],
    verticalAlign = "top",
    align = "right",
    iconType = "circle",
    layout = "horizontal",
    wrapperClassName,
    ...props
  }, ref) => {
    const handleClick = (data: any) => {
      if (onToggleSeries && data?.dataKey) {
        const isCurrentlyHidden = hiddenSeries.includes(data.dataKey);
        onToggleSeries(data.dataKey, isCurrentlyHidden);
      }
    };

    return (
      <Legend
        verticalAlign={verticalAlign}
        align={align}
        iconType={iconType}
        layout={layout}
        wrapperStyle={{ 
          paddingLeft: 10,
          paddingRight: 10,
        }}
        content={
          <div
            ref={ref}
            className={cn(
              "chart-legend-container",
              wrapperClassName
            )}
          >
            <ChartLegendContent
              {...props}
              onClick={handleClick}
              className={cn(
                "flex flex-wrap gap-2",
                layout === "vertical" ? "flex-col" : "items-center"
              )}
              activeClassName="cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded px-1"
              inactiveClassName="cursor-pointer opacity-40 hover:opacity-60 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded px-1"
              hiddenSeries={hiddenSeries}
            />
          </div>
        }
        {...props}
      />
    );
  }
);

ChartInteractiveLegend.displayName = "ChartInteractiveLegend";
