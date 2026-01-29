/**
 * Emotion History Chart Component
 * Graphique d'évolution des émotions sur 7 jours
 * MODULE 8 - Context Lens
 */

import React, { memo, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { contextLensApi } from '../services/contextLensApi';
import type { EmotionHistory } from '../types';

const EMOTION_COLORS = {
  joy: { color: '#10B981', name: 'Joie' },
  anxiety: { color: '#EF4444', name: 'Anxiété' },
  sadness: { color: '#3B82F6', name: 'Tristesse' },
  anger: { color: '#F59E0B', name: 'Colère' },
  disgust: { color: '#8B5CF6', name: 'Dégoût' },
  surprise: { color: '#EC4899', name: 'Surprise' },
};

interface EmotionHistoryChartProps {
  interval?: 'hour' | 'day' | 'week';
  showLegend?: boolean;
  height?: number;
}

const EmotionHistoryChart: React.FC<EmotionHistoryChartProps> = memo(({
  interval = 'day',
  showLegend = true,
  height = 300,
}) => {
  const { data: history, isLoading, error } = useQuery<EmotionHistory | null>({
    queryKey: ['emotion-history', interval],
    queryFn: () => {
      const now = new Date();
      const from = new Date(now.getTime() - (interval === 'hour' ? 24 : interval === 'week' ? 28 : 7) * 24 * 60 * 60 * 1000);
      return contextLensApi.getEmotionHistory({ from: from.toISOString(), to: now.toISOString(), interval });
    },
    staleTime: 60000,
  });

  const chartData = useMemo(() => {
    if (!history?.data) return [];

    return history.data.map((entry) => {
      const date = new Date(entry.timestamp);
      let label: string;

      switch (interval) {
        case 'hour':
          label = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
          break;
        case 'week':
          label = `Sem. ${Math.ceil((date.getDate() + date.getDay()) / 7)}`;
          break;
        default:
          label = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
      }

      return {
        label,
        timestamp: entry.timestamp,
        joy: Math.round((entry.emotions.joy ?? 0) * 100),
        anxiety: Math.round((entry.emotions.anxiety ?? 0) * 100),
        sadness: Math.round((entry.emotions.sadness ?? 0) * 100),
        anger: Math.round((entry.emotions.anger ?? 0) * 100),
        disgust: Math.round((entry.emotions.disgust ?? 0) * 100),
        surprise: Math.round((entry.emotions.surprise ?? 0) * 100),
      };
    });
  }, [history, interval]);

  const dominantTrend = useMemo(() => {
    if (chartData.length < 2) return null;

    const emotions = ['joy', 'anxiety', 'sadness', 'anger'] as const;
    const trends: Record<string, { change: number; direction: 'up' | 'down' | 'stable' }> = {};

    emotions.forEach((emotion) => {
      const first = chartData.slice(0, Math.floor(chartData.length / 2));
      const second = chartData.slice(Math.floor(chartData.length / 2));

      const avgFirst = first.reduce((sum, d) => sum + (d[emotion] || 0), 0) / first.length;
      const avgSecond = second.reduce((sum, d) => sum + (d[emotion] || 0), 0) / second.length;

      const change = avgSecond - avgFirst;
      trends[emotion] = {
        change: Math.round(change),
        direction: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
      };
    });

    return trends;
  }, [chartData]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !history) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          Impossible de charger l'historique émotionnel
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Évolution émotionnelle</CardTitle>
            <CardDescription>
              {interval === 'hour' ? 'Dernières 24 heures' : interval === 'week' ? '4 dernières semaines' : '7 derniers jours'}
            </CardDescription>
          </div>

          {/* Tendances */}
          {dominantTrend && (
            <div className="flex gap-2">
              {Object.entries(dominantTrend).map(([emotion, { change, direction }]) => {
                if (direction === 'stable') return null;
                const info = EMOTION_COLORS[emotion as keyof typeof EMOTION_COLORS];
                return (
                  <Badge
                    key={emotion}
                    variant="outline"
                    className="text-xs"
                    style={{ borderColor: info.color, color: info.color }}
                  >
                    {info.name} {direction === 'up' ? '↑' : '↓'} {Math.abs(change)}%
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {Object.entries(EMOTION_COLORS).map(([key, { color }]) => (
                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number, name: string) => {
                const info = EMOTION_COLORS[name as keyof typeof EMOTION_COLORS];
                return [`${value}%`, info?.name || name];
              }}
            />

            {showLegend && (
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => {
                  const info = EMOTION_COLORS[value as keyof typeof EMOTION_COLORS];
                  return info?.name || value;
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="joy"
              stroke={EMOTION_COLORS.joy.color}
              fill={`url(#gradient-joy)`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Area
              type="monotone"
              dataKey="anxiety"
              stroke={EMOTION_COLORS.anxiety.color}
              fill={`url(#gradient-anxiety)`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Area
              type="monotone"
              dataKey="sadness"
              stroke={EMOTION_COLORS.sadness.color}
              fill={`url(#gradient-sadness)`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Area
              type="monotone"
              dataKey="anger"
              stroke={EMOTION_COLORS.anger.color}
              fill={`url(#gradient-anger)`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

EmotionHistoryChart.displayName = 'EmotionHistoryChart';

// Export avec sélecteur d'intervalle
export const EmotionHistoryWithTabs: React.FC = memo(() => {
  return (
    <Tabs defaultValue="day" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="hour">24h</TabsTrigger>
        <TabsTrigger value="day">7 jours</TabsTrigger>
        <TabsTrigger value="week">4 semaines</TabsTrigger>
      </TabsList>

      <TabsContent value="hour">
        <EmotionHistoryChart interval="hour" />
      </TabsContent>
      <TabsContent value="day">
        <EmotionHistoryChart interval="day" />
      </TabsContent>
      <TabsContent value="week">
        <EmotionHistoryChart interval="week" />
      </TabsContent>
    </Tabs>
  );
});

EmotionHistoryWithTabs.displayName = 'EmotionHistoryWithTabs';

export default EmotionHistoryChart;
