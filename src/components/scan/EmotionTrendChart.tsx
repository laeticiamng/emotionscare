
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Emotion } from '@/types/types';

export interface EmotionTrendChartProps {
  emotions: Emotion[];
  loading?: boolean;
}

const EmotionTrendChart: React.FC<EmotionTrendChartProps> = ({ emotions, loading = false }) => {
  if (loading) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Tendance émotionnelle</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }
  
  // Format data for the chart, using date field directly since timestamp and created_at are not guaranteed
  const chartData = emotions.slice(-30).map(emotion => ({
    date: new Date(emotion.date || Date.now()).toLocaleDateString(),
    score: emotion.score || 0,
    emotion: emotion.emotion || 'unknown',
  }));
  
  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Tendance émotionnelle</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip 
                formatter={(value) => [`${value}`, 'Score']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="Score émotionnel"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">Pas assez de données pour afficher le graphique</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionTrendChart;
