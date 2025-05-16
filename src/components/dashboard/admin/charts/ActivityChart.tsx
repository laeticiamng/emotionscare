
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ActivityChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
  color?: string;
  height?: number;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ 
  data, 
  color = "#8884d8",
  height = 300
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3} />
        <XAxis dataKey="date" />
        <YAxis hide />
        <Tooltip 
          formatter={(value) => [`${value}`, 'Activités']}
          labelFormatter={(label) => `${label}`}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ActivityChart;
