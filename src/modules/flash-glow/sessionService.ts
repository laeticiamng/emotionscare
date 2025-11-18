/**
 * Service pour gérer les sessions Flash Glow
 */

import { logger } from '@/lib/logger';

export interface MoodSnapshot {
  value: number;
  timestamp: number;
  source: 'current' | 'assessment' | 'fallback';
}

/**
 * Récupère un snapshot de l'humeur actuelle
 */
export const getCurrentMoodSnapshot = (): MoodSnapshot => {
  // Récupère depuis le store ou valeur par défaut
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
 * Log et crée une entrée de journal
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
    // Utilise l'API sessions pour logger
    const response = await fetch('/api/sessions/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      logger.error('Failed to log session', undefined, 'MODULE');
      return null;
    }

    return await response.json();
  } catch (error) {
    logger.error('Error logging session:', error, 'MODULE');
    return null;
  }
};
