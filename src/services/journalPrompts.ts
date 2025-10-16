import { supabase } from '@/integrations/supabase/client';

export interface JournalPrompt {
  id: string;
  category: 'reflection' | 'gratitude' | 'goals' | 'emotions' | 'creativity' | 'mindfulness';
  prompt_text: string;
  difficulty_level: number;
  usage_count: number;
  is_active: boolean;
  created_at: string;
}

/**
 * Service pour gérer les prompts de journal
 */
export const journalPromptsService = {
  /**
   * Récupère un prompt aléatoire par catégorie
   */
  async getRandomPrompt(category?: JournalPrompt['category']): Promise<JournalPrompt | null> {
    try {
      let query = supabase
        .from('journal_prompts')
        .select('*')
        .eq('is_active', true);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (!data || data.length === 0) return null;

      // Sélectionner un prompt aléatoire
      const randomIndex = Math.floor(Math.random() * data.length);
      return data[randomIndex];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupère tous les prompts actifs
   */
  async getAllPrompts(): Promise<JournalPrompt[]> {
    try {
      const { data, error } = await supabase
        .from('journal_prompts')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('difficulty_level', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Incrémente le compteur d'utilisation d'un prompt
   */
  async incrementUsage(promptId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment', {
        table_name: 'journal_prompts',
        row_id: promptId,
        column_name: 'usage_count'
      });

      if (error) {
        // Fallback: récupérer, incrémenter, mettre à jour
        const { data } = await supabase
          .from('journal_prompts')
          .select('usage_count')
          .eq('id', promptId)
          .single();

        if (data) {
          await supabase
            .from('journal_prompts')
            .update({ usage_count: (data.usage_count || 0) + 1 })
            .eq('id', promptId);
        }
      }
    } catch (error) {
      // Silently fail on increment errors
    }
  },
};
