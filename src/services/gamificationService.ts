
import { supabase } from '@/integrations/supabase/client';
import { UserPoints, UserBadge, Achievement, Streak, Badge } from '@/types/gamification';

export class GamificationService {
  
  // Points Management
  static async getUserPoints(userId: string): Promise<UserPoints | null> {
    const { data, error } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user points:', error);
      return null;
    }
    
    return data;
  }

  static async addPoints(userId: string, points: number, reason: string): Promise<boolean> {
    try {
      // First, get current points
      const currentData = await this.getUserPoints(userId);
      const currentPoints = currentData?.total_points || 0;
      const currentLevel = currentData?.level || 1;
      const currentExp = currentData?.experience_points || 0;
      
      const newTotalPoints = currentPoints + points;
      const newExp = currentExp + points;
      const newLevel = this.calculateLevel(newTotalPoints);
      
      // Update or insert points
      const { error } = await supabase
        .from('user_points')
        .upsert({
          user_id: userId,
          total_points: newTotalPoints,
          level: newLevel,
          experience_points: newExp,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Record achievement if level up
      if (newLevel > currentLevel) {
        await this.recordAchievement(userId, 'level_up', `Niveau ${newLevel} atteint !`, `Félicitations ! Vous avez atteint le niveau ${newLevel}`, 100);
      }
      
      return true;
    } catch (error) {
      console.error('Error adding points:', error);
      return false;
    }
  }

  // Badge Management
  static async getUserBadges(userId: string): Promise<UserBadge[]> {
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        badge:badges(*)
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user badges:', error);
      return [];
    }
    
    return data || [];
  }

  static async checkAndAwardBadges(userId: string): Promise<Badge[]> {
    const newBadges: Badge[] = [];
    
    try {
      // Get all available badges
      const { data: allBadges } = await supabase
        .from('badges')
        .select('*');
      
      // Get user's current badges
      const userBadges = await this.getUserBadges(userId);
      const earnedBadgeIds = userBadges.map(ub => ub.badge_id);
      
      // Get user stats for badge conditions
      const userPoints = await this.getUserPoints(userId);
      const userStreaks = await this.getUserStreaks(userId);
      
      for (const badge of allBadges || []) {
        if (earnedBadgeIds.includes(badge.id)) continue;
        
        const meetsConditions = await this.checkBadgeConditions(userId, badge, userPoints, userStreaks);
        
        if (meetsConditions) {
          await this.awardBadge(userId, badge.id);
          newBadges.push(badge);
        }
      }
    } catch (error) {
      console.error('Error checking badges:', error);
    }
    
    return newBadges;
  }

  // Achievements
  static async recordAchievement(
    userId: string, 
    type: string, 
    title: string, 
    description: string, 
    points: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('achievements')
        .insert({
          user_id: userId,
          type,
          title,
          description,
          points_awarded: points,
          earned_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Add points for achievement
      await this.addPoints(userId, points, `Achievement: ${title}`);
      
      return true;
    } catch (error) {
      console.error('Error recording achievement:', error);
      return false;
    }
  }

  // Streaks
  static async updateStreak(userId: string, activityType: string): Promise<Streak | null> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get current streak
      const { data: currentStreak } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId)
        .eq('activity_type', activityType)
        .single();
      
      if (currentStreak) {
        const lastActivity = new Date(currentStreak.last_activity_date);
        const todayDate = new Date(today);
        const diffTime = todayDate.getTime() - lastActivity.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let newStreak = currentStreak.current_streak;
        
        if (diffDays === 1) {
          // Consecutive day
          newStreak += 1;
        } else if (diffDays > 1) {
          // Streak broken
          newStreak = 1;
        }
        // Same day = no change
        
        const longestStreak = Math.max(newStreak, currentStreak.longest_streak);
        
        const { data, error } = await supabase
          .from('streaks')
          .update({
            current_streak: newStreak,
            longest_streak: longestStreak,
            last_activity_date: today
          })
          .eq('id', currentStreak.id)
          .select()
          .single();
        
        if (error) throw error;
        
        // Award points for milestones
        if (newStreak % 7 === 0) {
          await this.addPoints(userId, 50, `${newStreak} jours consécutifs`);
        }
        
        return data;
      } else {
        // First streak
        const { data, error } = await supabase
          .from('streaks')
          .insert({
            user_id: userId,
            activity_type: activityType,
            current_streak: 1,
            longest_streak: 1,
            last_activity_date: today
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error updating streak:', error);
      return null;
    }
  }

  // Helper methods
  private static calculateLevel(totalPoints: number): number {
    // Level progression: 100, 300, 600, 1000, 1500, etc.
    const levels = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];
    
    for (let i = levels.length - 1; i >= 0; i--) {
      if (totalPoints >= levels[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  private static async checkBadgeConditions(
    userId: string, 
    badge: Badge, 
    userPoints: UserPoints | null, 
    userStreaks: Streak[]
  ): Promise<boolean> {
    // Simplified badge condition checking
    // In a real app, this would be more sophisticated
    return (userPoints?.total_points || 0) >= badge.points_required;
  }

  private static async awardBadge(userId: string, badgeId: string): Promise<void> {
    await supabase
      .from('user_badges')
      .insert({
        user_id: userId,
        badge_id: badgeId,
        earned_at: new Date().toISOString()
      });
  }

  private static async getUserStreaks(userId: string): Promise<Streak[]> {
    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching streaks:', error);
      return [];
    }
    
    return data || [];
  }
}
