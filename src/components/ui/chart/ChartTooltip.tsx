
import React, { ReactNode } from 'react';
import { Tooltip, TooltipProps } from 'recharts';

export interface ChartTooltipProps extends Partial<TooltipProps> {
  content?: ReactNode;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ content, ...props }) => {
  return <Tooltip content={content as any} {...props} />;
};
