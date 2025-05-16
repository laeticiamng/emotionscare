
import React from 'react';

export interface ChartInteractiveLegendProps {
  payload?: any[];
  activeLines?: string[];
  onToggle?: (dataKey: string) => void;
  className?: string;
  hiddenSeries?: string[];
  onToggleSeries?: (dataKey: string, isHidden: boolean) => void;
  verticalAlign?: string;
  align?: string;
  layout?: string;
}

export const ChartInteractiveLegend: React.FC<ChartInteractiveLegendProps> = ({
  payload,
  activeLines = [],
  onToggle,
  className = '',
  hiddenSeries = [],
  onToggleSeries,
  verticalAlign,
  align,
  layout
}) => {
  if (!payload || !payload.length) return null;
  
  const handleToggle = (dataKey: string) => {
    if (onToggleSeries) {
      onToggleSeries(dataKey, !hiddenSeries.includes(dataKey));
    } else if (onToggle) {
      onToggle(dataKey);
    }
  };
  
  return (
    <div className={`flex flex-wrap gap-4 justify-center ${className}`}
         style={{ 
           verticalAlign: verticalAlign, 
           textAlign: align as any,
           display: layout === 'vertical' ? 'flex' : 'block'
         }}
    >
      {payload.map((entry, index) => {
        const dataKey = entry.dataKey;
        const isActive = onToggleSeries 
          ? !hiddenSeries.includes(dataKey)
          : activeLines.includes(dataKey);
          
        return (
          <div 
            key={`item-${index}`}
            className={`flex items-center gap-2 cursor-pointer transition-opacity ${
              isActive ? 'opacity-100' : 'opacity-50'
            }`}
            onClick={() => handleToggle(entry.dataKey)}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">
              {entry.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
