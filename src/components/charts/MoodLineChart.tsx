import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/providers/theme';

export interface MoodData {
  date: string;
  value: number;
  label?: string;
  mood?: string;
  emotion?: string;
}

export interface MoodLineChartProps {
  data: MoodData[];
  height?: number;
}

export const MoodLineChart: React.FC<MoodLineChartProps> = ({
  data,
  height = 250,
}) => {
  const { theme } = useTheme();
  
  // Determine colors based on theme
  const gridColor = theme === 'dark' ? '#333' : '#e5e7eb';
  const axisColor = theme === 'dark' ? '#888' : '#666';
  const lineColor = theme === 'dark' ? '#38bdf8' : '#0ea5e9';
  const cursorColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-lg text-sm">
          <p className="font-medium">{formatDate(label)}</p>
          <p>
            <span className="text-primary mr-1.5">Mood:</span>
            {data.value.toFixed(1)}
          </p>
          {data.emotion && (
            <p>
              <span className="text-primary mr-1.5">Émotion:</span>
              {data.emotion}
            </p>
          )}
          {data.label && <p className="mt-1 text-muted-foreground">{data.label}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke={axisColor}
            />
            <YAxis stroke={axisColor} domain={[0, 10]} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: cursorColor }} />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name="Humeur"
              stroke={lineColor}
              activeDot={{ r: 6 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoodLineChart;
