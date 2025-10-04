/**
 * Service pour la gestion des activités
 */

import { supabase } from '@/integrations/supabase/client';
import type { Activity, UserActivity, ActivityFilters } from './types';

export class ActivitiesService {
  /**
   * Récupère toutes les activités avec filtres optionnels
   */
  static async fetchActivities(filters?: ActivityFilters): Promise<Activity[]> {
    let query = supabase
      .from('activities')
      .select('*')
      .order('title', { ascending: true });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }

    if (filters?.maxDuration) {
      query = query.lte('duration_minutes', filters.maxDuration);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Récupère une activité par ID
   */
  static async fetchActivity(id: string): Promise<Activity | null> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Récupère les activités favorites d'un utilisateur
   */
  static async fetchFavorites(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('user_favorite_activities')
      .select('activity_id')
      .eq('user_id', userId);

    if (error) throw error;
    return (data || []).map(row => row.activity_id);
  }

  /**
   * Ajoute une activité aux favoris
   */
  static async addFavorite(userId: string, activityId: string): Promise<void> {
    const { error } = await supabase
      .from('user_favorite_activities')
      .insert({ user_id: userId, activity_id: activityId });

    if (error) throw error;
  }

  /**
   * Retire une activité des favoris
   */
  static async removeFavorite(userId: string, activityId: string): Promise<void> {
    const { error } = await supabase
      .from('user_favorite_activities')
      .delete()
      .eq('user_id', userId)
      .eq('activity_id', activityId);

    if (error) throw error;
  }

  /**
   * Enregistre la complétion d'une activité
   */
  static async completeActivity(
    userId: string,
    activityId: string,
    data: {
      rating?: number;
      notes?: string;
      mood_before?: number;
      mood_after?: number;
    }
  ): Promise<UserActivity> {
    const { data: result, error } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        activity_id: activityId,
        ...data
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  /**
   * Récupère l'historique des activités d'un utilisateur
   */
  static async fetchHistory(userId: string, limit: number = 50): Promise<UserActivity[]> {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Obtient les statistiques d'activités
   */
  static async getStats(userId: string): Promise<{
    totalCompleted: number;
    favoriteCategory: string;
    averageRating: number;
  }> {
    const history = await this.fetchHistory(userId, 1000);

    const totalCompleted = history.length;
    const ratings = history.filter(h => h.rating).map(h => h.rating!);
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 0;

    // Pour déterminer la catégorie favorite, on doit croiser avec les activités
    const activities = await this.fetchActivities();
    const categoryCount = new Map<string, number>();

    history.forEach(h => {
      const activity = activities.find(a => a.id === h.activity_id);
      if (activity) {
        categoryCount.set(
          activity.category,
          (categoryCount.get(activity.category) || 0) + 1
        );
      }
    });

    const favoriteCategory = Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';

    return {
      totalCompleted,
      favoriteCategory,
      averageRating: Math.round(averageRating * 10) / 10
    };
  }
}
