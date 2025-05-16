
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

export interface MoodData {
  date: string;
  value: number;
  label?: string;
}

export interface MoodLineChartProps {
  data: MoodData[];
  showControls?: boolean;
}

export const MoodLineChart: React.FC<MoodLineChartProps> = ({ 
  data,
  showControls = true
}) => {
  // Function to get color based on mood value
  const getMoodColor = (value: number) => {
    if (value >= 8) return '#10b981'; // Very positive - green
    if (value >= 6) return '#60a5fa'; // Positive - blue
    if (value >= 4) return '#a78bfa'; // Neutral - purple
    if (value >= 2) return '#f59e0b'; // Negative - orange
    return '#ef4444'; // Very negative - red
  };

  // Get domain for YAxis
  const yDomain = [0, 10];

  // Format date for XAxis
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    } catch (e) {
      return dateStr;
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label).toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
      
      const moodValue = payload[0].value;
      let moodLabel = 'Neutre';
      
      if (moodValue >= 8) moodLabel = 'Très positif';
      else if (moodValue >= 6) moodLabel = 'Positif';
      else if (moodValue >= 4) moodLabel = 'Neutre';
      else if (moodValue >= 2) moodLabel = 'Négatif';
      else moodLabel = 'Très négatif';
      
      return (
        <div className="bg-background p-3 rounded-md border shadow-sm">
          <p className="font-medium">{date}</p>
          <p className="text-sm">
            Émotion: <span style={{ color: getMoodColor(moodValue) }}>{moodLabel}</span>
          </p>
          <p className="text-xs text-muted-foreground">Valeur: {moodValue}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" opacity={0.4} />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate} 
            stroke="var(--muted-foreground)" 
          />
          <YAxis 
            domain={yDomain} 
            ticks={[0, 2, 4, 6, 8, 10]}
            stroke="var(--muted-foreground)"
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={5} stroke="var(--muted)" strokeDasharray="3 3" />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="var(--primary)" 
            strokeWidth={2}
            dot={{ 
              stroke: 'var(--primary)', 
              strokeWidth: 2, 
              r: 4, 
              fill: 'var(--background)' 
            }}
            activeDot={{ 
              stroke: 'var(--primary)', 
              strokeWidth: 2, 
              r: 6, 
              fill: 'var(--background)' 
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodLineChart;
