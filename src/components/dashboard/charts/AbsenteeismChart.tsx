
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AbsenteeismChartProps {
  data?: Array<{ date: string; value: number }>;
  className?: string;
}

const defaultData = [
  { date: '01/01', value: 4 },
  { date: '01/08', value: 3 },
  { date: '01/15', value: 6 },
  { date: '01/22', value: 8 },
  { date: '01/29', value: 5 },
  { date: '02/05', value: 4 },
  { date: '02/12', value: 3 },
];

export const AbsenteeismChart: React.FC<AbsenteeismChartProps> = ({ data = defaultData, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Absentéisme</CardTitle>
        <CardDescription>Taux d'absentéisme hebdomadaire</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AbsenteeismChart;
