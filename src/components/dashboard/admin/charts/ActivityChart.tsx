
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ActivityData {
  date: string;
  journal?: number;
  music?: number;
  scan?: number;
  coach?: number;
  vr?: number;
  [key: string]: string | number | undefined;
}

interface ActivityChartProps {
  data: ActivityData[];
  height?: number;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data, height = 350 }) => {
  // Define colors for different activities
  const activityColors = {
    journal: '#4f46e5',
    music: '#06b6d4',
    scan: '#10b981',
    coach: '#f59e0b',
    vr: '#ec4899'
  };

  // Get all keys except 'date' to use as lines
  const activityTypes = Object.keys(data[0] || {})
    .filter(key => key !== 'date')
    .sort();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        
        {activityTypes.map((activityType) => (
          <Line 
            key={activityType} 
            type="monotone" 
            dataKey={activityType} 
            name={activityType.charAt(0).toUpperCase() + activityType.slice(1)} 
            stroke={activityColors[activityType] || '#888'} 
            activeDot={{ r: 8 }} 
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ActivityChart;
