// @ts-nocheck

import { supabase } from '@/integrations/supabase/client';
import { UserPoints, UserBadge, Achievement, Streak, Badge } from '@/types/gamification';
import { logger } from '@/lib/logger';

class GamificationService {
  async getUserPoints(): Promise<UserPoints | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // Créer un nouveau record si aucun n'existe
        const newPoints: Partial<UserPoints> = {
          user_id: user.id,
          total_points: 0,
          level: 1,
          experience_points: 0
        };

        const { data: created, error: createError } = await supabase
          .from('user_points')
          .insert(newPoints)
          .select()
          .single();

        if (createError) throw createError;
        return created;
      }

      return data;
    } catch (error) {
      logger.error('Erreur lors de la récupération des points', error, 'GamificationService.getUserPoints');
      return null;
    }
  }

  async getUserBadges(): Promise<UserBadge[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          *,
          badge:badges(*)
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur lors de la récupération des badges', error, 'GamificationService.getUserBadges');
      return [];
    }
  }

  async getUserAchievements(): Promise<Achievement[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur lors de la récupération des succès', error, 'GamificationService.getUserAchievements');
      return [];
    }
  }

  async getUserStreaks(): Promise<Streak[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur lors de la récupération des séries', error, 'GamificationService.getUserStreaks');
      return [];
    }
  }

  async awardPoints(points: number, reason: string): Promise<UserPoints> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const currentPoints = await this.getUserPoints();
      if (!currentPoints) throw new Error('Impossible de récupérer les points actuels');

      const newTotalPoints = currentPoints.total_points + points;
      const newLevel = this.calculateLevel(newTotalPoints);
      const newExperiencePoints = currentPoints.experience_points + points;

      const { data, error } = await supabase
        .from('user_points')
        .update({
          total_points: newTotalPoints,
          level: newLevel,
          experience_points: newExperiencePoints,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Enregistrer l'activité dans l'historique
      await supabase
        .from('point_history')
        .insert({
          user_id: user.id,
          points: points,
          reason: reason,
          timestamp: new Date().toISOString()
        });

      return data;
    } catch (error) {
      logger.error('Erreur lors de l\'attribution des points', error, 'GamificationService.awardPoints');
      throw error;
    }
  }

  async checkAndAwardAchievements(): Promise<Achievement[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const userPoints = await this.getUserPoints();
      if (!userPoints) return [];

      const newAchievements: Achievement[] = [];

      // Vérifier les succès basés sur les points
      if (userPoints.total_points >= 100 && !await this.hasAchievement('first_100_points')) {
        const achievement = await this.createAchievement('first_100_points', 'Premiers 100 points', 'Vous avez atteint 100 points !', 10);
        if (achievement) newAchievements.push(achievement);
      }

      if (userPoints.total_points >= 500 && !await this.hasAchievement('500_points_master')) {
        const achievement = await this.createAchievement('500_points_master', 'Maître des 500 points', 'Vous avez atteint 500 points !', 25);
        if (achievement) newAchievements.push(achievement);
      }

      if (userPoints.level >= 5 && !await this.hasAchievement('level_5_reached')) {
        const achievement = await this.createAchievement('level_5_reached', 'Niveau 5 atteint', 'Vous avez atteint le niveau 5 !', 50);
        if (achievement) newAchievements.push(achievement);
      }

      return newAchievements;
    } catch (error) {
      logger.error('Erreur lors de la vérification des succès', error, 'GamificationService.checkAndAwardAchievements');
      return [];
    }
  }

  async updateStreak(activityType: string): Promise<Streak> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const today = new Date().toISOString().split('T')[0];
      
      const { data: existingStreak, error: fetchError } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user.id)
        .eq('activity_type', activityType)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (!existingStreak) {
        // Créer une nouvelle série
        const { data, error } = await supabase
          .from('streaks')
          .insert({
            user_id: user.id,
            activity_type: activityType,
            current_streak: 1,
            longest_streak: 1,
            last_activity_date: today
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Mettre à jour la série existante
        const lastDate = new Date(existingStreak.last_activity_date);
        const todayDate = new Date(today);
        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let newCurrentStreak = existingStreak.current_streak;
        
        if (diffDays === 1) {
          // Continuité de la série
          newCurrentStreak += 1;
        } else if (diffDays > 1) {
          // Série cassée, recommencer
          newCurrentStreak = 1;
        }
        // Si diffDays === 0, c'est le même jour, on ne change rien

        const newLongestStreak = Math.max(existingStreak.longest_streak, newCurrentStreak);

        const { data, error } = await supabase
          .from('streaks')
          .update({
            current_streak: newCurrentStreak,
            longest_streak: newLongestStreak,
            last_activity_date: today
          })
          .eq('id', existingStreak.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de la série', error, 'GamificationService.updateStreak');
      throw error;
    }
  }

  private calculateLevel(totalPoints: number): number {
    if (totalPoints < 100) return 1;
    if (totalPoints < 300) return 2;
    if (totalPoints < 600) return 3;
    if (totalPoints < 1000) return 4;
    if (totalPoints < 1500) return 5;
    if (totalPoints < 2100) return 6;
    if (totalPoints < 2800) return 7;
    if (totalPoints < 3600) return 8;
    if (totalPoints < 4500) return 9;
    return 10;
  }

  private async hasAchievement(type: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('achievements')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', type)
        .single();

      return !error && !!data;
    } catch {
      return false;
    }
  }

  private async createAchievement(type: string, title: string, description: string, points: number): Promise<Achievement | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('achievements')
        .insert({
          user_id: user.id,
          type: type,
          title: title,
          description: description,
          points_awarded: points,
          earned_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Attribuer les points du succès
      await this.awardPoints(points, `Succès débloqué: ${title}`);

      return data;
    } catch (error) {
      logger.error('Erreur lors de la création du succès', error, 'GamificationService.createAchievement');
      return null;
    }
  }

  async getLeaderboard(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_points')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .order('total_points', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map((entry, index) => ({
        id: entry.user_id,
        name: entry.profiles?.full_name || 'Utilisateur',
        avatar: entry.profiles?.avatar_url,
        points: entry.total_points,
        level: entry.level,
        rank: index + 1
      })) || [];
    } catch (error) {
      logger.error('Erreur lors de la récupération du classement', error, 'GamificationService.getLeaderboard');
      return [];
    }
  }

  // ========== MÉTHODES ENRICHIES ==========

  async getAllBadges(): Promise<Badge[]> {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('required_points', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur récupération badges disponibles', error, 'GamificationService');
      return [];
    }
  }

  async awardBadge(badgeId: string): Promise<UserBadge | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const existing = await supabase
        .from('user_badges')
        .select('id')
        .eq('user_id', user.id)
        .eq('badge_id', badgeId)
        .single();

      if (existing.data) return null;

      const { data, error } = await supabase
        .from('user_badges')
        .insert({
          user_id: user.id,
          badge_id: badgeId,
          earned_at: new Date().toISOString()
        })
        .select('*, badge:badges(*)')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erreur attribution badge', error, 'GamificationService');
      return null;
    }
  }

  async getPointsHistory(limit: number = 50): Promise<any[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('point_history')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur récupération historique points', error, 'GamificationService');
      return [];
    }
  }

  async getStats(): Promise<{
    totalPoints: number;
    level: number;
    badgesCount: number;
    achievementsCount: number;
    longestStreak: number;
    currentStreak: number;
    rank: number;
    pointsToNextLevel: number;
  }> {
    try {
      const [points, badges, achievements, streaks, leaderboard] = await Promise.all([
        this.getUserPoints(),
        this.getUserBadges(),
        this.getUserAchievements(),
        this.getUserStreaks(),
        this.getLeaderboard(100)
      ]);

      const { data: { user } } = await supabase.auth.getUser();
      const myRank = leaderboard.findIndex(e => e.id === user?.id) + 1;
      const levelThresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];
      const currentLevel = points?.level || 1;
      const nextThreshold = levelThresholds[currentLevel] || 5500;
      const pointsToNext = Math.max(0, nextThreshold - (points?.total_points || 0));

      const longestStreak = streaks.reduce((max, s) => Math.max(max, s.longest_streak || 0), 0);
      const currentStreak = streaks.reduce((max, s) => Math.max(max, s.current_streak || 0), 0);

      return {
        totalPoints: points?.total_points || 0,
        level: currentLevel,
        badgesCount: badges.length,
        achievementsCount: achievements.length,
        longestStreak,
        currentStreak,
        rank: myRank || 0,
        pointsToNextLevel: pointsToNext
      };
    } catch (error) {
      logger.error('Erreur récupération stats', error, 'GamificationService');
      return {
        totalPoints: 0, level: 1, badgesCount: 0, achievementsCount: 0,
        longestStreak: 0, currentStreak: 0, rank: 0, pointsToNextLevel: 100
      };
    }
  }

  async getDailyChallenge(): Promise<{
    id: string;
    title: string;
    description: string;
    reward: number;
    progress: number;
    target: number;
    completed: boolean;
  } | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('date', today)
        .single();

      if (!data) {
        return {
          id: `daily-${today}`,
          title: 'Défi du jour',
          description: 'Complétez 3 activités aujourd\'hui',
          reward: 50,
          progress: 0,
          target: 3,
          completed: false
        };
      }

      const { data: userProgress } = await supabase
        .from('user_daily_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('challenge_id', data.id)
        .single();

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        reward: data.reward_points,
        progress: userProgress?.progress || 0,
        target: data.target_value,
        completed: userProgress?.completed || false
      };
    } catch (error) {
      logger.error('Erreur récupération défi quotidien', error, 'GamificationService');
      return null;
    }
  }

  async checkLevelUp(): Promise<{ leveledUp: boolean; newLevel: number; rewards: any[] }> {
    try {
      const points = await this.getUserPoints();
      if (!points) return { leveledUp: false, newLevel: 1, rewards: [] };

      const oldLevel = points.level;
      const newLevel = this.calculateLevel(points.total_points);

      if (newLevel > oldLevel) {
        await supabase
          .from('user_points')
          .update({ level: newLevel })
          .eq('user_id', points.user_id);

        const rewards = [];
        if (newLevel === 5) rewards.push({ type: 'badge', value: 'level_5_badge' });
        if (newLevel === 10) rewards.push({ type: 'badge', value: 'level_10_badge' });

        return { leveledUp: true, newLevel, rewards };
      }

      return { leveledUp: false, newLevel: oldLevel, rewards: [] };
    } catch (error) {
      logger.error('Erreur vérification level up', error, 'GamificationService');
      return { leveledUp: false, newLevel: 1, rewards: [] };
    }
  }

  async getWeeklyProgress(): Promise<{
    pointsEarned: number;
    activitiesCompleted: number;
    streakDays: number;
    comparison: { lastWeek: number; change: number };
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { pointsEarned: 0, activitiesCompleted: 0, streakDays: 0, comparison: { lastWeek: 0, change: 0 } };

      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekStartStr = weekStart.toISOString();

      const { data: history } = await supabase
        .from('point_history')
        .select('points')
        .eq('user_id', user.id)
        .gte('timestamp', weekStartStr);

      const pointsEarned = (history || []).reduce((sum, h) => sum + h.points, 0);

      const lastWeekStart = new Date(weekStart);
      lastWeekStart.setDate(lastWeekStart.getDate() - 7);
      const { data: lastWeekHistory } = await supabase
        .from('point_history')
        .select('points')
        .eq('user_id', user.id)
        .gte('timestamp', lastWeekStart.toISOString())
        .lt('timestamp', weekStartStr);

      const lastWeekPoints = (lastWeekHistory || []).reduce((sum, h) => sum + h.points, 0);
      const change = lastWeekPoints > 0 ? Math.round(((pointsEarned - lastWeekPoints) / lastWeekPoints) * 100) : 0;

      const streaks = await this.getUserStreaks();
      const maxStreak = streaks.reduce((max, s) => Math.max(max, s.current_streak || 0), 0);

      return {
        pointsEarned,
        activitiesCompleted: (history || []).length,
        streakDays: maxStreak,
        comparison: { lastWeek: lastWeekPoints, change }
      };
    } catch (error) {
      logger.error('Erreur récupération progrès hebdo', error, 'GamificationService');
      return { pointsEarned: 0, activitiesCompleted: 0, streakDays: 0, comparison: { lastWeek: 0, change: 0 } };
    }
  }

  async claimStreakBonus(streakDays: number): Promise<number> {
    try {
      const bonusPoints = Math.min(streakDays * 5, 100);
      await this.awardPoints(bonusPoints, `Bonus série ${streakDays} jours`);
      return bonusPoints;
    } catch (error) {
      logger.error('Erreur réclamation bonus série', error, 'GamificationService');
      return 0;
    }
  }

  async getMilestones(): Promise<Array<{
    id: string;
    title: string;
    description: string;
    target: number;
    current: number;
    reward: number;
    achieved: boolean;
  }>> {
    const milestones = [
      { id: 'first_week', title: 'Première semaine', description: '7 jours consécutifs', target: 7, type: 'streak', reward: 100 },
      { id: 'century', title: 'Centurion', description: 'Atteignez 100 points', target: 100, type: 'points', reward: 25 },
      { id: 'half_k', title: 'Demi-millénaire', description: 'Atteignez 500 points', target: 500, type: 'points', reward: 75 },
      { id: 'thousand', title: 'Millénaire', description: 'Atteignez 1000 points', target: 1000, type: 'points', reward: 150 },
      { id: 'badge_collector', title: 'Collectionneur', description: 'Obtenez 5 badges', target: 5, type: 'badges', reward: 100 },
      { id: 'achiever', title: 'Accomplisseur', description: 'Débloquez 10 succès', target: 10, type: 'achievements', reward: 150 }
    ];

    try {
      const stats = await this.getStats();

      return milestones.map(m => {
        let current = 0;
        if (m.type === 'points') current = stats.totalPoints;
        else if (m.type === 'streak') current = stats.longestStreak;
        else if (m.type === 'badges') current = stats.badgesCount;
        else if (m.type === 'achievements') current = stats.achievementsCount;

        return {
          id: m.id,
          title: m.title,
          description: m.description,
          target: m.target,
          current,
          reward: m.reward,
          achieved: current >= m.target
        };
      });
    } catch (error) {
      logger.error('Erreur récupération jalons', error, 'GamificationService');
      return [];
    }
  }
}

export const gamificationService = new GamificationService();
export default gamificationService;
