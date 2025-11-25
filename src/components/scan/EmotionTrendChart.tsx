// @ts-nocheck

import React from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EmotionResult } from '@/types/emotion';

interface EmotionTrendChartProps {
  data: EmotionResult[];
  height?: number;
  className?: string;
}

const EmotionTrendChart: React.FC<EmotionTrendChartProps> = ({
  data,
  height = 300,
  className
}) => {
  // Transformer les données pour le graphique
  const chartData = data.map(item => ({
    date: new Date(item.timestamp || Date.now()).toLocaleDateString(),
    score: item.score,
    emotion: item.emotion
  }));

  // Mapper les émotions à des couleurs
  const emotionColors: Record<string, string> = {
    happy: '#4ade80',
    sad: '#60a5fa',
    angry: '#ef4444',
    fear: '#a855f7',
    disgust: '#84cc16',
    surprise: '#f59e0b',
    neutral: '#94a3b8',
    calm: '#38bdf8',
    excited: '#fb923c',
    stressed: '#f87171'
  };

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 1]} />
          <Tooltip 
            formatter={(value: number) => [(value * 100).toFixed(0) + '%']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            name="Intensité émotionnelle"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmotionTrendChart;
