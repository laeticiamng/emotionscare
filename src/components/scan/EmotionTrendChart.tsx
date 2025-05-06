
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { ChartInteractiveLegend, ZoomableChart } from '@/components/ui/chart';
import { useMediaQuery } from '@/hooks/use-media-query';
import type { Emotion } from '@/types';

interface EmotionTrendChartProps {
  emotions: Emotion[];
  days?: number;
}

const EmotionTrendChart: React.FC<EmotionTrendChartProps> = ({ emotions, days = 7 }) => {
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Format data for the chart and add previous values for delta calculation
  const chartData = React.useMemo(() => {
    const recentEmotions = emotions.slice(0, days).reverse();
    
    return recentEmotions.map((emotion, idx) => ({
      date: new Date(emotion.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      score: emotion.score || 0,
      emotion: emotion.emotion,
      previousScore: idx > 0 ? recentEmotions[idx - 1].score : null
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

  // Create custom tooltip component to show score and delta
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    const currentData = payload[0].payload;
    const score = currentData.score;
    const previousScore = currentData.previousScore;
    
    // Calculate delta percentage if previous value exists
    let deltaPercent = null;
    if (previousScore !== null) {
      deltaPercent = Math.round(((score - previousScore) / Math.abs(previousScore)) * 100);
    }
    
    return (
      <div 
        className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 transition-opacity duration-150 ease-out"
        role="tooltip"
      >
        <div className="text-sm text-gray-500 mb-1">{label}</div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#9b87f5' }}></span>
          <span className="font-medium text-gray-800">
            {score.toLocaleString()}%
          </span>
          {deltaPercent !== null && (
            <span className={`text-sm font-medium ${deltaPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {deltaPercent > 0 ? '+' : ''}{deltaPercent}%
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Émotion: {currentData.emotion}
        </div>
      </div>
    );
  };

  const chartConfig = {
    score: { 
      color: '#9b87f5',
      label: 'Score émotionnel' 
    },
  };

  return (
    <div className="w-full h-64">
      <ZoomableChart data={chartData} config={chartConfig} showControls={!isMobile}>
        <LineChart 
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
            content={<CustomTooltip />}
            wrapperStyle={{ overflow: 'visible' }} 
            cursor={{ stroke: '#f0f0f0', strokeWidth: 1 }}
            trigger={isMobile ? "click" : "hover"}
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
      </ZoomableChart>
    </div>
  );
};

export default EmotionTrendChart;
