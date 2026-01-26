/**
 * Discovery Service
 * Service pour l'interaction avec l'API Discovery backend
 * 
 * @module discovery
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { DiscoveryItem, DiscoveryCategory, DifficultyLevel } from './types';

// ============================================================================
// TYPES
// ============================================================================

export interface DiscoveryRecommendation {
  type: string;
  title: string;
  priority: number;
  reason: string;
}

export interface DiscoveryRecommendationsResponse {
  recommendations: DiscoveryRecommendation[];
  currentMood: number;
  modulesUsed: number;
}

export interface TrendingResponse {
  trendingActivities: Array<{
    id: string;
    title: string;
    category: string;
    popularity_score: number;
  }>;
  upcomingSessions: Array<{
    id: string;
    title: string;
    category: string;
    scheduled_at: string;
    host: { display_name: string } | null;
  }>;
}

export interface ExploreResponse {
  activities: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    duration_minutes: number;
    popularity_score: number;
    tags: string[];
    icon: string | null;
    image_url: string | null;
  }>;
  category: string;
}

export interface SearchResponse {
  results: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    duration_minutes: number;
    tags: string[];
  }>;
  query: string;
}

// ============================================================================
// SERVICE
// ============================================================================

export class DiscoveryService {
  private static readonly FUNCTION_URL = 'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/discovery-api';

  /**
   * Appel générique à l'Edge Function discovery-api
   */
  private static async callApi<T>(action: string, params: Record<string, unknown> = {}): Promise<T> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(this.FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ action, ...params }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API Error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Récupère les recommandations personnalisées basées sur l'humeur et l'historique
   */
  static async getRecommendations(): Promise<DiscoveryRecommendationsResponse> {
    try {
      const result = await this.callApi<DiscoveryRecommendationsResponse>('recommendations');
      logger.info('[DiscoveryService] Recommendations fetched', { count: result.recommendations.length }, 'API');
      return result;
    } catch (error) {
      logger.error('[DiscoveryService] Failed to fetch recommendations', { error }, 'API');
      throw error;
    }
  }

  /**
   * Récupère les activités tendances et les sessions à venir
   */
  static async getTrending(): Promise<TrendingResponse> {
    try {
      const result = await this.callApi<TrendingResponse>('trending');
      logger.info('[DiscoveryService] Trending fetched', { 
        activities: result.trendingActivities.length,
        sessions: result.upcomingSessions.length,
      }, 'API');
      return result;
    } catch (error) {
      logger.error('[DiscoveryService] Failed to fetch trending', { error }, 'API');
      throw error;
    }
  }

  /**
   * Explore les activités par catégorie
   */
  static async explore(category: string): Promise<ExploreResponse> {
    try {
      const result = await this.callApi<ExploreResponse>('explore', { category });
      logger.info('[DiscoveryService] Explore fetched', { category, count: result.activities.length }, 'API');
      return result;
    } catch (error) {
      logger.error('[DiscoveryService] Failed to explore category', { category, error }, 'API');
      throw error;
    }
  }

  /**
   * Recherche dans les activités
   */
  static async search(query: string, limit: number = 20): Promise<SearchResponse> {
    try {
      const result = await this.callApi<SearchResponse>('search', { query, limit });
      logger.info('[DiscoveryService] Search completed', { query, results: result.results.length }, 'API');
      return result;
    } catch (error) {
      logger.error('[DiscoveryService] Search failed', { query, error }, 'API');
      throw error;
    }
  }

  /**
   * Récupère les items de découverte depuis la base de données locale (activities)
   */
  static async getDiscoveryItems(userId: string): Promise<DiscoveryItem[]> {
    try {
      // Récupérer les activités
      const { data: activities, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .order('popularity_score', { ascending: false })
        .limit(50);

      if (activitiesError) throw activitiesError;

      // Récupérer les sessions complétées par l'utilisateur
      const { data: completedSessions } = await supabase
        .from('activity_sessions')
        .select('activity_id')
        .eq('user_id', userId)
        .eq('completed', true);

      const completedIds = new Set(completedSessions?.map(s => s.activity_id) || []);

      // Mapper vers DiscoveryItem
      const items: DiscoveryItem[] = (activities || []).map(activity => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        category: this.mapCategory(activity.category),
        difficulty: this.mapDifficulty(activity.difficulty),
        status: completedIds.has(activity.id) ? 'completed' : 'available',
        icon: activity.icon || '🎯',
        color: this.getCategoryColor(activity.category),
        estimatedMinutes: activity.duration_minutes || 10,
        xpReward: Math.floor((activity.duration_minutes || 10) * 5),
        tags: activity.tags || [],
        progress: completedIds.has(activity.id) ? 100 : 0,
      }));

      logger.info('[DiscoveryService] Items fetched', { count: items.length }, 'API');
      return items;
    } catch (error) {
      logger.error('[DiscoveryService] Failed to fetch items', { error }, 'API');
      throw error;
    }
  }

  /**
   * Mapper les catégories d'activité vers DiscoveryCategory
   */
  private static mapCategory(category: string): DiscoveryCategory {
    const mapping: Record<string, DiscoveryCategory> = {
      'breathing': 'technique',
      'meditation': 'activity',
      'music': 'activity',
      'coaching': 'technique',
      'vr': 'activity',
      'games': 'challenge',
      'community': 'ressource',
      'journal': 'activity',
      'emotion': 'emotion',
      'insight': 'insight',
    };
    return mapping[category] || 'activity';
  }

  /**
   * Mapper les niveaux de difficulté
   */
  private static mapDifficulty(difficulty: string): DifficultyLevel {
    const mapping: Record<string, DifficultyLevel> = {
      'easy': 'beginner',
      'beginner': 'beginner',
      'medium': 'intermediate',
      'intermediate': 'intermediate',
      'hard': 'advanced',
      'advanced': 'advanced',
      'expert': 'expert',
    };
    return mapping[difficulty?.toLowerCase()] || 'beginner';
  }

  /**
   * Couleur gradient par catégorie
   */
  private static getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'breathing': 'from-teal-500 to-cyan-500',
      'meditation': 'from-indigo-500 to-purple-500',
      'music': 'from-pink-500 to-rose-500',
      'coaching': 'from-amber-500 to-orange-500',
      'vr': 'from-blue-500 to-indigo-500',
      'games': 'from-green-500 to-emerald-500',
      'community': 'from-violet-500 to-purple-500',
      'journal': 'from-yellow-500 to-amber-500',
      'emotion': 'from-red-500 to-pink-500',
    };
    return colors[category] || 'from-gray-500 to-slate-500';
  }

  /**
   * Enregistre une session de découverte complétée
   */
  static async recordSession(
    userId: string,
    itemId: string,
    data: {
      startedAt: string;
      duration: number;
      xpEarned: number;
      rating?: number;
      notes?: string;
      moodAfter?: number;
    }
  ): Promise<void> {
    try {
      const { error } = await supabase.from('activity_sessions').insert({
        user_id: userId,
        activity_id: itemId,
        started_at: data.startedAt,
        completed_at: new Date().toISOString(),
        completed: true,
        duration_seconds: data.duration,
        xp_earned: data.xpEarned,
        rating: data.rating,
        notes: data.notes,
        mood_after: data.moodAfter,
      });

      if (error) throw error;
      logger.info('[DiscoveryService] Session recorded', { itemId, xpEarned: data.xpEarned }, 'API');
    } catch (error) {
      logger.error('[DiscoveryService] Failed to record session', { error }, 'API');
      throw error;
    }
  }
}

export const discoveryService = new DiscoveryService();
export default DiscoveryService;
