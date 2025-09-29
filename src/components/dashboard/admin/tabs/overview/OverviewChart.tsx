
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { Card } from '@/components/ui/card';

// Mock data for the chart
const data = [
  { name: 'Lundi', bien_etre: 65, presence: 82, alerts: 2 },
  { name: 'Mardi', bien_etre: 68, presence: 85, alerts: 1 },
  { name: 'Mercredi', bien_etre: 75, presence: 86, alerts: 0 },
  { name: 'Jeudi', bien_etre: 74, presence: 84, alerts: 0 },
  { name: 'Vendredi', bien_etre: 69, presence: 80, alerts: 1 },
  { name: 'Samedi', bien_etre: 72, presence: 45, alerts: 0 },
  { name: 'Dimanche', bien_etre: 78, presence: 20, alerts: 0 },
];

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <Card className="p-3 text-xs border bg-background shadow-lg">
        <p className="font-medium mb-1">{label}</p>
        <div className="space-y-1">
          <p className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></span>
            <span>Bien-être: </span>
            <span className="ml-1 font-medium">{payload[0]?.value}%</span>
          </p>
          <p className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></span>
            <span>Présence: </span>
            <span className="ml-1 font-medium">{payload[1]?.value}%</span>
          </p>
          <p className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-amber-500 mr-1.5"></span>
            <span>Alertes: </span>
            <span className="ml-1 font-medium">{payload[2]?.value}</span>
          </p>
        </div>
      </Card>
    );
  }

  return null;
};

const OverviewChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: -20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" opacity={0.3} />
        <XAxis 
          dataKey="name" 
          fontSize={12} 
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
          tick={{ fill: 'var(--muted-foreground)' }}
        />
        <YAxis 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted-foreground)' }}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          name="Bien-être"
          dataKey="bien_etre"
          stroke="var(--primary)"
          activeDot={{ r: 8 }}
          dot={{ strokeWidth: 2 }}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          name="Présence"
          dataKey="presence"
          stroke="#10b981"
          dot={{ strokeWidth: 2 }}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          name="Alertes"
          dataKey="alerts"
          stroke="#f59e0b"
          dot={{ strokeWidth: 2 }}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default OverviewChart;
