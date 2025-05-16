
import React from 'react';

interface ChartInteractiveLegendProps {
  payload?: any[];
  activeLines?: string[];
  onToggle?: (dataKey: string) => void;
  className?: string;
}

export const ChartInteractiveLegend: React.FC<ChartInteractiveLegendProps> = ({
  payload,
  activeLines = [],
  onToggle,
  className = ''
}) => {
  if (!payload || !payload.length) return null;
  
  return (
    <div className={`flex flex-wrap gap-4 justify-center ${className}`}>
      {payload.map((entry, index) => {
        const isActive = activeLines.includes(entry.dataKey);
        return (
          <div 
            key={`item-${index}`}
            className={`flex items-center gap-2 cursor-pointer transition-opacity ${
              isActive ? 'opacity-100' : 'opacity-50'
            }`}
            onClick={() => onToggle && onToggle(entry.dataKey)}
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
