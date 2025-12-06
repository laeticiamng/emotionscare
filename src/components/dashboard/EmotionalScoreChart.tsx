// @ts-nocheck

import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface EmotionalScoreChartProps {
  data: Array<{
    date: string;
    value: number;
    originalDate?: Date;
    sentiment?: number;
    anxiety?: number;
    energy?: number;
  }>;
  showTooltip?: boolean;
}

export const EmotionalScoreChart: React.FC<EmotionalScoreChartProps> = ({ data, showTooltip = true }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="date" 
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis 
          domain={[0, 100]}
          tickLine={false}
          axisLine={false}
          dx={-10}
        />
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        {showTooltip && (
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #f0f0f0',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
        )}
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#8884d8" 
          fillOpacity={1} 
          fill="url(#colorScore)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
