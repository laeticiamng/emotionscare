
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import type { MoodData } from '@/types';
import MoodChartTooltip from './MoodChartTooltip';

interface MoodLineChartProps {
  data: MoodData[];
}

const MoodLineChart: React.FC<MoodLineChartProps> = ({ data }) => {
  return (
    <div className="h-80">
      <ChartContainer 
        config={{
          sentiment: { color: '#4A90E2' },
          anxiety: { color: '#E53E3E' },
          energy: { color: '#38A169' }
        }}
      >
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip content={<MoodChartTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="sentiment" 
            name="Sentiment" 
            stroke="#4A90E2" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            dataKey="anxiety" 
            name="Anxiété" 
            stroke="#E53E3E" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            dataKey="energy" 
            name="Énergie" 
            stroke="#38A169" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default MoodLineChart;
