/**
 * Nyvee Service - API calls et business logic
 */

import { supabase } from '@/integrations/supabase/client';
import { captureException } from '@/lib/ai-monitoring';
import type {
  CreateNyveeSession,
  CompleteNyveeSession,
  NyveeSession,
  NyveeStats,
  BreathingIntensity,
  BadgeType,
} from './types';

export const nyveeService = {
  /**
   * Créer une nouvelle session Nyvee
   */
  async createSession(data: CreateNyveeSession): Promise<NyveeSession> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const session: NyveeSession = {
        id: crypto.randomUUID(),
        userId: user.id,
        intensity: data.intensity,
        cyclesCompleted: 0,
        targetCycles: data.targetCycles,
        moodBefore: data.moodBefore,
        moodAfter: undefined,
        moodDelta: undefined,
        badgeEarned: 'calm',
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: undefined,
      };

      Sentry.addBreadcrumb({
        category: 'nyvee',
        message: 'Session created',
        data: { intensity: data.intensity, targetCycles: data.targetCycles },
      });

      return session;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },

  /**
   * Compléter une session Nyvee
   */
  async completeSession(data: CompleteNyveeSession): Promise<NyveeSession> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let moodDelta: number | undefined;
      if (data.moodAfter !== undefined) {
        moodDelta = data.moodAfter - 50;
      }

      const completedSession: NyveeSession = {
        id: data.sessionId,
        userId: user.id,
        intensity: 'calm',
        cyclesCompleted: data.cyclesCompleted,
        targetCycles: 6,
        moodAfter: data.moodAfter,
        moodDelta,
        badgeEarned: data.badgeEarned,
        cocoonUnlocked: data.cocoonUnlocked,
        completed: true,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };

      Sentry.addBreadcrumb({
        category: 'nyvee',
        message: 'Session completed',
        data: { 
          sessionId: data.sessionId,
          cycles: data.cyclesCompleted,
          badge: data.badgeEarned,
        },
      });

      return completedSession;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },

  /**
   * Obtenir les statistiques utilisateur
   */
  async getStats(): Promise<NyveeStats> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const stats: NyveeStats = {
        totalSessions: 0,
        totalCycles: 0,
        averageCyclesPerSession: 0,
        completionRate: 0,
        currentStreak: 0,
        longestStreak: 0,
        favoriteIntensity: null,
        cocoonsUnlocked: ['crystal'],
        avgMoodDelta: null,
        badgesEarned: {
          calm: 0,
          partial: 0,
          tense: 0,
        },
      };

      return stats;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },

  /**
   * Récupérer les sessions récentes
   */
  async getRecentSessions(limit: number = 10): Promise<NyveeSession[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      return [];
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },

  /**
   * Déterminer le badge selon l'intensité et les cycles
   */
  determineBadge(intensity: BreathingIntensity, cyclesCompleted: number, targetCycles: number): BadgeType {
    const completionRate = cyclesCompleted / targetCycles;
    
    if (completionRate >= 0.9 && intensity === 'calm') {
      return 'calm';
    } else if (completionRate >= 0.7) {
      return 'partial';
    } else {
      return 'tense';
    }
  },

  /**
   * Déterminer si un nouveau cocoon est débloqué
   */
  shouldUnlockCocoon(badge: BadgeType): boolean {
    if (badge === 'calm') {
      return Math.random() < 0.3;
    }
    return false;
  },
};
