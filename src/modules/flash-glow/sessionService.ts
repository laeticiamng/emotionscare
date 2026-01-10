/**
 * Service pour gérer les sessions Flash Glow avec Supabase
 */

import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { createSession } from '@/services/sessions/sessionsApi';

export interface MoodSnapshot {
  value: number;
  timestamp: number;
  source: 'current' | 'assessment' | 'fallback';
}

/**
 * Récupère un snapshot de l'humeur actuelle
 */
export const getCurrentMoodSnapshot = (): MoodSnapshot => {
  const stored = typeof window !== 'undefined' 
    ? window.localStorage.getItem('current_mood') 
    : null;
  
  const value = stored ? parseInt(stored, 10) : 50;
  
  return {
    value: isNaN(value) ? 50 : value,
    timestamp: Date.now(),
    source: stored ? 'current' : 'fallback',
  };
};

/**
 * Calcule le delta d'humeur
 */
export const computeMoodDelta = (
  before: MoodSnapshot | null,
  after: MoodSnapshot | null
): number => {
  if (!before || !after) return 0;
  return after.value - before.value;
};

/**
 * Log et crée une entrée de journal via Supabase
 */
export const logAndJournal = async (data: {
  type: string;
  duration_sec: number;
  mood_before?: number;
  mood_after?: number;
  mood_delta?: number;
  meta?: Record<string, unknown>;
}): Promise<{ id: string } | null> => {
  try {
    const result = await createSession({
      type: data.type,
      duration_sec: data.duration_sec,
      mood_delta: data.mood_delta ?? null,
      meta: {
        mood_before: data.mood_before,
        mood_after: data.mood_after,
        ...data.meta,
      },
    });

    return result ? { id: result.id } : null;
  } catch (error) {
    logger.error('Error logging session', error as Error, 'MODULE');
    return null;
  }
};
