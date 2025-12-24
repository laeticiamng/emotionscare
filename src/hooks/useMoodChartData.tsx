// @ts-nocheck

import { useState, useEffect } from 'react';
import { MoodData } from '@/types/other';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

export function useMoodChartData(period: 'day' | 'week' | 'month' = 'week') {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        let numberOfDays = 7;
        if (period === 'day') {
          numberOfDays = 1;
        } else if (period === 'month') {
          numberOfDays = 30;
        }

        const startDate = subDays(new Date(), numberOfDays);

        // Fetch real emotion scans from Supabase
        const { data: scans, error } = await supabase
          .from('emotion_scans')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Transform scans to MoodData format
        if (scans && scans.length > 0) {
          const moodDataFromScans: MoodData[] = scans.map((scan, index) => {
            const scanDate = new Date(scan.created_at);
            return {
              id: scan.id || `mood-${index}`,
              mood: scan.primary_emotion || scan.mood || 'neutral',
              intensity: scan.intensity || scan.mood_score || 5,
              date: format(scanDate, 'yyyy-MM-dd'),
              value: scan.mood_score || scan.overall_score || 5,
              sentiment: scan.sentiment_score || 0,
              anxiety: scan.anxiety_level || scan.stress_level || 0,
              energy: scan.energy_level || 5,
              originalDate: format(scanDate, 'dd MMMM', { locale: fr })
            };
          });

          setMoodData(moodDataFromScans);
        } else {
          setMoodData([]);
        }
      } catch (error) {
        logger.error('Erreur lors du chargement des données', error as Error, 'UI');
        setMoodData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [period]);

  const chartData = moodData.map(item => ({
    date: item.date,
    value: item.intensity,
    mood: item.mood
  }));

  return {
    moodData,
    chartData,
    loading
  };
}

export default useMoodChartData;
