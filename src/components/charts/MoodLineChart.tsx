
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface MoodData {
  date: string;
  value: number;
  label?: string;
}

export interface MoodLineChartProps {
  data: MoodData[];
  showControls?: boolean;
  height?: number;
}

export const MoodLineChart: React.FC<MoodLineChartProps> = ({
  data,
  showControls = true,
  height = 300
}) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  // Filter data based on time range
  const filteredData = data.slice(0, timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365);

  const getColorByMood = (value: number) => {
    if (value >= 8) return '#4ade80'; // Happy - green
    if (value >= 6) return '#60a5fa'; // Content - blue
    if (value >= 4) return '#facc15'; // Neutral - yellow
    if (value >= 2) return '#fb923c'; // Sad - orange
    return '#f87171'; // Depressed - red
  };

  return (
    <div>
      {showControls && (
        <div className="flex justify-end space-x-2 mb-4">
          <Button 
            variant={timeRange === 'week' ? 'default' : 'outline'} 
            onClick={() => setTimeRange('week')}
            size="sm"
          >
            Semaine
          </Button>
          <Button 
            variant={timeRange === 'month' ? 'default' : 'outline'} 
            onClick={() => setTimeRange('month')}
            size="sm"
          >
            Mois
          </Button>
          <Button 
            variant={timeRange === 'year' ? 'default' : 'outline'} 
            onClick={() => setTimeRange('year')}
            size="sm"
          >
            Année
          </Button>
        </div>
      )}
      
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name="Humeur"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoodLineChart;
