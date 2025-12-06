/**
 * Service pour la gestion des sessions breathing VR
 */

import { supabase } from '@/integrations/supabase/client';
import type { BreathingSession, BreathingPattern } from './types';

export class BreathingVRService {
  /**
   * Crée une nouvelle session de respiration
   */
  static async createSession(
    userId: string,
    pattern: BreathingPattern,
    vrMode: boolean,
    moodBefore?: number
  ): Promise<BreathingSession> {
    const { data, error } = await supabase
      .from('breathing_vr_sessions')
      .insert({
        user_id: userId,
        pattern,
        duration_seconds: 0,
        vr_mode: vrMode,
        mood_before: moodBefore
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Met à jour une session en cours
   */
  static async updateSession(
    sessionId: string,
    data: {
      cycles_completed?: number;
      average_pace?: number;
      duration_seconds?: number;
    }
  ): Promise<void> {
    const { error } = await supabase
      .from('breathing_vr_sessions')
      .update(data)
      .eq('id', sessionId);

    if (error) throw error;
  }

  /**
   * Complète une session
   */
  static async completeSession(
    sessionId: string,
    data: {
      cycles_completed: number;
      duration_seconds: number;
      average_pace: number;
      mood_after?: number;
      notes?: string;
    }
  ): Promise<void> {
    const { error } = await supabase
      .from('breathing_vr_sessions')
      .update({
        ...data,
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;
  }

  /**
   * Récupère l'historique des sessions
   */
  static async fetchHistory(userId: string, limit: number = 20): Promise<BreathingSession[]> {
    const { data, error } = await supabase
      .from('breathing_vr_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Récupère les statistiques
   */
  static async getStats(userId: string): Promise<{
    totalSessions: number;
    totalMinutes: number;
    averageCycles: number;
    favoritePattern: BreathingPattern;
  }> {
    const sessions = await this.fetchHistory(userId, 1000);

    const totalSessions = sessions.length;
    const totalMinutes = Math.round(
      sessions.reduce((sum, s) => sum + s.duration_seconds, 0) / 60
    );
    
    const completedSessions = sessions.filter(s => s.cycles_completed > 0);
    const averageCycles = completedSessions.length > 0
      ? Math.round(
          completedSessions.reduce((sum, s) => sum + s.cycles_completed, 0) / completedSessions.length
        )
      : 0;

    const patternCount = new Map<BreathingPattern, number>();
    sessions.forEach(s => {
      patternCount.set(s.pattern, (patternCount.get(s.pattern) || 0) + 1);
    });

    const favoritePattern = Array.from(patternCount.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'box';

    return {
      totalSessions,
      totalMinutes,
      averageCycles,
      favoritePattern
    };
  }
}
