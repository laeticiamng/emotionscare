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

  // ========== MÉTHODES ENRICHIES ==========

  async getQuestsByType(type: Quest['quest_type']): Promise<Quest[]> {
    try {
      const { data, error } = await supabase
        .from('music_quests')
        .select('*')
        .eq('is_active', true)
        .eq('quest_type', type)
        .order('difficulty', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur récupération quêtes par type', error as Error, 'QuestService');
      return [];
    }
  }

  async getQuestsByCategory(category: Quest['category']): Promise<Quest[]> {
    try {
      const { data, error } = await supabase
        .from('music_quests')
        .select('*')
        .eq('is_active', true)
        .eq('category', category)
        .order('points_reward', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur récupération quêtes par catégorie', error as Error, 'QuestService');
      return [];
    }
  }

  async getDailyQuests(): Promise<Quest[]> {
    return this.getQuestsByType('daily');
  }

  async getWeeklyQuests(): Promise<Quest[]> {
    return this.getQuestsByType('weekly');
  }

  async getSpecialQuests(): Promise<Quest[]> {
    return this.getQuestsByType('special');
  }

  async startQuest(questId: string): Promise<UserQuestProgress | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const existing = await supabase
        .from('user_quest_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('quest_id', questId)
        .single();

      if (existing.data) return existing.data;

      const { data, error } = await supabase
        .from('user_quest_progress')
        .insert({
          user_id: user.id,
          quest_id: questId,
          current_progress: 0,
          completed: false
        })
        .select('*, quest:music_quests(*)')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erreur démarrage quête', error as Error, 'QuestService');
      return null;
    }
  }

  async incrementProgress(questId: string, increment: number = 1): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const { data: progress } = await supabase
        .from('user_quest_progress')
        .select('*, quest:music_quests(*)')
        .eq('user_id', user.id)
        .eq('quest_id', questId)
        .single();

      if (!progress) {
        await this.startQuest(questId);
        return this.incrementProgress(questId, increment);
      }

      const newProgress = (progress.current_progress || 0) + increment;
      return this.updateQuestProgress(questId, newProgress);
    } catch (error) {
      logger.error('Erreur incrémentation progression', error as Error, 'QuestService');
      return false;
    }
  }

  async getCompletedQuests(): Promise<UserQuestProgress[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_quest_progress')
        .select('*, quest:music_quests(*)')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur récupération quêtes complétées', error as Error, 'QuestService');
      return [];
    }
  }

  async getInProgressQuests(): Promise<UserQuestProgress[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_quest_progress')
        .select('*, quest:music_quests(*)')
        .eq('user_id', user.id)
        .eq('completed', false)
        .order('started_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur récupération quêtes en cours', error as Error, 'QuestService');
      return [];
    }
  }

  async getQuestStats(): Promise<{
    totalCompleted: number;
    dailyCompleted: number;
    weeklyCompleted: number;
    specialCompleted: number;
    totalPointsEarned: number;
    currentStreak: number;
    favoriteCategory: Quest['category'] | null;
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return {
        totalCompleted: 0, dailyCompleted: 0, weeklyCompleted: 0,
        specialCompleted: 0, totalPointsEarned: 0, currentStreak: 0, favoriteCategory: null
      };

      const { data: completed } = await supabase
        .from('user_quest_progress')
        .select('*, quest:music_quests(*)')
        .eq('user_id', user.id)
        .eq('completed', true);

      const quests = completed || [];
      const dailyCompleted = quests.filter(q => q.quest?.quest_type === 'daily').length;
      const weeklyCompleted = quests.filter(q => q.quest?.quest_type === 'weekly').length;
      const specialCompleted = quests.filter(q => q.quest?.quest_type === 'special').length;
      const totalPointsEarned = quests.reduce((sum, q) => sum + (q.quest?.points_reward || 0), 0);

      // Favorite category
      const categoryCounts: Record<string, number> = {};
      quests.forEach(q => {
        const cat = q.quest?.category;
        if (cat) categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
      const [favoriteCategory] = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])[0] || [null];

      return {
        totalCompleted: quests.length,
        dailyCompleted,
        weeklyCompleted,
        specialCompleted,
        totalPointsEarned,
        currentStreak: dailyCompleted > 0 ? 1 : 0,
        favoriteCategory: favoriteCategory as Quest['category'] | null
      };
    } catch (error) {
      logger.error('Erreur récupération stats quêtes', error as Error, 'QuestService');
      return {
        totalCompleted: 0, dailyCompleted: 0, weeklyCompleted: 0,
        specialCompleted: 0, totalPointsEarned: 0, currentStreak: 0, favoriteCategory: null
      };
    }
  }

  async getRecommendedQuests(limit: number = 5): Promise<Quest[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const stats = await this.getQuestStats();
      const favoriteCategory = stats.favoriteCategory || 'listening';

      const { data, error } = await supabase
        .from('music_quests')
        .select('*')
        .eq('is_active', true)
        .eq('category', favoriteCategory)
        .order('points_reward', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur récupération quêtes recommandées', error as Error, 'QuestService');
      return [];
    }
  }

  async getQuestProgress(questId: string): Promise<UserQuestProgress | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_quest_progress')
        .select('*, quest:music_quests(*)')
        .eq('user_id', user.id)
        .eq('quest_id', questId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      logger.error('Erreur récupération progression quête', error as Error, 'QuestService');
      return null;
    }
  }

  async abandonQuest(questId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('user_quest_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('quest_id', questId)
        .eq('completed', false);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erreur abandon quête', error as Error, 'QuestService');
      return false;
    }
  }

  async getAvailableQuests(): Promise<Quest[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return this.getActiveQuests();

      const activeQuests = await this.getActiveQuests();
      const userProgress = await this.getUserQuestProgress();
      const startedQuestIds = new Set(userProgress.map(p => p.quest_id));

      return activeQuests.filter(q => !startedQuestIds.has(q.id));
    } catch (error) {
      logger.error('Erreur récupération quêtes disponibles', error as Error, 'QuestService');
      return [];
    }
  }

  async getExpiringQuests(hoursUntilExpiry: number = 24): Promise<Quest[]> {
    try {
      const cutoff = new Date();
      cutoff.setHours(cutoff.getHours() + hoursUntilExpiry);

      const { data, error } = await supabase
        .from('music_quests')
        .select('*')
        .eq('is_active', true)
        .lt('end_date', cutoff.toISOString())
        .order('end_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur récupération quêtes expirantes', error as Error, 'QuestService');
      return [];
    }
  }
}

export const questService = new QuestService();
