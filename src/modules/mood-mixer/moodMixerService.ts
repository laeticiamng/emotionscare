/**
 * Service pour Mood Mixer (Mélangeur d'humeurs)
 */

import { supabase } from '@/integrations/supabase/client';

export interface MoodMixerSession {
  id: string;
  user_id: string;
  mood_before?: string;
  mood_after?: string;
  activities_selected?: string[];
  duration_seconds: number;
  satisfaction_score?: number;
  created_at: string;
  completed_at?: string;
}

export class MoodMixerService {
  /**
   * Créer une session Mood Mixer
   */
  static async createSession(
    userId: string,
    moodBefore?: string
  ): Promise<MoodMixerSession> {
    const { data, error } = await supabase
      .from('mood_mixer_sessions')
      .insert({
        user_id: userId,
        mood_before: moodBefore,
        duration_seconds: 0,
        activities_selected: []
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Ajouter une activité sélectionnée
   */
  static async addActivity(
    sessionId: string,
    activity: string
  ): Promise<void> {
    const { data: session } = await supabase
      .from('mood_mixer_sessions')
      .select('activities_selected')
      .eq('id', sessionId)
      .single();

    if (session) {
      const activities = [...(session.activities_selected || []), activity];
      const { error } = await supabase
        .from('mood_mixer_sessions')
        .update({ activities_selected: activities })
        .eq('id', sessionId);

      if (error) throw error;
    }
  }

  /**
   * Compléter une session
   */
  static async completeSession(
    sessionId: string,
    durationSeconds: number,
    moodAfter?: string,
    satisfactionScore?: number
  ): Promise<void> {
    const { error } = await supabase
      .from('mood_mixer_sessions')
      .update({
        duration_seconds: durationSeconds,
        mood_after: moodAfter,
        satisfaction_score: satisfactionScore,
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;
  }

  /**
   * Récupérer l'historique
   */
  static async fetchHistory(userId: string, limit: number = 20): Promise<MoodMixerSession[]> {
    const { data, error } = await supabase
      .from('mood_mixer_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Obtenir des statistiques
   */
  static async getStats(userId: string): Promise<{
    totalSessions: number;
    averageSatisfaction: number;
    mostUsedActivities: string[];
  }> {
    const sessions = await this.fetchHistory(userId, 100);

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.satisfaction_score !== undefined);
    const averageSatisfaction = completedSessions.length > 0
      ? completedSessions.reduce((sum, s) => sum + (s.satisfaction_score || 0), 0) / completedSessions.length
      : 0;

    const activityCount = new Map<string, number>();
    sessions.forEach(s => {
      (s.activities_selected || []).forEach(activity => {
        activityCount.set(activity, (activityCount.get(activity) || 0) + 1);
      });
    });

    const mostUsedActivities = Array.from(activityCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([activity]) => activity);

    return {
      totalSessions,
      averageSatisfaction,
      mostUsedActivities
    };
  }
}
