
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WeeklyActivityChartProps {
  data: Array<{
    day: string;
    journal: number;
    music: number;
    scan: number;
    coach: number;
  }>;
}

const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={12} barGap={2}>
        <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis hide />
        <Tooltip 
          cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} 
          contentStyle={{ borderRadius: '8px', fontSize: '12px' }} 
        />
        <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
        <Bar dataKey="journal" name="Journal" fill="#4F46E5" radius={[4, 4, 0, 0]} />
        <Bar dataKey="music" name="Musique" fill="#EC4899" radius={[4, 4, 0, 0]} />
        <Bar dataKey="scan" name="Scan" fill="#EAB308" radius={[4, 4, 0, 0]} />
        <Bar dataKey="coach" name="Coach" fill="#10B981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WeeklyActivityChart;
