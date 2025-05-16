
import React from 'react';
import { ResponsiveContainer } from 'recharts';

interface ChartContainerProps {
  children: React.ReactNode;
  aspectRatio?: number;
  className?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  aspectRatio = 2,
  className = '',
}) => {
  // Safely handle children to ensure it's a valid React element
  const safeChildren = React.Children.only(children);

  return (
    <div
      className={`w-full ${className}`}
      style={{
        aspectRatio: aspectRatio.toString(),
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {safeChildren}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartContainer;
