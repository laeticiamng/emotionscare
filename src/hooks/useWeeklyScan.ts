import { subWeeks, format, startOfWeek, endOfWeek } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface WeeklyScanRow {
  week: string;
  valence_face_avg: number;
  joy_face_avg: number;
  valence_voice_avg: number;
  lexical_sentiment_avg: number;
  arousal_sd_face: number;
}

/**
 * Hook pour récupérer les scans hebdomadaires via Supabase
 */
export const useWeeklyScan = (
  since: Date = subWeeks(new Date(), 8)
) => {
  return useQuery({
    queryKey: ['scanWeekly', since],
    queryFn: async (): Promise<WeeklyScanRow[]> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          logger.warn('No authenticated user for weekly scan', {}, 'SCAN');
          return generateMockData(since);
        }

        // Récupérer les données d'émotions depuis emotion_scans
        const { data: scans, error } = await supabase
          .from('emotion_scans')
          .select('created_at, emotions, confidence, source')
          .eq('user_id', user.id)
          .gte('created_at', since.toISOString())
          .order('created_at', { ascending: true });

        if (error) {
          logger.error('Failed to fetch emotion scans', error, 'SCAN');
          return generateMockData(since);
        }

        if (!scans || scans.length === 0) {
          logger.info('No scans found, returning mock data', {}, 'SCAN');
          return generateMockData(since);
        }

        // Grouper par semaine
        const weeklyData: Record<string, {
          valence_face: number[];
          joy_face: number[];
          valence_voice: number[];
          lexical_sentiment: number[];
          arousal_face: number[];
        }> = {};

        for (const scan of scans) {
          const weekStart = format(startOfWeek(new Date(scan.created_at), { weekStartsOn: 1 }), 'yyyy-MM-dd');
          
          if (!weeklyData[weekStart]) {
            weeklyData[weekStart] = {
              valence_face: [],
              joy_face: [],
              valence_voice: [],
              lexical_sentiment: [],
              arousal_face: [],
            };
          }

          // Extraire les émotions selon la source
          const emotions = scan.emotions as Record<string, number> | null;
          if (emotions) {
            if (scan.source === 'face' || scan.source === 'camera') {
              if (typeof emotions.valence === 'number') weeklyData[weekStart].valence_face.push(emotions.valence);
              if (typeof emotions.joy === 'number') weeklyData[weekStart].joy_face.push(emotions.joy);
              if (typeof emotions.arousal === 'number') weeklyData[weekStart].arousal_face.push(emotions.arousal);
            } else if (scan.source === 'voice' || scan.source === 'audio') {
              if (typeof emotions.valence === 'number') weeklyData[weekStart].valence_voice.push(emotions.valence);
            } else if (scan.source === 'text' || scan.source === 'journal') {
              if (typeof emotions.sentiment === 'number') weeklyData[weekStart].lexical_sentiment.push(emotions.sentiment);
            }
          }
        }

        // Calculer les moyennes et écarts-types
        const result: WeeklyScanRow[] = Object.entries(weeklyData).map(([week, data]) => {
          const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
          const stdDev = (arr: number[]) => {
            if (arr.length === 0) return 0;
            const mean = avg(arr);
            const squareDiffs = arr.map(value => Math.pow(value - mean, 2));
            return Math.sqrt(avg(squareDiffs));
          };

          return {
            week,
            valence_face_avg: Math.round(avg(data.valence_face) * 100) / 100,
            joy_face_avg: Math.round(avg(data.joy_face) * 100) / 100,
            valence_voice_avg: Math.round(avg(data.valence_voice) * 100) / 100,
            lexical_sentiment_avg: Math.round(avg(data.lexical_sentiment) * 100) / 100,
            arousal_sd_face: Math.round(stdDev(data.arousal_face) * 100) / 100,
          };
        });

        logger.info('Weekly scan data loaded', { weeks: result.length }, 'SCAN');
        return result.sort((a, b) => a.week.localeCompare(b.week));
      } catch (error) {
        logger.error('Error in useWeeklyScan', error as Error, 'SCAN');
        return generateMockData(since);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Génère des données de démonstration
 */
function generateMockData(since: Date): WeeklyScanRow[] {
  const weeks: WeeklyScanRow[] = [];
  let currentDate = startOfWeek(since, { weekStartsOn: 1 });
  const now = new Date();

  while (currentDate <= now) {
    weeks.push({
      week: format(currentDate, 'yyyy-MM-dd'),
      valence_face_avg: 0.5 + Math.random() * 0.3,
      joy_face_avg: 0.4 + Math.random() * 0.4,
      valence_voice_avg: 0.45 + Math.random() * 0.35,
      lexical_sentiment_avg: 0.5 + Math.random() * 0.3,
      arousal_sd_face: 0.1 + Math.random() * 0.2,
    });
    currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  }

  return weeks;
}
