
import React from 'react';

export interface ChartTooltipContentProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  valueFormatter?: (value: number) => string;
  labelFormatter?: (label: string) => string;
  className?: string;
}

export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({
  active,
  payload,
  label,
  valueFormatter = (value) => `${value}`,
  labelFormatter = (label) => label,
  className,
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className={`p-2 bg-background border rounded shadow-md text-sm ${className}`}>
      <p className="font-medium mb-1">{labelFormatter(label || '')}</p>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}: </span>
            <span className="font-medium">{valueFormatter(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
