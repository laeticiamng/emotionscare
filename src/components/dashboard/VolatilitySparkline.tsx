// @ts-nocheck
import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

interface VolatilitySparklineProps {
  series: { week: string; value: number }[];
}

export const VolatilitySparkline: React.FC<VolatilitySparklineProps> = ({ series }) => {
  return (
    <div className="w-24 h-8" aria-label="Variation émotionnelle">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series} margin={{ top: 2, bottom: 2 }}>
          <Tooltip formatter={(v: number) => v.toFixed(2)} />
          <Line type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={0.2} dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VolatilitySparkline;
