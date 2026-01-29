/**
 * useMoodTracking - Hook pour persister les entrées d'humeur
 * Corrige le problème de mood_entries: 0 enregistrés
 */

import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface MoodEntry {
  id?: string;
  user_id?: string;
  mood_score: number; // 1-10
  energy_level?: number; // 1-10
  stress_level?: number; // 1-10
  emotions: string[];
  notes?: string;
  source: 'manual' | 'scan' | 'voice' | 'emoji';
  context?: {
    location?: string;
    activity?: string;
    weather?: string;
    time_of_day?: string;
  };
  created_at?: string;
}

interface MoodStats {
  average_mood: number;
  average_energy: number;
  average_stress: number;
  dominant_emotions: string[];
  entries_count: number;
  trend: 'up' | 'down' | 'stable';
}

export function useMoodTracking() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [lastEntry, setLastEntry] = useState<MoodEntry | null>(null);

  /**
   * Enregistre une nouvelle entrée d'humeur
   */
  const recordMood = useCallback(async (
    entry: Omit<MoodEntry, 'id' | 'user_id' | 'created_at'>
  ): Promise<MoodEntry | null> => {
    if (!isAuthenticated || !user?.id) {
      logger.warn('Cannot record mood: user not authenticated', 'MOOD');
      return null;
    }

    setIsLoading(true);

    try {
      const moodData = {
        user_id: user.id,
        mood_score: entry.mood_score,
        energy_level: entry.energy_level,
        stress_level: entry.stress_level,
        emotions: entry.emotions,
        notes: entry.notes,
        source: entry.source,
        context: entry.context || {},
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('mood_entries')
        .insert(moodData)
        .select()
        .single();

      if (error) {
        logger.error(`Failed to record mood: ${error.message}`, 'MOOD');
        toast({
          title: 'Erreur',
          description: 'Impossible d\'enregistrer votre humeur',
          variant: 'destructive',
        });
        return null;
      }

      setLastEntry(data);
      
      toast({
        title: '✨ Humeur enregistrée',
        description: 'Merci de partager comment vous vous sentez',
      });

      logger.info(`Recorded mood entry: ${data.id}`, 'MOOD');
      return data;
    } catch (err) {
      logger.error(`Mood recording error: ${err}`, 'MOOD');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id, toast]);

  /**
   * Enregistre le résultat d'un scan émotionnel
   */
  const recordScanResult = useCallback(async (
    emotions: Record<string, number>,
    source: 'scan' | 'voice' = 'scan'
  ): Promise<MoodEntry | null> => {
    // Convert emotion scores to sorted array
    const sortedEmotions = Object.entries(emotions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([emotion]) => emotion);

    // Calculate overall mood score from emotions
    const positiveEmotions = ['joy', 'happy', 'excited', 'calm', 'content', 'peaceful'];
    const negativeEmotions = ['sad', 'angry', 'anxious', 'fear', 'disgust', 'stressed'];
    
    let moodScore = 5; // Neutral default
    const topEmotion = sortedEmotions[0]?.toLowerCase();
    
    if (positiveEmotions.includes(topEmotion)) {
      moodScore = 7 + Math.floor(emotions[sortedEmotions[0]] * 3);
    } else if (negativeEmotions.includes(topEmotion)) {
      moodScore = 4 - Math.floor(emotions[sortedEmotions[0]] * 3);
    }

    moodScore = Math.max(1, Math.min(10, moodScore));

    return recordMood({
      mood_score: moodScore,
      emotions: sortedEmotions,
      source,
      context: {
        time_of_day: getTimeOfDay(),
      },
    });
  }, [recordMood]);

  /**
   * Récupère les statistiques d'humeur
   */
  const getMoodStats = useCallback(async (
    days: number = 7
  ): Promise<MoodStats | null> => {
    if (!isAuthenticated || !user?.id) return null;

    try {
      const startDate = new Date(Date.now() - days * 86400000).toISOString();

      const { data: entries } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate)
        .order('created_at', { ascending: true });

      if (!entries || entries.length === 0) {
        return {
          average_mood: 0,
          average_energy: 0,
          average_stress: 0,
          dominant_emotions: [],
          entries_count: 0,
          trend: 'stable',
        };
      }

      // Calculate averages
      const avgMood = entries.reduce((sum, e) => sum + e.mood_score, 0) / entries.length;
      const avgEnergy = entries.reduce((sum, e) => sum + (e.energy_level || 5), 0) / entries.length;
      const avgStress = entries.reduce((sum, e) => sum + (e.stress_level || 5), 0) / entries.length;

      // Count emotions
      const emotionCounts: Record<string, number> = {};
      entries.forEach(entry => {
        (entry.emotions || []).forEach((emotion: string) => {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
      });

      const dominantEmotions = Object.entries(emotionCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([emotion]) => emotion);

      // Calculate trend
      const midpoint = Math.floor(entries.length / 2);
      const firstHalfAvg = entries.slice(0, midpoint).reduce((sum, e) => sum + e.mood_score, 0) / midpoint || avgMood;
      const secondHalfAvg = entries.slice(midpoint).reduce((sum, e) => sum + e.mood_score, 0) / (entries.length - midpoint) || avgMood;
      
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (secondHalfAvg - firstHalfAvg > 0.5) trend = 'up';
      else if (firstHalfAvg - secondHalfAvg > 0.5) trend = 'down';

      return {
        average_mood: Math.round(avgMood * 10) / 10,
        average_energy: Math.round(avgEnergy * 10) / 10,
        average_stress: Math.round(avgStress * 10) / 10,
        dominant_emotions: dominantEmotions,
        entries_count: entries.length,
        trend,
      };
    } catch (err) {
      logger.error(`Failed to get mood stats: ${err}`, 'MOOD');
      return null;
    }
  }, [isAuthenticated, user?.id]);

  /**
   * Récupère l'historique des entrées
   */
  const getMoodHistory = useCallback(async (
    limit: number = 30
  ): Promise<MoodEntry[]> => {
    if (!isAuthenticated || !user?.id) return [];

    try {
      const { data } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      return data || [];
    } catch (err) {
      logger.error(`Failed to get mood history: ${err}`, 'MOOD');
      return [];
    }
  }, [isAuthenticated, user?.id]);

  return {
    recordMood,
    recordScanResult,
    getMoodStats,
    getMoodHistory,
    lastEntry,
    isLoading,
  };
}

// Helper
function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export default useMoodTracking;
