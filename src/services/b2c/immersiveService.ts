// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';

export interface ImmersiveSession {
  id: string;
  user_id: string;
  type: 'vr' | 'ambilight' | 'audio';
  params_json: Record<string, any>;
  ts_start: string;
  ts_end?: string;
  outcome_text?: string;
  metadata: Record<string, any>;
}

export interface CreateImmersiveSessionInput {
  type: 'vr' | 'ambilight' | 'audio';
  params: Record<string, any>;
  metadata?: Record<string, any>;
}

export const immersiveService = {
  /**
   * Créer une nouvelle session immersive
   */
  async createSession(input: CreateImmersiveSessionInput): Promise<ImmersiveSession> {
    const { data, error } = await supabase
      .from('immersive_sessions')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        type: input.type,
        params_json: input.params,
        metadata: input.metadata || {},
      })
      .select()
      .single();

    if (error) throw error;
    return data as ImmersiveSession;
  },

  /**
   * Terminer une session immersive
   */
  async endSession(id: string, outcome_text?: string): Promise<void> {
    const { error } = await supabase
      .from('immersive_sessions')
      .update({
        ts_end: new Date().toISOString(),
        outcome_text: outcome_text || 'Session terminée',
      })
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Récupérer une session par ID
   */
  async getSession(id: string): Promise<ImmersiveSession | null> {
    const { data, error } = await supabase
      .from('immersive_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as ImmersiveSession;
  },

  /**
   * Récupérer les sessions d'un utilisateur
   */
  async getUserSessions(limit: number = 20): Promise<ImmersiveSession[]> {
    const { data, error } = await supabase
      .from('immersive_sessions')
      .select('*')
      .order('ts_start', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as ImmersiveSession[];
  },

  /**
   * Récupérer les statistiques des sessions
   */
  async getSessionStats(): Promise<{
    totalSessions: number;
    byType: Record<string, number>;
    totalDurationMinutes: number;
  }> {
    const { data, error } = await supabase
      .from('immersive_sessions')
      .select('type, ts_start, ts_end');

    if (error) throw error;

    const stats = {
      totalSessions: data?.length || 0,
      byType: {} as Record<string, number>,
      totalDurationMinutes: 0,
    };

    data?.forEach((session) => {
      stats.byType[session.type] = (stats.byType[session.type] || 0) + 1;

      if (session.ts_end) {
        const duration = new Date(session.ts_end).getTime() - new Date(session.ts_start).getTime();
        stats.totalDurationMinutes += duration / 60000;
      }
    });

    return stats;
  },
};
