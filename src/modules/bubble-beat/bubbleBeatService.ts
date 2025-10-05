/**
 * Service pour Bubble Beat (Rythme et bulles)
 */

import { supabase } from '@/integrations/supabase/client';

export interface BubbleBeatSession {
  id: string;
  user_id: string;
  score: number;
  bubbles_popped: number;
  rhythm_accuracy?: number;
  duration_seconds: number;
  difficulty: string;
  created_at: string;
  completed_at?: string;
}

export class BubbleBeatService {
  /**
   * Créer une session Bubble Beat
   */
  static async createSession(
    userId: string,
    difficulty: string = 'normal'
  ): Promise<BubbleBeatSession> {
    const { data, error } = await supabase
      .from('bubble_beat_sessions')
      .insert({
        user_id: userId,
        difficulty,
        score: 0,
        bubbles_popped: 0,
        duration_seconds: 0
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Mettre à jour le score
   */
  static async updateScore(
    sessionId: string,
    score: number,
    bubblesPopped: number,
    rhythmAccuracy?: number
  ): Promise<void> {
    const { error } = await supabase
      .from('bubble_beat_sessions')
      .update({
        score,
        bubbles_popped: bubblesPopped,
        rhythm_accuracy: rhythmAccuracy
      })
      .eq('id', sessionId);

    if (error) throw error;
  }

  /**
   * Compléter une session
   */
  static async completeSession(
    sessionId: string,
    durationSeconds: number
  ): Promise<void> {
    const { error } = await supabase
      .from('bubble_beat_sessions')
      .update({
        duration_seconds: durationSeconds,
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;
  }

  /**
   * Récupérer l'historique
   */
  static async fetchHistory(userId: string, limit: number = 20): Promise<BubbleBeatSession[]> {
    const { data, error } = await supabase
      .from('bubble_beat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Obtenir le meilleur score
   */
  static async getBestScore(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('bubble_beat_sessions')
      .select('score')
      .eq('user_id', userId)
      .order('score', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return 0;
    return data.score;
  }

  /**
   * Obtenir des statistiques
   */
  static async getStats(userId: string): Promise<{
    totalSessions: number;
    bestScore: number;
    averageAccuracy: number;
    totalBubblesPopped: number;
  }> {
    const sessions = await this.fetchHistory(userId, 100);

    const totalSessions = sessions.length;
    const bestScore = Math.max(...sessions.map(s => s.score), 0);
    const sessionsWithAccuracy = sessions.filter(s => s.rhythm_accuracy !== undefined);
    const averageAccuracy = sessionsWithAccuracy.length > 0
      ? sessionsWithAccuracy.reduce((sum, s) => sum + (s.rhythm_accuracy || 0), 0) / sessionsWithAccuracy.length
      : 0;
    const totalBubblesPopped = sessions.reduce((sum, s) => sum + s.bubbles_popped, 0);

    return {
      totalSessions,
      bestScore,
      averageAccuracy,
      totalBubblesPopped
    };
  }
}
