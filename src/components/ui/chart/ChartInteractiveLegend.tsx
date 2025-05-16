
import React, { useState } from 'react';

export interface ChartInteractiveLegendProps {
  onToggleSeries?: (dataKey: string, isHidden: boolean) => void;
  hiddenSeries?: string[];
  verticalAlign?: 'top' | 'middle' | 'bottom';
  align?: 'left' | 'center' | 'right';
  layout?: 'horizontal' | 'vertical';
  children?: React.ReactNode;
}

export const ChartInteractiveLegend: React.FC<ChartInteractiveLegendProps> = ({
  onToggleSeries,
  hiddenSeries = [],
  verticalAlign = 'bottom',
  align = 'center',
  layout = 'horizontal',
  children
}) => {
  const [localHiddenSeries, setLocalHiddenSeries] = useState<string[]>(hiddenSeries);

  const handleToggle = (dataKey: string) => {
    const isHidden = localHiddenSeries.includes(dataKey);
    const newHiddenSeries = isHidden 
      ? localHiddenSeries.filter(key => key !== dataKey)
      : [...localHiddenSeries, dataKey];
    
    setLocalHiddenSeries(newHiddenSeries);
    
    if (onToggleSeries) {
      onToggleSeries(dataKey, !isHidden);
    }
  };

  return (
    <div 
      className={`
        flex 
        ${layout === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'} 
        gap-2 
        mt-2 
        ${verticalAlign === 'top' ? 'items-start' : verticalAlign === 'bottom' ? 'items-end' : 'items-center'} 
        ${align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center'}
      `}
    >
      {children}
    </div>
  );
};
