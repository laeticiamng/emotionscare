
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export interface MoodData {
  date: string;
  value: number;
  label?: string;
  category?: string;
}

export interface MoodLineChartProps {
  data: MoodData[];
  showControls?: boolean;
  height?: number;
  colors?: {
    line: string;
    grid: string;
    tooltip: string;
  };
}

export const MoodLineChart: React.FC<MoodLineChartProps> = ({
  data,
  showControls = true,
  height = 300,
  colors = {
    line: '#3b82f6',
    grid: '#e5e7eb',
    tooltip: '#f3f4f6',
  },
}) => {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const filteredData = React.useMemo(() => {
    if (period === 'all') return data;
    
    const now = new Date();
    let daysAgo: number;
    
    switch (period) {
      case '7d':
        daysAgo = 7;
        break;
      case '30d':
        daysAgo = 30;
        break;
      case '90d':
        daysAgo = 90;
        break;
      default:
        daysAgo = 30;
    }
    
    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - daysAgo);
    
    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= cutoffDate;
    });
  }, [data, period]);
  
  return (
    <div className="space-y-4">
      {showControls && (
        <div className="flex justify-end">
          <ToggleGroup type="single" value={period} onValueChange={(value) => value && setPeriod(value as any)}>
            <ToggleGroupItem value="7d" aria-label="7 jours">7j</ToggleGroupItem>
            <ToggleGroupItem value="30d" aria-label="30 jours">30j</ToggleGroupItem>
            <ToggleGroupItem value="90d" aria-label="90 jours">90j</ToggleGroupItem>
            <ToggleGroupItem value="all" aria-label="Tout">Tout</ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}
      
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis 
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: colors.tooltip }}
              formatter={(value: number) => [`${value}%`, 'Humeur']}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke={colors.line}
              activeDot={{ r: 8 }}
              name="Niveau d'humeur"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoodLineChart;
