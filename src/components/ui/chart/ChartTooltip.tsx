
import React, { ReactNode } from 'react';

export interface ChartTooltipProps {
  children: ReactNode;
  className?: string;
  content?: ReactNode;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ 
  children, 
  className = '',
  content 
}) => {
  return (
    <div className={`absolute bg-background border border-border rounded-md shadow-md p-2 pointer-events-none z-50 ${className}`}>
      {content || children}
    </div>
  );
};
