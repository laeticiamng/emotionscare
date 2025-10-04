/**
 * Service pour le suivi d'activité et analytics
 */

import { supabase } from '@/integrations/supabase/client';

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  module_name: string;
  duration_seconds?: number;
  metadata?: any;
  created_at: string;
}

export class ActivityService {
  /**
   * Enregistrer une activité
   */
  static async logActivity(
    userId: string,
    activityType: string,
    moduleName: string,
    durationSeconds?: number,
    metadata?: any
  ): Promise<void> {
    const { error } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        activity_type: activityType,
        module_name: moduleName,
        duration_seconds: durationSeconds,
        metadata
      });

    if (error) throw error;
  }

  /**
   * Récupérer l'historique d'activité
   */
  static async fetchActivities(
    userId: string,
    limit: number = 100
  ): Promise<UserActivity[]> {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Récupérer les statistiques d'utilisation
   */
  static async getUsageStats(userId: string, days: number = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const moduleUsage = new Map<string, number>();
    const activityByDay = new Map<string, number>();
    let totalDuration = 0;

    data?.forEach(activity => {
      // Par module
      moduleUsage.set(
        activity.module_name,
        (moduleUsage.get(activity.module_name) || 0) + 1
      );

      // Par jour
      const day = activity.created_at.split('T')[0];
      activityByDay.set(day, (activityByDay.get(day) || 0) + 1);

      // Durée totale
      totalDuration += activity.duration_seconds || 0;
    });

    return {
      totalActivities: data?.length || 0,
      totalMinutes: Math.round(totalDuration / 60),
      moduleUsage: Object.fromEntries(moduleUsage),
      activityByDay: Object.fromEntries(activityByDay),
      averageSessionDuration: data?.length > 0 ? Math.round(totalDuration / data.length / 60) : 0
    };
  }

  /**
   * Récupérer les achievements
   */
  static async fetchAchievements(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*, achievements(*)')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Récupérer les badges
   */
  static async fetchBadges(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', userId)
      .order('awarded_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
