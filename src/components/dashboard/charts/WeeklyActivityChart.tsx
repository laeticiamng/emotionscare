
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyActivityChartProps {
  data: Array<{
    day: string;
    value: number;
  }>;
  color?: string;
}

const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({ 
  data, 
  color = "#8884d8" 
}) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" />
        <YAxis hide />
        <Tooltip 
          formatter={(value) => [`${value} activités`, 'Activités']}
          labelFormatter={(label) => `${label}`}
        />
        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WeeklyActivityChart;
