// @ts-nocheck

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EmotionData {
  date: string;
  emotion: string;
  intensity: number;
  notes?: string;
}

interface EmotionChartProps {
  data: EmotionData[];
}

const EmotionChart: React.FC<EmotionChartProps> = ({ data }) => {
  // Map emotions to numerical values for the chart
  const emotionMap: Record<string, number> = {
    'happy': 5,
    'calm': 4,
    'neutral': 3,
    'frustrated': 2,
    'anxious': 1,
    'sad': 0
  };
  
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
    emotionValue: emotionMap[item.emotion] || 3,
    intensity: item.intensity,
    emotion: item.emotion
  }));

  const emotionToColor = (emotion: string) => {
    switch (emotion) {
      case 'happy': return '#FBBF24';
      case 'calm': return '#34D399';
      case 'neutral': return '#9CA3AF';
      case 'frustrated': return '#F87171';
      case 'anxious': return '#FCD34D';
      case 'sad': return '#60A5FA';
      default: return '#9CA3AF';
    }
  };
  
  // Create custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      const emotionName = Object.keys(emotionMap).find(
        key => emotionMap[key] === data.emotionValue
      ) || 'neutral';
      
      return (
        <div className="bg-background p-2 border rounded shadow-sm">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs capitalize" style={{ color: emotionToColor(data.emotion) }}>
            {data.emotion}
          </p>
          <p className="text-xs">Intensité: {data.intensity}/10</p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
          <YAxis
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tickFormatter={(value) => {
              const emotions = ['sad', 'anxious', 'frustrated', 'neutral', 'calm', 'happy'];
              return emotions[value] || '';
            }}
            className="text-xs fill-muted-foreground capitalize"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="emotionValue"
            name="Émotion"
            stroke="#3B82F6"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            dot={{ stroke: '#3B82F6', strokeWidth: 2, r: 4, fill: 'white' }}
          />
          <Line
            type="monotone"
            dataKey="intensity"
            name="Intensité"
            stroke="#EC4899"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ stroke: '#EC4899', strokeWidth: 2, r: 4, fill: 'white' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmotionChart;
