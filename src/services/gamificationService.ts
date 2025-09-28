
import { supabase } from '@/integrations/supabase/client';
import { UserPoints, UserBadge, Achievement, Streak, Badge } from '@/types/gamification';

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
      console.error('Erreur lors de la récupération des points:', error);
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
      console.error('Erreur lors de la récupération des badges:', error);
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
      console.error('Erreur lors de la récupération des succès:', error);
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
      console.error('Erreur lors de la récupération des séries:', error);
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
      console.error('Erreur lors de l\'attribution des points:', error);
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
      console.error('Erreur lors de la vérification des succès:', error);
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
      console.error('Erreur lors de la mise à jour de la série:', error);
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
      console.error('Erreur lors de la création du succès:', error);
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
      console.error('Erreur lors de la récupération du classement:', error);
      return [];
    }
  }
}

export const gamificationService = new GamificationService();
export default gamificationService;
