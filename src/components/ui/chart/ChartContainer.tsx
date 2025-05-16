
import React, { ReactNode } from 'react';
import { ResponsiveContainer } from 'recharts';

export interface ChartContainerProps {
  children: ReactNode;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  width = '100%',
  height = 300,
  className,
}) => {
  return (
    <div className={className}>
      <ResponsiveContainer width={width} height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
};
