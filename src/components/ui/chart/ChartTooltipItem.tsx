
import React from 'react';
import { getPayloadConfigFromPayload } from './ChartTooltip';

interface ChartTooltipItemProps {
  payload: any;
  formatter?: (value: any) => string;
  className?: string;
}

export const ChartTooltipItem: React.FC<ChartTooltipItemProps> = ({
  payload,
  formatter,
  className = '',
}) => {
  const config = getPayloadConfigFromPayload(payload);
  const value = formatter ? formatter(config.value) : config.value;

  return (
    <div className={`flex items-center ${className}`}>
      <div
        className="w-3 h-3 rounded-sm mr-2"
        style={{ backgroundColor: config.color || config.fill || config.stroke }}
      />
      <span className="text-muted-foreground mr-1">{config.name}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
};

export default ChartTooltipItem;
