
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { ChartInteractiveLegend } from '@/components/ui/chart';
import { useMediaQuery } from '@/hooks/use-mobile';
import type { Emotion } from '@/types';

interface EmotionTrendChartProps {
  emotions: Emotion[];
  days?: number;
}

const EmotionTrendChart: React.FC<EmotionTrendChartProps> = ({ emotions, days = 7 }) => {
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Format data for the chart
  const chartData = React.useMemo(() => {
    const recentEmotions = emotions.slice(0, days).reverse();
    
    return recentEmotions.map(emotion => ({
      date: new Date(emotion.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      score: emotion.score || 0,
      emotion: emotion.emotion
    }));
  }, [emotions, days]);

  // Get color based on emotion score
  const getScoreColor = (score: number) => {
    if (score >= 70) return '#10b981'; // green
    if (score >= 40) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const handleToggleSeries = (dataKey: string, isHidden: boolean) => {
    if (isHidden) {
      setHiddenSeries(hiddenSeries.filter(key => key !== dataKey));
    } else {
      setHiddenSeries([...hiddenSeries, dataKey]);
    }
  };

  if (emotions.length === 0) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        Aucune donnée émotionnelle disponible pour créer un graphique.
      </Card>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 100]} 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            formatter={(value: number) => [`${value}%`, 'Score']}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{ borderRadius: '8px', padding: '10px' }}
          />
          {!hiddenSeries.includes('score') && (
            <Line
              type="monotone"
              dataKey="score"
              stroke="#9b87f5"
              strokeWidth={3}
              dot={{ stroke: '#9b87f5', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 8, fill: '#7E69AB' }}
              name="Score émotionnel"
            />
          )}
          <ChartInteractiveLegend 
            onToggleSeries={handleToggleSeries}
            hiddenSeries={hiddenSeries}
            verticalAlign={isMobile ? "bottom" : "top"}
            align="right"
            layout={isMobile ? "vertical" : "horizontal"}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmotionTrendChart;
