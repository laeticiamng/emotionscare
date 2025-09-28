
import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface WeeklyActivityChartProps {
  data: Array<{
    day: string;
    value?: number;
    journal?: number;
    music?: number;
    scan?: number;
    coach?: number;
    [key: string]: any;
  }>;
  height?: number;
}

const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({ 
  data,
  height = 300
}) => {
  // Transform data if needed to ensure it has a 'value' property
  const transformedData = data.map(item => {
    if (item.value !== undefined) {
      return item;
    }
    // If there's no value property, but there are activity-specific properties,
    // calculate a total value
    if (item.journal !== undefined || item.music !== undefined || 
        item.scan !== undefined || item.coach !== undefined) {
      return {
        ...item,
        value: (item.journal || 0) + (item.music || 0) + (item.scan || 0) + (item.coach || 0)
      };
    }
    return item;
  });
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={transformedData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="day" 
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          fontSize={12}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          fontSize={12}
        />
        <Tooltip 
          formatter={(value: number) => [`${value} minutes`, 'Durée']}
          labelFormatter={(label) => `Jour: ${label}`}
          contentStyle={{ 
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            padding: '0.5rem',
            fontSize: '0.75rem'
          }}
        />
        <Bar 
          dataKey="value" 
          fill="var(--primary)" 
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
        {data[0]?.journal !== undefined && (
          <Bar 
            dataKey="journal" 
            name="Journal" 
            fill="#4CAF50"
            radius={[4, 4, 0, 0]}
            stackId="activity"
            maxBarSize={40}
          />
        )}
        {data[0]?.music !== undefined && (
          <Bar 
            dataKey="music" 
            name="Musique" 
            fill="#2196F3"
            radius={[0, 0, 0, 0]}
            stackId="activity"
            maxBarSize={40}
          />
        )}
        {data[0]?.scan !== undefined && (
          <Bar 
            dataKey="scan" 
            name="Scan" 
            fill="#FF9800"
            radius={[0, 0, 0, 0]}
            stackId="activity"
            maxBarSize={40}
          />
        )}
        {data[0]?.coach !== undefined && (
          <Bar 
            dataKey="coach" 
            name="Coach" 
            fill="#9C27B0"
            radius={[0, 0, 4, 4]}
            stackId="activity"
            maxBarSize={40}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WeeklyActivityChart;
