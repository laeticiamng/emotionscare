/**
 * Service pour Story Synth (Histoires génératives)
 */

import { supabase } from '@/integrations/supabase/client';

export interface StorySynthSession {
  id: string;
  user_id: string;
  story_theme?: string;
  story_content?: string;
  choices_made: any[];
  emotion_tags?: string[];
  duration_seconds: number;
  created_at: string;
  completed_at?: string;
}

export class StorySynthService {
  /**
   * Créer une session d'histoire
   */
  static async createSession(
    userId: string,
    theme?: string
  ): Promise<StorySynthSession> {
    const { data, error } = await supabase
      .from('story_synth_sessions')
      .insert({
        user_id: userId,
        story_theme: theme,
        duration_seconds: 0,
        choices_made: []
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Enregistrer un choix de l'utilisateur
   */
  static async recordChoice(
    sessionId: string,
    choice: any
  ): Promise<void> {
    const { data: session } = await supabase
      .from('story_synth_sessions')
      .select('choices_made')
      .eq('id', sessionId)
      .single();

    if (session) {
      const choices = [...(session.choices_made || []), choice];
      const { error } = await supabase
        .from('story_synth_sessions')
        .update({ choices_made: choices })
        .eq('id', sessionId);

      if (error) throw error;
    }
  }

  /**
   * Mettre à jour le contenu de l'histoire
   */
  static async updateStoryContent(
    sessionId: string,
    content: string,
    emotionTags?: string[]
  ): Promise<void> {
    const { error } = await supabase
      .from('story_synth_sessions')
      .update({
        story_content: content,
        emotion_tags: emotionTags
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
      .from('story_synth_sessions')
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
  static async fetchHistory(userId: string, limit: number = 20): Promise<StorySynthSession[]> {
    const { data, error } = await supabase
      .from('story_synth_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
}
