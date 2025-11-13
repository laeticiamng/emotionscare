// @ts-nocheck

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface Quest {
  id: string;
  title: string;
  description: string;
  quest_type: 'daily' | 'weekly' | 'special';
  category: 'listening' | 'exploration' | 'wellness' | 'social';
  difficulty: 'easy' | 'medium' | 'hard';
  points_reward: number;
  max_progress: number;
  start_date: string;
  end_date?: string;
  is_active: boolean;
}

export interface UserQuestProgress {
  id: string;
  user_id: string;
  quest_id: string;
  current_progress: number;
  completed: boolean;
  completed_at?: string;
  started_at: string;
  quest?: Quest;
}

class QuestService {
  async getActiveQuests(): Promise<Quest[]> {
    try {
      const { data, error } = await supabase
        .from('music_quests')
        .select('*')
        .eq('is_active', true)
        .order('quest_type', { ascending: true })
        .order('difficulty', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur lors de la récupération des quêtes', error as Error, 'QuestService');
      return [];
    }
  }

  async getUserQuestProgress(): Promise<UserQuestProgress[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_quest_progress')
        .select(`
          *,
          quest:music_quests(*)
        `)
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur lors de la récupération de la progression', error as Error, 'QuestService');
      return [];
    }
  }

  async updateQuestProgress(questId: string, progress: number): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Récupérer la quête pour connaître max_progress
      const { data: quest } = await supabase
        .from('music_quests')
        .select('max_progress, points_reward')
        .eq('id', questId)
        .single();

      if (!quest) throw new Error('Quête non trouvée');

      const completed = progress >= quest.max_progress;

      // Upsert la progression
      const { error } = await supabase
        .from('user_quest_progress')
        .upsert({
          user_id: user.id,
          quest_id: questId,
          current_progress: Math.min(progress, quest.max_progress),
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,quest_id'
        });

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de la progression', error as Error, 'QuestService');
      return false;
    }
  }

  async claimQuestReward(questId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Vérifier que la quête est complétée
      const { data: progress } = await supabase
        .from('user_quest_progress')
        .select('completed')
        .eq('user_id', user.id)
        .eq('quest_id', questId)
        .single();

      if (!progress?.completed) {
        throw new Error('Quête non complétée');
      }

      return true;
    } catch (error) {
      logger.error('Erreur lors de la réclamation de la récompense', error as Error, 'QuestService');
      return false;
    }
  }
}

export const questService = new QuestService();
