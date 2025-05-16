
import React, { ReactNode } from 'react';

interface ChartTooltipProps {
  children: ReactNode;
  className?: string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ children, className = '' }) => {
  return (
    <div className={`absolute bg-background border border-border rounded-md shadow-md p-2 pointer-events-none z-50 ${className}`}>
      {children}
    </div>
  );
};
