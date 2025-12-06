
import React from 'react';
import { LineChart as RechartsLineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: Array<{ date: string; value: number }>;
  height?: number;
  color?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  dateFormat?: string;
}

const LineChart = ({ 
  data,
  height = 300,
  color = '#3b82f6',
  showGrid = true,
  showTooltip = true,
  dateFormat = 'MMM dd'
}: LineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
        <XAxis 
          dataKey="date" 
          tickFormatter={(value) => {
            try {
              const date = new Date(value);
              return date.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric'
              });
            } catch (e) {
              return value;
            }
          }}
          stroke="#94a3b8"
          fontSize={12}
        />
        <YAxis stroke="#94a3b8" fontSize={12} />
        {showTooltip && <Tooltip />}
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={2}
          dot={{ stroke: color, strokeWidth: 2, r: 3 }}
          activeDot={{ stroke: color, strokeWidth: 2, r: 4 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
