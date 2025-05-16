
import React from 'react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionTrendChartProps } from '@/types/emotion';

export const EmotionTrendChart: React.FC<EmotionTrendChartProps> = ({ 
  emotions, 
  period = 'week' 
}) => {
  // Process data for chart
  const processChartData = () => {
    // Group by date
    const groupedByDate: Record<string, any> = {};
    
    emotions.forEach(emotion => {
      const date = emotion.date || (emotion.timestamp ? new Date(emotion.timestamp).toISOString().split('T')[0] : 'unknown');
      
      if (!groupedByDate[date]) {
        groupedByDate[date] = {
          date,
          joy: 0,
          anxiety: 0,
          sadness: 0,
          frustration: 0,
          neutral: 0,
          excitement: 0,
          gratitude: 0,
          calmness: 0
        };
      }
      
      // Increment the counter for this emotion
      const emotionType = emotion.emotion || 'neutral';
      groupedByDate[date][emotionType] = (groupedByDate[date][emotionType] || 0) + 1;
    });
    
    // Convert to array and sort by date
    return Object.values(groupedByDate).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const chartData = processChartData();
  
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'unknown') return 'N/A';
    
    const date = new Date(dateString);
    
    if (period === 'week') {
      return new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(date);
    } else if (period === 'month') {
      return `${date.getDate()}/${date.getMonth() + 1}`;
    } else {
      return `${date.getMonth() + 1}/${date.getFullYear().toString().substring(2)}`;
    }
  };
  
  const getEmotionColor = (emotion: string): string => {
    const colors: Record<string, string> = {
      joy: '#22c55e',
      neutral: '#6b7280',
      anxiety: '#ef4444',
      sadness: '#3b82f6',
      frustration: '#f97316',
      excitement: '#8b5cf6',
      gratitude: '#f59e0b',
      calmness: '#0ea5e9'
    };
    return colors[emotion] || '#6b7280';
  };
  
  const getEmotionName = (emotion: string): string => {
    const names: Record<string, string> = {
      joy: 'Joie',
      neutral: 'Neutre',
      anxiety: 'Anxiété',
      sadness: 'Tristesse',
      frustration: 'Frustration',
      excitement: 'Enthousiasme',
      gratitude: 'Gratitude',
      calmness: 'Calme'
    };
    return names[emotion] || emotion;
  };

  // Get all emotions that have data
  const activeEmotions = ['joy', 'neutral', 'anxiety', 'sadness', 'frustration', 'excitement', 'gratitude', 'calmness']
    .filter(emotion => 
      chartData.some(day => day[emotion] > 0)
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendance des émotions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={chartData} 
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                {activeEmotions.map(emotion => (
                  <linearGradient key={emotion} id={`color-${emotion}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={getEmotionColor(emotion)} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={getEmotionColor(emotion)} stopOpacity={0.1}/>
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip 
                labelFormatter={formatDate}
                formatter={(value, name) => [value, getEmotionName(name)]}
              />
              <Legend formatter={(value) => getEmotionName(value)} />
              {activeEmotions.map(emotion => (
                <Area 
                  key={emotion}
                  type="monotone" 
                  dataKey={emotion} 
                  name={emotion}
                  stroke={getEmotionColor(emotion)} 
                  fillOpacity={1}
                  fill={`url(#color-${emotion})`} 
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
