/**
 * Hook pour récupérer les données d'humeur des 7 derniers jours
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { subDays, format, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MoodDayData {
  day: string;
  date: string;
  mood: number | null;
}

export const useMoodWeeklyData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['mood-weekly', user?.id],
    queryFn: async (): Promise<MoodDayData[]> => {
      if (!user) return [];

      const today = new Date();
      const sevenDaysAgo = subDays(today, 6);

      const { data, error } = await supabase
        .from('mood_entries')
        .select('mood_level, created_at')
        .eq('user_id', user.id)
        .gte('created_at', startOfDay(sevenDaysAgo).toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching mood data:', error);
        return [];
      }

      // Créer un tableau pour les 7 derniers jours
      const days: MoodDayData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayLabel = format(date, 'EEE', { locale: fr });

        // Trouver les entrées pour ce jour
        const dayEntries = data?.filter(entry => 
          entry.created_at && 
          format(new Date(entry.created_at), 'yyyy-MM-dd') === dateStr
        ) || [];

        // Calculer la moyenne si plusieurs entrées
        let avgMood: number | null = null;
        if (dayEntries.length > 0) {
          const sum = dayEntries.reduce((acc, e) => acc + (e.mood_level || 0), 0);
          avgMood = Math.round((sum / dayEntries.length) * 10) / 10;
        }

        days.push({
          day: dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1, 3),
          date: dateStr,
          mood: avgMood,
        });
      }

      return days;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

export default useMoodWeeklyData;
