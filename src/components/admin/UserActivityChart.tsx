
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { month: 'Jan', users: 400 },
  { month: 'Fév', users: 300 },
  { month: 'Mar', users: 500 },
  { month: 'Avr', users: 450 },
  { month: 'Mai', users: 600 },
  { month: 'Jun', users: 550 },
];

const UserActivityChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité Utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export { UserActivityChart };
export default UserActivityChart;
