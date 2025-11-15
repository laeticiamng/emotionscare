/**
 * Service pour AR Filters (Filtres de réalité augmentée)
 */

import { supabase } from '@/integrations/supabase/client';
import type { ARFilterSession, ARFilterStats } from './types';

export class ARFiltersService {
  /**
   * Créer une session AR Filter
   */
  static async createSession(
    userId: string,
    filterType: string
  ): Promise<ARFilterSession> {
    const { data, error } = await supabase
      .from('ar_filter_sessions')
      .insert({
        user_id: userId,
        filter_type: filterType,
        duration_seconds: 0,
        photos_taken: 0
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Incrémenter le nombre de photos prises
   */
  static async incrementPhotosTaken(sessionId: string): Promise<void> {
    const { data: session } = await supabase
      .from('ar_filter_sessions')
      .select('photos_taken')
      .eq('id', sessionId)
      .single();

    if (session) {
      const { error } = await supabase
        .from('ar_filter_sessions')
        .update({ photos_taken: session.photos_taken + 1 })
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
    moodImpact?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('ar_filter_sessions')
      .update({
        duration_seconds: durationSeconds,
        mood_impact: moodImpact,
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;
  }

  /**
   * Récupérer l'historique
   */
  static async fetchHistory(userId: string, limit: number = 20): Promise<ARFilterSession[]> {
    const { data, error } = await supabase
      .from('ar_filter_sessions')
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
  static async getStats(userId: string): Promise<ARFilterStats> {
    const sessions = await this.fetchHistory(userId, 100);

    const totalSessions = sessions.length;
    const totalPhotosTaken = sessions.reduce((sum, s) => sum + s.photos_taken, 0);
    
    const filterCount = new Map<string, number>();
    sessions.forEach(s => {
      filterCount.set(s.filter_type, (filterCount.get(s.filter_type) || 0) + 1);
    });

    const favoriteFilter = Array.from(filterCount.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';

    const completedSessions = sessions.filter(s => s.completed_at);
    const averageDuration = completedSessions.length > 0
      ? completedSessions.reduce((sum, s) => sum + s.duration_seconds, 0) / completedSessions.length
      : 0;

    return {
      totalSessions,
      totalPhotosTaken,
      favoriteFilter,
      averageDuration
    };
  }
}
