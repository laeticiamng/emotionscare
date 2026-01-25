/**
 * GamificationService ENRICHED - Service de gamification complet
 * Version enrichie avec export, historique points, objectifs personnels, partage
 */

import { supabase } from '@/integrations/supabase/client';
import { UserPoints, UserBadge, Achievement, Streak } from '@/types/gamification';
import { logger } from '@/lib/logger';

// ─────────────────────────────────────────────────────────────
// LOCAL STORAGE KEYS
// ─────────────────────────────────────────────────────────────

const PERSONAL_GOALS_KEY = 'gamification-personal-goals';
const POINT_HISTORY_KEY = 'gamification-point-history';
const _ACHIEVEMENTS_CACHE_KEY = 'gamification-achievements-cache';
const WEEKLY_TARGETS_KEY = 'gamification-weekly-targets';

// ─────────────────────────────────────────────────────────────
// ENRICHED TYPES
// ─────────────────────────────────────────────────────────────

export interface PersonalGoal {
  id: string;
  type: 'points' | 'level' | 'streak' | 'achievements' | 'badges';
  target: number;
  current: number;
  deadline: string;
  completed: boolean;
  completedAt?: string;
  reward?: number;
}

export interface PointHistoryEntry {
  id: string;
  points: number;
  reason: string;
  timestamp: string;
  category: 'activity' | 'achievement' | 'streak' | 'bonus' | 'challenge';
}

export interface WeeklyTarget {
  weekStart: string;
  pointsTarget: number;
  pointsEarned: number;
  activitiesTarget: number;
  activitiesCompleted: number;
  streakTarget: number;
  currentStreak: number;
}

export interface GamificationExport {
  points: UserPoints | null;
  badges: UserBadge[];
  achievements: Achievement[];
  streaks: Streak[];
  goals: PersonalGoal[];
  history: PointHistoryEntry[];
  weeklyTargets: WeeklyTarget[];
  exportedAt: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  level: number;
  rank: number;
  isCurrentUser?: boolean;
}

// ─────────────────────────────────────────────────────────────
// LOCAL STORAGE HELPERS
// ─────────────────────────────────────────────────────────────

function getPersonalGoals(): PersonalGoal[] {
  try {
    return JSON.parse(localStorage.getItem(PERSONAL_GOALS_KEY) || '[]');
  } catch { return []; }
}

function savePersonalGoals(goals: PersonalGoal[]): void {
  localStorage.setItem(PERSONAL_GOALS_KEY, JSON.stringify(goals));
}

function getPointHistory(): PointHistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(POINT_HISTORY_KEY) || '[]');
  } catch { return []; }
}

function savePointHistory(history: PointHistoryEntry[]): void {
  localStorage.setItem(POINT_HISTORY_KEY, JSON.stringify(history.slice(0, 500)));
}

function getWeeklyTargets(): WeeklyTarget[] {
  try {
    return JSON.parse(localStorage.getItem(WEEKLY_TARGETS_KEY) || '[]');
  } catch { return []; }
}

function saveWeeklyTargets(targets: WeeklyTarget[]): void {
  localStorage.setItem(WEEKLY_TARGETS_KEY, JSON.stringify(targets.slice(0, 52)));
}

function getCurrentWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(now.setDate(diff)).toISOString().split('T')[0];
}

// ─────────────────────────────────────────────────────────────
// ENRICHED SERVICE
// ─────────────────────────────────────────────────────────────

class GamificationServiceEnriched {
  // ========== ORIGINAL METHODS ==========
  
  async getUserPoints(): Promise<UserPoints | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
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
      logger.error('Erreur récupération points', error as Error, 'GamificationService');
      return null;
    }
  }

  async getUserBadges(): Promise<UserBadge[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_badges')
        .select('*, badge:badges(*)')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur récupération badges', error as Error, 'GamificationService');
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
      logger.error('Erreur récupération achievements', error as Error, 'GamificationService');
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
      logger.error('Erreur récupération streaks', error as Error, 'GamificationService');
      return [];
    }
  }

  async awardPoints(points: number, reason: string, category: PointHistoryEntry['category'] = 'activity'): Promise<UserPoints> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const currentPoints = await this.getUserPoints();
      if (!currentPoints) throw new Error('Impossible de récupérer les points');

      const newTotalPoints = currentPoints.total_points + points;
      const newLevel = this.calculateLevel(newTotalPoints);

      const { data, error } = await supabase
        .from('user_points')
        .update({
          total_points: newTotalPoints,
          level: newLevel,
          experience_points: currentPoints.experience_points + points,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Add to local history
      const historyEntry: PointHistoryEntry = {
        id: crypto.randomUUID(),
        points,
        reason,
        timestamp: new Date().toISOString(),
        category,
      };
      const history = getPointHistory();
      savePointHistory([historyEntry, ...history]);

      // Update weekly targets
      this.updateWeeklyProgress(points, 1);

      // Check personal goals
      this.checkPersonalGoals(data);

      return data;
    } catch (error) {
      logger.error('Erreur attribution points', error as Error, 'GamificationService');
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

  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('user_points')
        .select('*, profiles:user_id(full_name, avatar_url)')
        .order('total_points', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map((entry, index) => ({
        id: entry.user_id,
        name: entry.profiles?.full_name || 'Utilisateur',
        avatar: entry.profiles?.avatar_url,
        points: entry.total_points,
        level: entry.level,
        rank: index + 1,
        isCurrentUser: user?.id === entry.user_id,
      })) || [];
    } catch (error) {
      logger.error('Erreur récupération leaderboard', error as Error, 'GamificationService');
      return [];
    }
  }

  // ========== ENRICHED: PERSONAL GOALS ==========

  getPersonalGoals(): PersonalGoal[] {
    return getPersonalGoals();
  }

  createPersonalGoal(type: PersonalGoal['type'], target: number, deadlineDays: number = 7): PersonalGoal {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + deadlineDays);

    const goal: PersonalGoal = {
      id: crypto.randomUUID(),
      type,
      target,
      current: 0,
      deadline: deadline.toISOString(),
      completed: false,
      reward: Math.round(target * 0.1),
    };

    const goals = getPersonalGoals();
    savePersonalGoals([...goals, goal]);
    
    return goal;
  }

  updatePersonalGoal(goalId: string, current: number): PersonalGoal | null {
    const goals = getPersonalGoals();
    const goalIndex = goals.findIndex(g => g.id === goalId);
    
    if (goalIndex === -1) return null;

    const goal = goals[goalIndex];
    goal.current = current;
    
    if (current >= goal.target && !goal.completed) {
      goal.completed = true;
      goal.completedAt = new Date().toISOString();
      // Award bonus points for completing goal
      if (goal.reward) {
        this.awardPoints(goal.reward, `Objectif atteint: ${goal.type}`, 'bonus');
      }
    }

    goals[goalIndex] = goal;
    savePersonalGoals(goals);
    
    return goal;
  }

  deletePersonalGoal(goalId: string): void {
    const goals = getPersonalGoals().filter(g => g.id !== goalId);
    savePersonalGoals(goals);
  }

  private async checkPersonalGoals(points: UserPoints): Promise<void> {
    const goals = getPersonalGoals();
    
    goals.forEach(goal => {
      if (goal.completed) return;
      
      let current = 0;
      switch (goal.type) {
        case 'points':
          current = points.total_points;
          break;
        case 'level':
          current = points.level;
          break;
      }
      
      if (current > goal.current) {
        this.updatePersonalGoal(goal.id, current);
      }
    });
  }

  // ========== ENRICHED: POINT HISTORY ==========

  getPointHistory(limit: number = 50): PointHistoryEntry[] {
    return getPointHistory().slice(0, limit);
  }

  getPointHistoryByCategory(category: PointHistoryEntry['category']): PointHistoryEntry[] {
    return getPointHistory().filter(h => h.category === category);
  }

  getPointsEarnedToday(): number {
    const today = new Date().toISOString().split('T')[0];
    return getPointHistory()
      .filter(h => h.timestamp.startsWith(today))
      .reduce((sum, h) => sum + h.points, 0);
  }

  getPointsEarnedThisWeek(): number {
    const weekStart = getCurrentWeekStart();
    return getPointHistory()
      .filter(h => h.timestamp >= weekStart)
      .reduce((sum, h) => sum + h.points, 0);
  }

  // ========== ENRICHED: WEEKLY TARGETS ==========

  getCurrentWeeklyTarget(): WeeklyTarget {
    const weekStart = getCurrentWeekStart();
    const targets = getWeeklyTargets();
    
    let current = targets.find(t => t.weekStart === weekStart);
    
    if (!current) {
      current = {
        weekStart,
        pointsTarget: 500,
        pointsEarned: 0,
        activitiesTarget: 10,
        activitiesCompleted: 0,
        streakTarget: 7,
        currentStreak: 0,
      };
      saveWeeklyTargets([current, ...targets]);
    }
    
    return current;
  }

  setWeeklyTargets(pointsTarget: number, activitiesTarget: number): void {
    const weekStart = getCurrentWeekStart();
    const targets = getWeeklyTargets();
    const index = targets.findIndex(t => t.weekStart === weekStart);
    
    if (index >= 0) {
      targets[index].pointsTarget = pointsTarget;
      targets[index].activitiesTarget = activitiesTarget;
    } else {
      targets.unshift({
        weekStart,
        pointsTarget,
        pointsEarned: 0,
        activitiesTarget,
        activitiesCompleted: 0,
        streakTarget: 7,
        currentStreak: 0,
      });
    }
    
    saveWeeklyTargets(targets);
  }

  private updateWeeklyProgress(points: number, activities: number): void {
    const weekStart = getCurrentWeekStart();
    const targets = getWeeklyTargets();
    const index = targets.findIndex(t => t.weekStart === weekStart);
    
    if (index >= 0) {
      targets[index].pointsEarned += points;
      targets[index].activitiesCompleted += activities;
      saveWeeklyTargets(targets);
    }
  }

  // ========== ENRICHED: EXPORT & SHARE ==========

  async exportData(): Promise<GamificationExport> {
    const [points, badges, achievements, streaks] = await Promise.all([
      this.getUserPoints(),
      this.getUserBadges(),
      this.getUserAchievements(),
      this.getUserStreaks(),
    ]);

    return {
      points,
      badges,
      achievements,
      streaks,
      goals: getPersonalGoals(),
      history: getPointHistory(),
      weeklyTargets: getWeeklyTargets(),
      exportedAt: new Date().toISOString(),
    };
  }

  downloadExport(data: GamificationExport): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gamification-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async generateShareText(): Promise<string> {
    const points = await this.getUserPoints();
    const achievements = await this.getUserAchievements();
    const streaks = await this.getUserStreaks();
    
    const longestStreak = streaks.reduce((max, s) => Math.max(max, s.longest_streak || 0), 0);
    
    return `🎮 Mon profil EmotionsCare\n\n` +
      `⭐ Niveau ${points?.level || 1}\n` +
      `💎 ${points?.total_points || 0} points\n` +
      `🏆 ${achievements.length} succès\n` +
      `🔥 Meilleure série: ${longestStreak} jours\n\n` +
      `#EmotionsCare #BienEtre`;
  }

  async shareLeaderboardPosition(): Promise<string> {
    const leaderboard = await this.getLeaderboard(100);
    const myPosition = leaderboard.find(e => e.isCurrentUser);
    
    if (!myPosition) return 'Je suis sur EmotionsCare !';
    
    return `🏅 Je suis #${myPosition.rank} sur le classement EmotionsCare !\n` +
      `💪 ${myPosition.points} points - Niveau ${myPosition.level}\n\n` +
      `Rejoins-moi ! #EmotionsCare`;
  }

  // ========== ENRICHED: ANALYTICS ==========

  async getGamificationStats(): Promise<{
    totalPointsEarned: number;
    averagePointsPerDay: number;
    mostProductiveDay: string;
    favoriteCategory: string;
    completedGoals: number;
    totalGoals: number;
    weeklyProgress: number;
  }> {
    const history = getPointHistory();
    const goals = getPersonalGoals();
    const weeklyTarget = this.getCurrentWeeklyTarget();
    
    // Points per day
    const pointsByDay = new Map<string, number>();
    history.forEach(h => {
      const day = h.timestamp.split('T')[0];
      pointsByDay.set(day, (pointsByDay.get(day) || 0) + h.points);
    });
    
    // Most productive day
    const [mostProductiveDay] = Array.from(pointsByDay.entries())
      .sort((a, b) => b[1] - a[1])[0] || ['N/A', 0];
    
    // Favorite category
    const categoryCount = new Map<string, number>();
    history.forEach(h => {
      categoryCount.set(h.category, (categoryCount.get(h.category) || 0) + 1);
    });
    const [favoriteCategory] = Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])[0] || ['activity', 0];
    
    const totalPoints = history.reduce((sum, h) => sum + h.points, 0);
    const daysActive = pointsByDay.size || 1;
    
    return {
      totalPointsEarned: totalPoints,
      averagePointsPerDay: Math.round(totalPoints / daysActive),
      mostProductiveDay,
      favoriteCategory,
      completedGoals: goals.filter(g => g.completed).length,
      totalGoals: goals.length,
      weeklyProgress: weeklyTarget.pointsTarget > 0 
        ? Math.round((weeklyTarget.pointsEarned / weeklyTarget.pointsTarget) * 100)
        : 0,
    };
  }
}

export const gamificationServiceEnriched = new GamificationServiceEnriched();
export default gamificationServiceEnriched;
