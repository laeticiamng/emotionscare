
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { day: 'Lun', value: 42 },
  { day: 'Mar', value: 38 },
  { day: 'Mer', value: 45 },
  { day: 'Jeu', value: 50 },
  { day: 'Ven', value: 37 },
  { day: 'Sam', value: 18 },
  { day: 'Dim', value: 12 },
];

const UserActivityChart: React.FC = () => {
  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={mockData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`${value} interactions`, 'Activité']}
            contentStyle={{ 
              background: 'var(--background)', 
              border: '1px solid var(--border)' 
            }}
          />
          <Bar 
            dataKey="value" 
            fill="var(--primary)" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserActivityChart;
