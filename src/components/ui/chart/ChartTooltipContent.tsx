
import React from 'react';

export interface ChartTooltipContentProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  labelFormatter?: (label: string) => string;
  valueFormatter?: (value: number) => string;
  className?: string;
}

export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({
  active,
  payload,
  label,
  labelFormatter = (label) => label,
  valueFormatter = (value) => String(value),
  className = ''
}) => {
  if (!active || !payload || !payload.length) return null;
  
  return (
    <div className={`bg-background p-2 rounded-md shadow-md border border-border ${className}`}>
      <p className="text-sm font-medium">{labelFormatter(label || '')}</p>
      <div className="space-y-1 mt-1">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-muted-foreground">
              {entry.name || 'Value'}:
            </span>
            <span className="text-xs font-medium">
              {valueFormatter(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
