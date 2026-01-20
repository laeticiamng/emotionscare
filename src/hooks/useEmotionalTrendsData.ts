// @ts-nocheck

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export interface EmotionalTrendDataPoint {
  date: string;
  score: number;
}

export interface EmotionalTrendsResult {
  data: EmotionalTrendDataPoint[];
  isLoading: boolean;
  averageScore: number;
  trend: 'up' | 'down' | 'stable';
}

export function useEmotionalTrendsData(days: number = 7): EmotionalTrendsResult {
  const { user } = useAuth();
  const [data, setData] = useState<EmotionalTrendDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchEmotionalTrends = async () => {
      setIsLoading(true);
      try {
        const endDate = new Date();
        const startDate = subDays(endDate, days - 1);

        // Fetch mood entries for the period
        const { data: moodEntries, error } = await supabase
          .from('mood_entries')
          .select('mood_score, created_at')
          .eq('user_id', user.id)
          .gte('created_at', startOfDay(startDate).toISOString())
          .lte('created_at', endOfDay(endDate).toISOString())
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Group by day and average scores
        const dayMap = new Map<string, number[]>();
        
        // Initialize all days
        for (let i = 0; i < days; i++) {
          const date = subDays(endDate, days - 1 - i);
          const dayKey = format(date, 'yyyy-MM-dd');
          dayMap.set(dayKey, []);
        }

        // Fill in actual data
        (moodEntries || []).forEach(entry => {
          const dayKey = format(new Date(entry.created_at), 'yyyy-MM-dd');
          if (dayMap.has(dayKey) && entry.mood_score != null) {
            dayMap.get(dayKey)!.push(entry.mood_score);
          }
        });

        // Convert to array with averages (score is 0-100 scale)
        const chartData: EmotionalTrendDataPoint[] = [];
        dayMap.forEach((scores, dateKey) => {
          const avgScore = scores.length > 0 
            ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10)
            : 0;
          chartData.push({
            date: dateKey,
            score: avgScore,
          });
        });

        setData(chartData);
      } catch (error) {
        console.error('Error fetching emotional trends:', error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmotionalTrends();
  }, [user?.id, days]);

  // Calculate average and trend
  const nonZeroScores = data.filter(d => d.score > 0);
  const averageScore = nonZeroScores.length > 0
    ? Math.round(nonZeroScores.reduce((a, b) => a + b.score, 0) / nonZeroScores.length)
    : 0;

  const firstHalf = nonZeroScores.slice(0, Math.floor(nonZeroScores.length / 2));
  const secondHalf = nonZeroScores.slice(Math.floor(nonZeroScores.length / 2));
  
  const firstAvg = firstHalf.length > 0 
    ? firstHalf.reduce((a, b) => a + b.score, 0) / firstHalf.length 
    : 0;
  const secondAvg = secondHalf.length > 0 
    ? secondHalf.reduce((a, b) => a + b.score, 0) / secondHalf.length 
    : 0;

  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (secondAvg > firstAvg + 5) trend = 'up';
  else if (secondAvg < firstAvg - 5) trend = 'down';

  return {
    data,
    isLoading,
    averageScore,
    trend,
  };
}
