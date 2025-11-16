import { supabase } from '@/integrations/supabase/client';
import type {
import { logger } from '@/lib/logger';
  Achievement,
  AchievementStats,
  CreateAchievement,
  RecordProgress,
  UpdateAchievement,
  UserAchievementProgress,
  UserBadge,
  AchievementCondition,
} from './types';

/**
 * Service de gestion des achievements
 * Gère les succès, badges, progression et statistiques utilisateur
 */
export const achievementsService = {
  /**
   * Récupère tous les achievements disponibles
   */
  async getAllAchievements(includeHidden = false): Promise<Achievement[]> {
    let query = supabase.from('achievements').select('*');

    if (!includeHidden) {
      query = query.eq('is_hidden', false);
    }

    const { data, error } = await query.order('rarity', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch achievements: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Récupère un achievement par ID
   */
  async getAchievementById(id: string): Promise<Achievement | null> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to fetch achievement: ${error.message}`);
    }

    return data;
  },

  /**
   * Crée un nouvel achievement (admin)
   */
  async createAchievement(achievement: CreateAchievement): Promise<Achievement> {
    const { data, error } = await supabase
      .from('achievements')
      .insert(achievement)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create achievement: ${error.message}`);
    }

    return data;
  },

  /**
   * Met à jour un achievement (admin)
   */
  async updateAchievement(achievement: UpdateAchievement): Promise<Achievement> {
    const { id, ...updates } = achievement;

    const { data, error } = await supabase
      .from('achievements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update achievement: ${error.message}`);
    }

    return data;
  },

  /**
   * Supprime un achievement (admin)
   */
  async deleteAchievement(id: string): Promise<void> {
    const { error } = await supabase.from('achievements').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete achievement: ${error.message}`);
    }
  },

  /**
   * Récupère la progression d'un utilisateur pour tous les achievements
   */
  async getUserProgress(userId: string): Promise<UserAchievementProgress[]> {
    const { data, error } = await supabase
      .from('user_achievement_progress')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch user progress: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Récupère les achievements débloqués par l'utilisateur
   */
  async getUnlockedAchievements(userId: string): Promise<UserAchievementProgress[]> {
    const { data, error } = await supabase
      .from('user_achievement_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('unlocked', true)
      .order('unlocked_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch unlocked achievements: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Enregistre une progression pour un achievement
   */
  async recordProgress(
    userId: string,
    progress: RecordProgress
  ): Promise<UserAchievementProgress> {
    const { achievement_id, increment, metadata } = progress;

    // Récupérer l'achievement pour connaître les conditions
    const achievement = await this.getAchievementById(achievement_id);
    if (!achievement) {
      throw new Error('Achievement not found');
    }

    // Récupérer la progression actuelle
    const { data: existingProgress } = await supabase
      .from('user_achievement_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_id', achievement_id)
      .single();

    // Calculer la nouvelle valeur et le pourcentage
    const targetValue = this.getTargetValue(achievement.conditions);
    const currentValue = (existingProgress?.current_value || 0) + increment;
    const progressPercentage = Math.min((currentValue / targetValue) * 100, 100);
    const unlocked = progressPercentage >= 100;

    if (existingProgress) {
      // Mettre à jour la progression existante
      const { data, error } = await supabase
        .from('user_achievement_progress')
        .update({
          current_value: currentValue,
          progress: progressPercentage,
          unlocked,
          unlocked_at: unlocked ? new Date().toISOString() : existingProgress.unlocked_at,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingProgress.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update progress: ${error.message}`);
      }

      // Déclencher les récompenses si débloqué
      if (unlocked && !existingProgress.unlocked) {
        await this.grantRewards(userId, achievement);
      }

      return data;
    } else {
      // Créer une nouvelle progression
      const { data, error } = await supabase
        .from('user_achievement_progress')
        .insert({
          user_id: userId,
          achievement_id,
          current_value: currentValue,
          target_value: targetValue,
          progress: progressPercentage,
          unlocked,
          unlocked_at: unlocked ? new Date().toISOString() : undefined,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create progress: ${error.message}`);
      }

      // Déclencher les récompenses si débloqué
      if (unlocked) {
        await this.grantRewards(userId, achievement);
      }

      return data;
    }
  },

  /**
   * Calcule la valeur cible à partir des conditions
   */
  getTargetValue(conditions: AchievementCondition[]): number {
    // Pour simplifier, on prend la valeur de la première condition
    // Dans une implémentation plus complexe, on pourrait combiner plusieurs conditions
    return conditions[0]?.value || 1;
  },

  /**
   * Octroie les récompenses d'un achievement
   */
  async grantRewards(userId: string, achievement: Achievement): Promise<void> {
    const rewards = achievement.rewards;

    // Octroyer XP
    if (rewards.xp) {
      await this.grantXP(userId, Number(rewards.xp));
    }

    // Octroyer badge
    if (rewards.badge) {
      await this.grantBadge(userId, {
        name: achievement.name,
        description: achievement.description,
        image_url: achievement.icon,
      });
    }

    // Les autres types de récompenses (unlock, cosmetic) peuvent être gérés ici
  },

  /**
   * Octroie des XP à l'utilisateur
   */
  async grantXP(userId: string, amount: number): Promise<void> {
    // Récupérer le total XP actuel
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('total_xp')
      .eq('user_id', userId)
      .single();

    const currentXP = profile?.total_xp || 0;

    // Mettre à jour le total XP
    const { error } = await supabase
      .from('user_profiles')
      .update({ total_xp: currentXP + amount })
      .eq('user_id', userId);

    if (error) {
      logger.error('Failed to grant XP:', error, 'MODULE');
    }
  },

  /**
   * Octroie un badge à l'utilisateur
   */
  async grantBadge(
    userId: string,
    badge: { name: string; description: string; image_url?: string }
  ): Promise<UserBadge> {
    const { data, error } = await supabase
      .from('user_badges')
      .insert({
        user_id: userId,
        name: badge.name,
        description: badge.description,
        image_url: badge.image_url,
        awarded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to grant badge: ${error.message}`);
    }

    return data;
  },

  /**
   * Récupère tous les badges d'un utilisateur
   */
  async getUserBadges(userId: string): Promise<UserBadge[]> {
    const { data, error } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .order('awarded_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch user badges: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Récupère les statistiques d'achievements d'un utilisateur
   */
  async getUserStats(userId: string): Promise<AchievementStats> {
    // Récupérer tous les achievements
    const allAchievements = await this.getAllAchievements(false);

    // Récupérer la progression de l'utilisateur
    const userProgress = await this.getUserProgress(userId);

    // Calculer les statistiques
    const unlockedProgress = userProgress.filter((p) => p.unlocked);
    const totalAchievements = allAchievements.length;
    const unlockedAchievements = unlockedProgress.length;
    const unlockPercentage =
      totalAchievements > 0 ? (unlockedAchievements / totalAchievements) * 100 : 0;

    // Compter par rareté
    const rarityCounts = unlockedProgress.reduce(
      (acc, progress) => {
        const achievement = allAchievements.find((a) => a.id === progress.achievement_id);
        if (achievement) {
          acc[achievement.rarity] = (acc[achievement.rarity] || 0) + 1;
        }
        return acc;
      },
      {
        common: 0,
        rare: 0,
        epic: 0,
        legendary: 0,
      } as Record<string, number>
    );

    // Calculer XP total
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('total_xp')
      .eq('user_id', userId)
      .single();

    // Récupérer les déverrouillages récents
    const recentUnlocks = unlockedProgress.slice(0, 10);

    return {
      total_achievements: totalAchievements,
      unlocked_achievements: unlockedAchievements,
      unlock_percentage: Math.round(unlockPercentage * 100) / 100,
      common_count: rarityCounts.common,
      rare_count: rarityCounts.rare,
      epic_count: rarityCounts.epic,
      legendary_count: rarityCounts.legendary,
      total_xp_earned: profile?.total_xp || 0,
      recent_unlocks: recentUnlocks,
    };
  },

  /**
   * Marque les achievements non notifiés comme notifiés
   */
  async markAsNotified(userId: string, achievementIds: string[]): Promise<void> {
    const { error } = await supabase
      .from('user_achievement_progress')
      .update({ notified: true })
      .eq('user_id', userId)
      .in('achievement_id', achievementIds);

    if (error) {
      throw new Error(`Failed to mark achievements as notified: ${error.message}`);
    }
  },

  /**
   * Récupère les achievements non notifiés
   */
  async getUnnotifiedAchievements(userId: string): Promise<UserAchievementProgress[]> {
    const { data, error } = await supabase
      .from('user_achievement_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('unlocked', true)
      .eq('notified', false)
      .order('unlocked_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch unnotified achievements: ${error.message}`);
    }

    return data || [];
  },
};

export default achievementsService;
