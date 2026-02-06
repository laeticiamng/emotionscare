// @ts-nocheck

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface MoodTrendDataPoint {
  day: string;
  date: string;
  mood: number;
  energy: number;
}

export interface MoodTrendResult {
  data: MoodTrendDataPoint[];
  currentMood: number;
  previousMood: number;
  trend: number;
  isLoading: boolean;
}

export function useMoodTrendData(days: number = 7): MoodTrendResult {
  const { user } = useAuth();
  const [data, setData] = useState<MoodTrendDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchMoodData = async () => {
      setIsLoading(true);
      try {
        const endDate = new Date();
        const startDate = subDays(endDate, days - 1);

        // Fetch mood entries for the period
        const { data: moodEntries, error } = await supabase
          .from('mood_entries')
          .select('mood_score, energy_level, created_at')
          .eq('user_id', user.id)
          .gte('created_at', startOfDay(startDate).toISOString())
          .lte('created_at', endOfDay(endDate).toISOString())
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Group by day and average scores
        const dayMap = new Map<string, { moods: number[], energies: number[] }>();
        
        // Initialize all days
        for (let i = 0; i < days; i++) {
          const date = subDays(endDate, days - 1 - i);
          const dayKey = format(date, 'yyyy-MM-dd');
          dayMap.set(dayKey, { moods: [], energies: [] });
        }

        // Fill in actual data
        (moodEntries || []).forEach(entry => {
          const dayKey = format(new Date(entry.created_at), 'yyyy-MM-dd');
          if (dayMap.has(dayKey)) {
            const dayData = dayMap.get(dayKey)!;
            if (entry.mood_score != null) dayData.moods.push(entry.mood_score);
            if (entry.energy_level != null) dayData.energies.push(entry.energy_level);
          }
        });

        // Convert to array with averages
        const chartData: MoodTrendDataPoint[] = [];
        dayMap.forEach((values, dateKey) => {
          const date = new Date(dateKey);
          const avgMood = values.moods.length > 0 
            ? Math.round(values.moods.reduce((a, b) => a + b, 0) / values.moods.length * 10)
            : 0;
          const avgEnergy = values.energies.length > 0
            ? Math.round(values.energies.reduce((a, b) => a + b, 0) / values.energies.length * 10)
            : 0;

          chartData.push({
            day: format(date, 'EEE', { locale: fr }),
            date: dateKey,
            mood: avgMood,
            energy: avgEnergy,
          });
        });

        setData(chartData);
      } catch (error) {
        logger.error('Error fetching mood trend data:', error, 'ANALYTICS');
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoodData();
  }, [user?.id, days]);

  // Calculate trend
  const nonZeroMoods = data.filter(d => d.mood > 0);
  const currentMood = nonZeroMoods.length > 0 ? nonZeroMoods[nonZeroMoods.length - 1].mood : 0;
  const previousMood = nonZeroMoods.length > 1 ? nonZeroMoods[nonZeroMoods.length - 2].mood : currentMood;
  const trend = currentMood - previousMood;

  return {
    data,
    currentMood,
    previousMood,
    trend,
    isLoading,
  };
}
