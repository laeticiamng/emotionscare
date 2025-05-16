
import React from 'react';
import { Legend } from 'recharts';
import { getPayloadConfigFromPayload } from './ChartTooltip';

interface ChartLegendProps {
  align?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  layout?: 'horizontal' | 'vertical';
  iconType?: 'line' | 'plainline' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye' | 'none';
  iconSize?: number;
  className?: string;
}

interface RenderCustomLegendProps {
  payload?: any[];
}

export const ChartLegend: React.FC<ChartLegendProps> = ({
  align = 'center',
  verticalAlign = 'bottom',
  layout = 'horizontal',
  iconType = 'circle',
  iconSize = 10,
  className = '',
}) => {
  const renderCustomLegend = ({ payload }: RenderCustomLegendProps) => {
    if (!payload || payload.length === 0) return null;

    return (
      <div className={`flex flex-wrap justify-${align} gap-4 pt-2 ${className}`}>
        {payload.map((entry, index) => {
          const config = {
            color: entry.color,
            name: entry.value,
          };

          return (
            <div key={`legend-item-${index}`} className="flex items-center">
              <div
                className={`mr-2 ${iconType === 'circle' ? 'rounded-full' : 'rounded'}`}
                style={{
                  backgroundColor: config.color,
                  width: iconSize,
                  height: iconSize,
                }}
              />
              <span className="text-xs text-muted-foreground">{config.name}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Legend
      content={renderCustomLegend}
      align={align}
      verticalAlign={verticalAlign}
      layout={layout}
      iconType={iconType}
      iconSize={iconSize}
    />
  );
};

export default ChartLegend;
