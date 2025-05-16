
import React from 'react';
import { Legend, LegendProps } from 'recharts';

export interface ChartInteractiveLegendProps extends Partial<LegendProps> {
  onToggleSeries?: (dataKey: string, isHidden: boolean) => void;
  hiddenSeries?: string[];
}

export const ChartInteractiveLegend: React.FC<ChartInteractiveLegendProps> = ({
  onToggleSeries,
  hiddenSeries = [],
  ...props
}) => {
  const handleClick = (dataKey: string) => {
    if (onToggleSeries) {
      const isCurrentlyHidden = hiddenSeries.includes(dataKey);
      onToggleSeries(dataKey, !isCurrentlyHidden);
    }
  };

  const renderLegendItem = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="flex flex-wrap gap-3 justify-center">
        {payload.map((entry: any, index: number) => {
          const isHidden = hiddenSeries.includes(entry.dataKey);
          
          return (
            <li 
              key={`item-${index}`}
              className={`flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded text-xs
                ${isHidden ? 'opacity-50' : 'opacity-100'}`}
              onClick={() => handleClick(entry.dataKey)}
            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }} 
              />
              <span>{entry.value}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return <Legend content={renderLegendItem} {...props} />;
};
