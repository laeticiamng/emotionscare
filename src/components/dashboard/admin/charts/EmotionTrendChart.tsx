
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EmotionTrendChartProps {
  data: Array<{
    date: string;
    [key: string]: number | string;
  }>;
  emotions: Array<{
    name: string;
    color: string;
  }>;
  height?: number;
}

const EmotionTrendChart: React.FC<EmotionTrendChartProps> = ({ 
  data, 
  emotions,
  height = 300
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3} />
        <XAxis dataKey="date" />
        <YAxis hide />
        <Tooltip />
        {emotions.map((emotion, index) => (
          <Area
            key={emotion.name}
            type="monotone"
            dataKey={emotion.name}
            stackId="1"
            stroke={emotion.color}
            fill={emotion.color}
            fillOpacity={0.6}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default EmotionTrendChart;
