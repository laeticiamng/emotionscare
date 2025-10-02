// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';

export interface Mood {
  id: string;
  user_id: string;
  valence: number; // -1 à 1
  arousal: number; // -1 à 1
  note?: string;
  tags?: string[];
  ts: string;
  context?: Record<string, any>;
}

export interface CreateMoodInput {
  valence: number;
  arousal: number;
  note?: string;
  tags?: string[];
  context?: Record<string, any>;
}

export const moodService = {
  /**
   * Créer une nouvelle humeur
   */
  async createMood(input: CreateMoodInput): Promise<Mood> {
    const { data, error } = await supabase
      .from('moods')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        valence: input.valence,
        arousal: input.arousal,
        note: input.note,
        tags: input.tags || [],
        context: input.context || {},
      })
      .select()
      .single();

    if (error) throw error;
    return data as Mood;
  },

  /**
   * Récupérer les humeurs d'un utilisateur
   */
  async getUserMoods(limit: number = 50, offset: number = 0): Promise<Mood[]> {
    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .order('ts', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data as Mood[];
  },

  /**
   * Récupérer les statistiques des humeurs
   */
  async getMoodStats(days: number = 7): Promise<{
    avgValence: number;
    avgArousal: number;
    count: number;
    trend: 'up' | 'down' | 'stable';
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('moods')
      .select('valence, arousal')
      .gte('ts', startDate.toISOString());

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        avgValence: 0,
        avgArousal: 0,
        count: 0,
        trend: 'stable',
      };
    }

    const avgValence = data.reduce((sum, m) => sum + m.valence, 0) / data.length;
    const avgArousal = data.reduce((sum, m) => sum + m.arousal, 0) / data.length;

    // Calculer la tendance (comparer première moitié vs seconde moitié)
    const mid = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, mid);
    const secondHalf = data.slice(mid);

    const avgFirst = firstHalf.reduce((sum, m) => sum + m.valence, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((sum, m) => sum + m.valence, 0) / secondHalf.length;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (avgSecond > avgFirst + 0.1) trend = 'up';
    else if (avgSecond < avgFirst - 0.1) trend = 'down';

    return {
      avgValence,
      avgArousal,
      count: data.length,
      trend,
    };
  },

  /**
   * Supprimer une humeur
   */
  async deleteMood(id: string): Promise<void> {
    const { error } = await supabase
      .from('moods')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
