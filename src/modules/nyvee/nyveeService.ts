/**
 * Service pour Nyvee (Cocoon interactif)
 */

import { supabase } from '@/integrations/supabase/client';

export interface NyveeSession {
  id: string;
  user_id: string;
  cozy_level: number;
  session_duration: number;
  interactions: any[];
  mood_before?: number;
  mood_after?: number;
  created_at: string;
  completed_at?: string;
}

export class NyveeService {
  /**
   * Créer une session Nyvee
   */
  static async createSession(
    userId: string,
    cozyLevel: number = 50,
    moodBefore?: number
  ): Promise<NyveeSession> {
    const { data, error } = await supabase
      .from('nyvee_sessions')
      .insert({
        user_id: userId,
        cozy_level: cozyLevel,
        mood_before: moodBefore,
        session_duration: 0,
        interactions: []
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Mettre à jour le niveau de confort
   */
  static async updateCozyLevel(
    sessionId: string,
    cozyLevel: number
  ): Promise<void> {
    const { error } = await supabase
      .from('nyvee_sessions')
      .update({ cozy_level: cozyLevel })
      .eq('id', sessionId);

    if (error) throw error;
  }

  /**
   * Enregistrer une interaction
   */
  static async logInteraction(
    sessionId: string,
    interaction: any
  ): Promise<void> {
    const { data: session } = await supabase
      .from('nyvee_sessions')
      .select('interactions')
      .eq('id', sessionId)
      .single();

    if (session) {
      const interactions = [...(session.interactions || []), interaction];
      const { error } = await supabase
        .from('nyvee_sessions')
        .update({ interactions })
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
    moodAfter?: number
  ): Promise<void> {
    const { error } = await supabase
      .from('nyvee_sessions')
      .update({
        session_duration: durationSeconds,
        mood_after: moodAfter,
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;
  }

  /**
   * Récupérer l'historique
   */
  static async fetchHistory(userId: string, limit: number = 20): Promise<NyveeSession[]> {
    const { data, error } = await supabase
      .from('nyvee_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
}
