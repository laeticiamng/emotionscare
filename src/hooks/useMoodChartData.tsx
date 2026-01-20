import { useState, useEffect } from 'react';
import { MoodData } from '@/types/other';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useMoodChartData(period: 'day' | 'week' | 'month' = 'week') {
  const { user } = useAuth();
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        let numberOfDays = 7;
        if (period === 'day') numberOfDays = 1;
        else if (period === 'month') numberOfDays = 30;
        
        const startDate = subDays(new Date(), numberOfDays).toISOString();
        
        // Récupérer les données réelles depuis Supabase
        const { data: entries, error } = await supabase
          .from('mood_entries')
          .select('id, mood, intensity, created_at, notes, energy_level')
          .eq('user_id', user.id)
          .gte('created_at', startDate)
          .order('created_at', { ascending: true });

        if (error) {
          logger.warn('Erreur chargement mood_entries, fallback local', error, 'DB');
          throw error;
        }

        if (entries && entries.length > 0) {
          const realData: MoodData[] = entries.map((entry) => ({
            id: entry.id,
            mood: entry.mood || 'neutral',
            intensity: entry.intensity || 5,
            date: format(new Date(entry.created_at), 'yyyy-MM-dd'),
            value: entry.intensity || 5,
            sentiment: ((entry.intensity || 5) - 5) / 5,
            anxiety: Math.max(0, 5 - (entry.intensity || 5)),
            energy: entry.energy_level || 5,
            originalDate: format(new Date(entry.created_at), 'dd MMMM', { locale: fr })
          }));
          setMoodData(realData);
        } else {
          setMoodData([]);
        }
      } catch (error) {
        logger.error('Erreur lors du chargement des données mood', error as Error, 'UI');
        setMoodData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [period, user?.id]);

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
