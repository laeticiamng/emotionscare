import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EmotionResult } from '@/types/emotion';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// Local types for this hook
interface EmotionTrend {
  date: string;
  averageMood: number;
  emotionDistribution: Record<string, number>;
  peakEmotion: string;
  lowestEmotion: string;
  stabilityIndex: number;
  sessionCount: number;
  totalScanTime: number;
}

interface EmotionPattern {
  id: string;
  name: string;
  description: string;
  type: string;
  confidence: number;
  timePattern?: { hours: number[]; daysOfWeek: number[]; frequency: number };
  emotionSequence?: { emotions: string[]; transitions: { from: string; to: string; probability: number }[] };
}

interface EmotionInsight {
  id: string;
  type: string;
  title: string;
  description: string;
  confidence: number;
  priority: string;
  createdAt: Date;
}

interface WeeklyEmotionStats {
  totalScans: number;
  averageMood: number;
  emotionDiversity: number;
  mostFrequentEmotion: string;
  improvementTrend: number;
  wellbeingScore: number;
}

interface UseEmotionAnalyticsReturn {
  emotionTrends: EmotionTrend[];
  weeklyStats: WeeklyEmotionStats | null;
  emotionPatterns: EmotionPattern[];
  insights: EmotionInsight[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refreshAnalytics: () => void;
  getEmotionInsights: (period: 'day' | 'week' | 'month') => Promise<EmotionInsight[]>;
}

export const useEmotionAnalytics = (): UseEmotionAnalyticsReturn => {
  const [emotionTrends, setEmotionTrends] = useState<EmotionTrend[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyEmotionStats | null>(null);
  const [emotionPatterns, setEmotionPatterns] = useState<EmotionPattern[]>([]);
  const [insights, setInsights] = useState<EmotionInsight[]>([]);

  const { data: emotionData, isLoading, isError, error, refetch } = useQuery<any[]>({
    queryKey: ['emotion-analytics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('emotion_analyses')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const calculateEmotionTrends = useCallback((data: any[]): EmotionTrend[] => {
    if (!data || data.length === 0) return [];
    try {
      const groupedByDate = data.reduce((acc: Record<string, any[]>, item: any) => {
        const date = new Date(item.created_at).toDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(item);
        return acc;
      }, {});

      return Object.entries(groupedByDate).map(([date, items]) => {
        const emotions = (items as any[]).map((item: any) => item.emotion || 'neutral');
        const emotionDistribution = emotions.reduce((acc: Record<string, number>, emotion: string) => {
          acc[emotion] = (acc[emotion] || 0) + 1;
          return acc;
        }, {});

        const peakEmotion = Object.entries(emotionDistribution)
          .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || 'neutral';
        const lowestEmotion = Object.entries(emotionDistribution)
          .sort(([, a], [, b]) => (a as number) - (b as number))[0]?.[0] || 'neutral';

        const emotionValues = emotions.map((e: string) => getEmotionValue(e));
        const avgValue = emotionValues.reduce((sum: number, val: number) => sum + val, 0) / emotionValues.length;
        const variance = emotionValues.reduce((sum: number, val: number) => sum + Math.pow(val - avgValue, 2), 0) / emotionValues.length;
        const stabilityIndex = Math.max(0, 100 - Math.sqrt(variance) * 20);

        return {
          date,
          averageMood: avgValue,
          emotionDistribution,
          peakEmotion,
          lowestEmotion,
          stabilityIndex,
          sessionCount: (items as any[]).length,
          totalScanTime: (items as any[]).reduce((sum: number, item: any) => sum + (item.duration || 0), 0)
        };
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (err) {
      logger.error('Error calculating emotion trends', err as Error, 'UI');
      return [];
    }
  }, []);

  const detectEmotionPatterns = useCallback((data: any[]): EmotionPattern[] => {
    if (!data || data.length < 5) return [];
    try {
      const patterns: EmotionPattern[] = [];
      const hourlyEmotions = data.reduce((acc: Record<number, string[]>, item: any) => {
        const hour = new Date(item.created_at).getHours();
        if (!acc[hour]) acc[hour] = [];
        acc[hour].push(item.emotion || 'neutral');
        return acc;
      }, {});

      Object.entries(hourlyEmotions).forEach(([hour, emotions]) => {
        if ((emotions as string[]).length >= 3) {
          const mostCommon = getMostFrequent(emotions as string[]);
          const frequency = (emotions as string[]).filter((e: string) => e === mostCommon).length / (emotions as string[]).length;
          if (frequency > 0.6) {
            patterns.push({
              id: `daily_${hour}`,
              name: `Pattern ${hour}h`,
              description: `Émotion ${mostCommon} récurrente vers ${hour}h`,
              type: 'daily',
              confidence: frequency * 100,
              timePattern: { hours: [parseInt(hour)], daysOfWeek: [0,1,2,3,4,5,6], frequency }
            });
          }
        }
      });

      return patterns;
    } catch (err) {
      logger.error('Error detecting emotion patterns', err as Error, 'UI');
      return [];
    }
  }, []);

  const calculateWeeklyStats = useCallback((data: any[]): WeeklyEmotionStats | null => {
    if (!data || data.length === 0) return null;
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekData = data.filter((item: any) => new Date(item.created_at) >= weekAgo);
      if (weekData.length === 0) return null;

      const emotions = weekData.map((item: any) => item.emotion || 'neutral');
      const emotionValues = emotions.map((e: string) => getEmotionValue(e));
      const averageMood = emotionValues.reduce((sum: number, val: number) => sum + val, 0) / emotionValues.length;
      const uniqueEmotions = new Set(emotions);
      const emotionDiversity = (uniqueEmotions.size / 8) * 100;
      const emotionCounts = emotions.reduce((acc: Record<string, number>, emotion: string) => {
        acc[emotion] = (acc[emotion] || 0) + 1;
        return acc;
      }, {});
      const mostFrequentEmotion = Object.entries(emotionCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || 'neutral';

      const midPoint = Math.floor(weekData.length / 2);
      const firstHalf = emotionValues.slice(0, midPoint);
      const secondHalf = emotionValues.slice(midPoint);
      const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((s: number, v: number) => s + v, 0) / firstHalf.length : 0;
      const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((s: number, v: number) => s + v, 0) / secondHalf.length : 0;
      const improvementTrend = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0;
      const wellbeingScore = Math.max(0, Math.min(100,
        (averageMood * 0.4) + (emotionDiversity * 0.3) + (Math.max(0, improvementTrend + 50) * 0.3)
      ));

      return { totalScans: weekData.length, averageMood, emotionDiversity, mostFrequentEmotion, improvementTrend, wellbeingScore };
    } catch (err) {
      logger.error('Error calculating weekly stats', err as Error, 'UI');
      return null;
    }
  }, []);

  const getEmotionInsights = useCallback(async (period: 'day' | 'week' | 'month'): Promise<EmotionInsight[]> => {
    try {
      const result: EmotionInsight[] = [];
      if (!emotionData || emotionData.length === 0) return result;

      const trends = calculateEmotionTrends(emotionData);
      if (trends.length > 1) {
        const latest = trends[trends.length - 1];
        const previous = trends[trends.length - 2];
        const moodChange = latest.averageMood - previous.averageMood;
        if (Math.abs(moodChange) > 10) {
          result.push({
            id: `trend_${Date.now()}`, type: 'pattern',
            title: moodChange > 0 ? 'Amélioration détectée' : 'Attention nécessaire',
            description: `Votre humeur ${moodChange > 0 ? 'augmente' : 'diminue'} de ${Math.abs(moodChange).toFixed(1)}%`,
            confidence: 85, priority: Math.abs(moodChange) > 20 ? 'high' : 'medium', createdAt: new Date()
          });
        }
      }
      return result;
    } catch (err) {
      logger.error('Error generating insights', err as Error, 'UI');
      return [];
    }
  }, [emotionData, calculateEmotionTrends]);

  useEffect(() => {
    if (emotionData) {
      setEmotionTrends(calculateEmotionTrends(emotionData));
      setWeeklyStats(calculateWeeklyStats(emotionData));
      setEmotionPatterns(detectEmotionPatterns(emotionData));
      getEmotionInsights('week').then(setInsights);
    }
  }, [emotionData, calculateEmotionTrends, calculateWeeklyStats, detectEmotionPatterns, getEmotionInsights]);

  return {
    emotionTrends, weeklyStats, emotionPatterns, insights,
    isLoading, isError, error: error as Error | null,
    refreshAnalytics: useCallback(() => { refetch(); }, [refetch]),
    getEmotionInsights
  };
};

function getEmotionValue(emotion: string): number {
  const values: Record<string, number> = {
    happy: 85, excited: 90, calm: 70, focused: 75, neutral: 50, sad: 25, angry: 15, anxious: 30, fear: 20
  };
  return values[emotion.toLowerCase()] || 50;
}

function getMostFrequent(arr: string[]): string {
  const counts = arr.reduce((acc: Record<string, number>, item: string) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || arr[0];
}
