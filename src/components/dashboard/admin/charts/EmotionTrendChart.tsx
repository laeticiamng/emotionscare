// @ts-nocheck
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface EmotionTrendData {
  date: string;
  calm: number;
  happy: number;
  anxious: number;
  sad: number;
  [key: string]: string | number;
}

interface EmotionTrendChartProps {
  data: EmotionTrendData[];
  height?: number;
  stackedView?: boolean;
}

const EmotionTrendChart: React.FC<EmotionTrendChartProps> = ({ 
  data, 
  height = 350,
  stackedView = false
}) => {
  // Define colors for different emotions
  const emotionColors = {
    calm: '#0ea5e9',
    happy: '#22c55e',
    anxious: '#f97316',
    sad: '#6366f1',
    angry: '#ef4444',
    neutral: '#94a3b8'
  };

  // Get all keys except 'date' to use as areas
  const emotionTypes = Object.keys(data[0] || {})
    .filter(key => key !== 'date')
    .sort();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        
        {emotionTypes.map((emotion) => (
          <Area
            key={emotion}
            type="monotone"
            dataKey={emotion}
            name={emotion.charAt(0).toUpperCase() + emotion.slice(1)}
            stroke={emotionColors[emotion] || '#888'}
            fill={emotionColors[emotion] || '#888'}
            stackId={stackedView ? "1" : undefined}
            fillOpacity={stackedView ? 0.6 : 0.3}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default EmotionTrendChart;
