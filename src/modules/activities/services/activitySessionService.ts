/**
 * Service pour les sessions d'activités
 */

import { supabase } from '@/integrations/supabase/client';

export interface ActivitySession {
  id: string;
  user_id: string;
  activity_id: string | null;
  started_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  mood_before: number | null;
  mood_after: number | null;
  energy_before: number | null;
  energy_after: number | null;
  rating: number | null;
  notes: string | null;
  was_guided: boolean;
  completed: boolean;
  xp_earned: number;
  metadata: Record<string, unknown>;
}

export interface ActivityStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  total_activities: number;
  total_minutes: number;
  weekly_goal: number;
  weekly_progress: number;
}

export interface ActivityBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement_type: string;
  requirement_value: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp_reward: number;
}

export interface UserActivityBadge {
  id: string;
  user_id: string;
  badge_id: string;
  unlocked_at: string;
  shared: boolean;
  activity_badges?: ActivityBadge;
}

export class ActivitySessionService {
  /**
   * Démarre une nouvelle session d'activité
   */
  static async startSession(
    userId: string,
    activityId: string,
    moodBefore?: number,
    energyBefore?: number
  ): Promise<ActivitySession> {
    const { data, error } = await supabase
      .from('activity_sessions')
      .insert({
        user_id: userId,
        activity_id: activityId,
        mood_before: moodBefore,
        energy_before: energyBefore,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data as ActivitySession;
  }

  /**
   * Termine une session d'activité
   */
  static async completeSession(
    sessionId: string,
    data: {
      mood_after?: number;
      energy_after?: number;
      rating?: number;
      notes?: string;
      was_guided?: boolean;
    }
  ): Promise<ActivitySession> {
    const now = new Date();
    
    // Get the session to calculate duration
    const { data: session } = await supabase
      .from('activity_sessions')
      .select('started_at')
      .eq('id', sessionId)
      .single();

    const startedAt = session?.started_at ? new Date(session.started_at) : now;
    const durationSeconds = Math.round((now.getTime() - startedAt.getTime()) / 1000);
    
    // Calculate XP (base 10 + duration bonus + mood improvement bonus)
    let xpEarned = 10;
    xpEarned += Math.min(Math.floor(durationSeconds / 60), 20); // up to 20 XP for duration

    const { data: result, error } = await supabase
      .from('activity_sessions')
      .update({
        ...data,
        completed_at: now.toISOString(),
        duration_seconds: durationSeconds,
        completed: true,
        xp_earned: xpEarned
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return result as ActivitySession;
  }

  /**
   * Récupère l'historique des sessions
   */
  static async getSessions(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<ActivitySession[]> {
    const { data, error } = await supabase
      .from('activity_sessions')
      .select('*, activities(*)')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return (data || []) as ActivitySession[];
  }

  /**
   * Récupère les statistiques de streak
   */
  static async getStreak(userId: string): Promise<ActivityStreak | null> {
    const { data, error } = await supabase
      .from('activity_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as ActivityStreak | null;
  }

  /**
   * Récupère les badges gagnés
   */
  static async getUserBadges(userId: string): Promise<UserActivityBadge[]> {
    const { data, error } = await supabase
      .from('user_activity_badges')
      .select('*, activity_badges(*)')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) throw error;
    return (data || []) as UserActivityBadge[];
  }

  /**
   * Récupère tous les badges disponibles
   */
  static async getAllBadges(): Promise<ActivityBadge[]> {
    const { data, error } = await supabase
      .from('activity_badges')
      .select('*')
      .order('requirement_value', { ascending: true });

    if (error) throw error;
    return (data || []) as ActivityBadge[];
  }

  /**
   * Récupère les recommandations d'activités
   */
  static async getRecommendations(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('activity_recommendations')
      .select('*, activities(*)')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('score', { ascending: false })
      .limit(5);

    if (error) throw error;
    return data || [];
  }

  /**
   * Génère des recommandations basées sur l'historique
   */
  static async generateRecommendations(userId: string): Promise<void> {
    // Get user's history
    const { data: history } = await supabase
      .from('activity_sessions')
      .select('activity_id, mood_after, rating')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('started_at', { ascending: false })
      .limit(20);

    // Get all activities
    const { data: activities } = await supabase
      .from('activities')
      .select('*');

    if (!activities) return;

    // Clear old recommendations
    await supabase
      .from('activity_recommendations')
      .delete()
      .eq('user_id', userId);

    // Simple recommendation logic
    const completedIds = new Set((history || []).map(h => h.activity_id));
    const recommendations = activities
      .filter(a => !completedIds.has(a.id))
      .slice(0, 5)
      .map(activity => ({
        user_id: userId,
        activity_id: activity.id,
        reason: `Découvrez cette activité de ${activity.category}`,
        score: Math.random() * 0.5 + 0.5,
        based_on: 'history',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }));

    if (recommendations.length > 0) {
      await supabase
        .from('activity_recommendations')
        .insert(recommendations);
    }
  }

  /**
   * Récupère les statistiques détaillées
   */
  static async getDetailedStats(userId: string): Promise<{
    totalSessions: number;
    totalMinutes: number;
    averageMoodImprovement: number;
    favoriteCategory: string;
    completionRate: number;
    byCategory: Record<string, number>;
    byDay: Record<string, number>;
  }> {
    const { data: sessions } = await supabase
      .from('activity_sessions')
      .select('*, activities(category)')
      .eq('user_id', userId);

    const allSessions = sessions || [];
    const completedSessions = allSessions.filter(s => s.completed);

    const totalMinutes = completedSessions.reduce(
      (sum, s) => sum + Math.round((s.duration_seconds || 0) / 60), 
      0
    );

    const moodImprovements = completedSessions
      .filter(s => s.mood_before && s.mood_after)
      .map(s => (s.mood_after || 0) - (s.mood_before || 0));
    
    const avgMoodImprovement = moodImprovements.length > 0
      ? moodImprovements.reduce((a, b) => a + b, 0) / moodImprovements.length
      : 0;

    const categoryCount: Record<string, number> = {};
    const dayCount: Record<string, number> = {};

    completedSessions.forEach(s => {
      const category = (s.activities as any)?.category || 'unknown';
      categoryCount[category] = (categoryCount[category] || 0) + 1;

      const day = new Date(s.started_at).toLocaleDateString('fr-FR', { weekday: 'short' });
      dayCount[day] = (dayCount[day] || 0) + 1;
    });

    const favoriteCategory = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';

    return {
      totalSessions: completedSessions.length,
      totalMinutes,
      averageMoodImprovement: Math.round(avgMoodImprovement * 10) / 10,
      favoriteCategory,
      completionRate: allSessions.length > 0 
        ? Math.round((completedSessions.length / allSessions.length) * 100) 
        : 0,
      byCategory: categoryCount,
      byDay: dayCount
    };
  }
}
