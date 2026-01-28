/**
 * useEmotionalCalendar - Hook pour les données du calendrier émotionnel
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, format } from 'date-fns';

interface DayData {
  date: Date;
  score: number | null;
  entries: number;
  dominantEmotion?: string;
}

interface UseEmotionalCalendarReturn {
  data: DayData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  loadMonth: (month: Date) => Promise<void>;
}

export function useEmotionalCalendar(): UseEmotionalCalendarReturn {
  const { user } = useAuth();
  const [data, setData] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMonth = useCallback(async (month: Date) => {
    if (!user?.id) {
      setData([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const start = startOfMonth(month);
      const end = endOfMonth(month);

      // Charger les mood_entries du mois
      const { data: moodEntries, error: fetchError } = await supabase
        .from('mood_entries')
        .select('created_at, mood_score, emotions')
        .eq('user_id', user.id)
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at', { ascending: true });

      if (fetchError) {
        // Si la table n'existe pas, retourner vide
        if (fetchError.code === '42P01') {
          setData([]);
          return;
        }
        throw fetchError;
      }

      // Grouper par jour
      const dayMap = new Map<string, { scores: number[]; emotions: string[] }>();
      
      (moodEntries || []).forEach((entry) => {
        const dateKey = format(new Date(entry.created_at), 'yyyy-MM-dd');
        
        if (!dayMap.has(dateKey)) {
          dayMap.set(dateKey, { scores: [], emotions: [] });
        }
        
        const dayData = dayMap.get(dateKey)!;
        
        if (entry.mood_score !== null) {
          dayData.scores.push(entry.mood_score);
        }
        
        if (entry.emotions && Array.isArray(entry.emotions)) {
          dayData.emotions.push(...entry.emotions.map(String));
        }
      });

      // Convertir en format DayData
      const result: DayData[] = [];
      
      dayMap.forEach((value, key) => {
        const avgScore = value.scores.length > 0
          ? Math.round(value.scores.reduce((a, b) => a + b, 0) / value.scores.length)
          : null;
        
        // Trouver l'émotion dominante
        const emotionCounts = new Map<string, number>();
        value.emotions.forEach(e => {
          emotionCounts.set(e, (emotionCounts.get(e) || 0) + 1);
        });
        
        let dominantEmotion: string | undefined;
        let maxCount = 0;
        emotionCounts.forEach((count, emotion) => {
          if (count > maxCount) {
            maxCount = count;
            dominantEmotion = emotion;
          }
        });

        result.push({
          date: new Date(key),
          score: avgScore,
          entries: value.scores.length,
          dominantEmotion
        });
      });

      setData(result);
    } catch (err) {
      console.error('Error loading emotional calendar:', err);
      setError('Impossible de charger les données du calendrier');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const refetch = useCallback(async () => {
    await loadMonth(new Date());
  }, [loadMonth]);

  // Charger le mois courant au montage
  useEffect(() => {
    loadMonth(new Date());
  }, [loadMonth]);

  return {
    data,
    isLoading,
    error,
    refetch,
    loadMonth
  };
}
