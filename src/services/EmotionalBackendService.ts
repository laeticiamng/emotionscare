/**
 * Service Client pour l'API Backend Émotionnelle
 *
 * Wrapper TypeScript pour interagir avec l'edge function emotional-api
 *
 * @module EmotionalBackendService
 * @version 1.0.0
 * @created 2025-11-14
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface Achievement {
  id: string;
  user_id: string;
  achievement_id: string;
  achievement_title: string;
  achievement_description?: string;
  category: 'scan' | 'streak' | 'journey' | 'mastery' | 'social' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  xp_reward: number;
  unlocked_at: string;
  progress: number;
  metadata?: Record<string, any>;
}

export interface EmotionalStats {
  user_id: string;
  total_scans: number;
  total_journal_entries: number;
  emotions_discovered: string[];
  favorite_emotion?: string;
  average_mood_score: number;
  average_valence: number;
  average_arousal: number;
  emotional_variability: number;
  days_active: number;
  first_activity_date?: string;
  last_activity_date?: string;
  level: number;
  xp: number;
  next_level_xp: number;
  total_xp_earned: number;
  current_streak: number;
  longest_streak: number;
  last_check_in?: string;
  total_check_ins: number;
  scan_types_used: string[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface EmotionalPattern {
  id: string;
  user_id: string;
  pattern_type: 'recurring' | 'seasonal' | 'contextual' | 'triggered';
  emotion: string;
  frequency: number;
  confidence: number;
  strength: number;
  time_of_day?: 'morning' | 'afternoon' | 'evening' | 'night';
  day_of_week?: number;
  month_of_year?: number;
  context?: string;
  description: string;
  detection_start_date: string;
  detection_end_date: string;
  last_occurrence?: string;
  occurrence_count: number;
  is_active: boolean;
  metadata?: Record<string, any>;
}

export interface EmotionalInsight {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: 'positive' | 'neutral' | 'warning' | 'tip';
  category: 'trend' | 'pattern' | 'suggestion' | 'achievement';
  confidence: number;
  priority: number;
  actionable: boolean;
  action_label?: string;
  action_type?: string;
  action_data?: Record<string, any>;
  is_read: boolean;
  is_dismissed: boolean;
  read_at?: string;
  dismissed_at?: string;
  valid_from: string;
  valid_until?: string;
  generated_by: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface EmotionalTrend {
  id: string;
  user_id: string;
  emotion: string;
  period_comparison: 'day' | 'week' | 'month' | 'year';
  change_percentage: number;
  direction: 'up' | 'down' | 'stable';
  period_start: string;
  period_end: string;
  previous_value?: number;
  current_value?: number;
  average_score?: number;
  max_score?: number;
  min_score?: number;
  occurrence_count: number;
  metadata?: Record<string, any>;
}

export interface DashboardSummary {
  user_id: string;
  level: number;
  xp: number;
  next_level_xp: number;
  total_scans: number;
  average_mood_score: number;
  emotional_variability: number;
  current_streak: number;
  longest_streak: number;
  total_achievements_unlocked: number;
  diamond_achievements: number;
  active_patterns: number;
  unread_insights: number;
}

export interface LeaderboardEntry {
  user_id: string;
  level: number;
  total_xp_earned: number;
  total_scans: number;
  current_streak: number;
  longest_streak: number;
  total_achievements: number;
  rank: number;
}

// ═══════════════════════════════════════════════════════════
// SERVICE CLASS
// ═══════════════════════════════════════════════════════════

class EmotionalBackendServiceClass {
  private readonly baseUrl: string;

  constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    this.baseUrl = `${supabaseUrl}/functions/v1/emotional-api`;
  }

  /**
   * Effectue une requête vers l'API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      // Récupérer le token d'authentification
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      logger.error('EmotionalBackendService request failed', error, 'BACKEND_SERVICE');
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // STATS
  // ═══════════════════════════════════════════════════════════

  /**
   * Récupère les statistiques de l'utilisateur
   */
  async getStats(): Promise<EmotionalStats> {
    const data = await this.request<{ stats: EmotionalStats }>('/stats');
    logger.debug('Stats retrieved', { level: data.stats.level, xp: data.stats.xp }, 'BACKEND_SERVICE');
    return data.stats;
  }

  // ═══════════════════════════════════════════════════════════
  // ACHIEVEMENTS
  // ═══════════════════════════════════════════════════════════

  /**
   * Récupère les achievements de l'utilisateur
   */
  async getAchievements(): Promise<Achievement[]> {
    const data = await this.request<{ achievements: Achievement[] }>('/achievements');
    logger.debug('Achievements retrieved', { count: data.achievements.length }, 'BACKEND_SERVICE');
    return data.achievements;
  }

  /**
   * Vérifie et débloque les achievements
   */
  async checkAchievements(): Promise<Achievement[]> {
    const data = await this.request<{ achievements: Achievement[] }>('/check-achievements', {
      method: 'POST',
    });
    logger.info('Achievements checked', { count: data.achievements.length }, 'BACKEND_SERVICE');
    return data.achievements;
  }

  // ═══════════════════════════════════════════════════════════
  // DASHBOARD
  // ═══════════════════════════════════════════════════════════

  /**
   * Récupère le dashboard complet
   */
  async getDashboard(): Promise<DashboardSummary | null> {
    const data = await this.request<{ dashboard: DashboardSummary | null }>('/dashboard');
    return data.dashboard;
  }

  // ═══════════════════════════════════════════════════════════
  // PATTERNS
  // ═══════════════════════════════════════════════════════════

  /**
   * Récupère les patterns émotionnels actifs
   */
  async getPatterns(): Promise<EmotionalPattern[]> {
    const data = await this.request<{ patterns: EmotionalPattern[] }>('/patterns');
    logger.debug('Patterns retrieved', { count: data.patterns.length }, 'BACKEND_SERVICE');
    return data.patterns;
  }

  // ═══════════════════════════════════════════════════════════
  // INSIGHTS
  // ═══════════════════════════════════════════════════════════

  /**
   * Récupère les insights
   */
  async getInsights(unreadOnly = false): Promise<EmotionalInsight[]> {
    const query = unreadOnly ? '?unreadOnly=true' : '';
    const data = await this.request<{ insights: EmotionalInsight[] }>(`/insights${query}`);
    logger.debug('Insights retrieved', { count: data.insights.length, unreadOnly }, 'BACKEND_SERVICE');
    return data.insights;
  }

  /**
   * Marque un insight comme lu
   */
  async markInsightAsRead(insightId: string): Promise<EmotionalInsight> {
    const data = await this.request<{ insight: EmotionalInsight }>(
      `/insights/${insightId}/read`,
      { method: 'PATCH' }
    );
    logger.debug('Insight marked as read', { insightId }, 'BACKEND_SERVICE');
    return data.insight;
  }

  /**
   * Génère des insights automatiquement
   */
  async generateInsights(): Promise<EmotionalInsight[]> {
    const data = await this.request<{ insights: EmotionalInsight[]; message: string }>(
      '/generate-insights',
      { method: 'POST' }
    );
    logger.info('Insights generated', { count: data.insights.length }, 'BACKEND_SERVICE');
    return data.insights;
  }

  // ═══════════════════════════════════════════════════════════
  // TRENDS
  // ═══════════════════════════════════════════════════════════

  /**
   * Récupère les tendances émotionnelles
   */
  async getTrends(period: 'day' | 'week' | 'month' | 'year' = 'week'): Promise<EmotionalTrend[]> {
    const data = await this.request<{ trends: EmotionalTrend[] }>(`/trends?period=${period}`);
    logger.debug('Trends retrieved', { count: data.trends.length, period }, 'BACKEND_SERVICE');
    return data.trends;
  }

  // ═══════════════════════════════════════════════════════════
  // LEADERBOARD
  // ═══════════════════════════════════════════════════════════

  /**
   * Récupère le classement
   */
  async getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    const data = await this.request<{ leaderboard: LeaderboardEntry[] }>(
      `/leaderboard?limit=${limit}`
    );
    logger.debug('Leaderboard retrieved', { count: data.leaderboard.length }, 'BACKEND_SERVICE');
    return data.leaderboard;
  }

  // ═══════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════

  /**
   * Récupère un aperçu complet pour le dashboard
   */
  async getDashboardOverview(): Promise<{
    stats: EmotionalStats;
    achievements: Achievement[];
    insights: EmotionalInsight[];
    patterns: EmotionalPattern[];
    dashboard: DashboardSummary | null;
  }> {
    const [stats, achievements, insights, patterns, dashboard] = await Promise.all([
      this.getStats(),
      this.getAchievements(),
      this.getInsights(true), // Uniquement non lus
      this.getPatterns(),
      this.getDashboard(),
    ]);

    return {
      stats,
      achievements,
      insights,
      patterns,
      dashboard,
    };
  }

  /**
   * Récupère les nouveaux achievements depuis la dernière vérification
   */
  async getNewAchievements(): Promise<Achievement[]> {
    const achievements = await this.checkAchievements();

    // Filtrer ceux débloqués dans les dernières 24h
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return achievements.filter(a => new Date(a.unlocked_at) > yesterday);
  }

  /**
   * Récupère le prochain achievement à débloquer
   */
  async getNextAchievements(stats: EmotionalStats): Promise<{
    achievement_id: string;
    title: string;
    progress: number;
    requirement: number;
  }[]> {
    const nextAchievements: {
      achievement_id: string;
      title: string;
      progress: number;
      requirement: number;
    }[] = [];

    // Scan achievements
    if (stats.total_scans < 10) {
      nextAchievements.push({
        achievement_id: 'scan_explorer',
        title: 'Explorateur d\'Émotions',
        progress: stats.total_scans,
        requirement: 10,
      });
    } else if (stats.total_scans < 100) {
      nextAchievements.push({
        achievement_id: 'scan_master',
        title: 'Maître du Scan',
        progress: stats.total_scans,
        requirement: 100,
      });
    } else if (stats.total_scans < 500) {
      nextAchievements.push({
        achievement_id: 'scan_legend',
        title: 'Légende Émotionnelle',
        progress: stats.total_scans,
        requirement: 500,
      });
    }

    // Streak achievements
    if (stats.current_streak < 7) {
      nextAchievements.push({
        achievement_id: 'streak_week',
        title: 'Constance Hebdomadaire',
        progress: stats.current_streak,
        requirement: 7,
      });
    } else if (stats.current_streak < 30) {
      nextAchievements.push({
        achievement_id: 'streak_month',
        title: 'Engagement Mensuel',
        progress: stats.current_streak,
        requirement: 30,
      });
    }

    // Diversity achievement
    if (stats.emotions_discovered.length < 20) {
      nextAchievements.push({
        achievement_id: 'emotion_diversity',
        title: 'Arc-en-ciel Émotionnel',
        progress: stats.emotions_discovered.length,
        requirement: 20,
      });
    }

    // Scan types achievement
    if (stats.scan_types_used.length < 4) {
      nextAchievements.push({
        achievement_id: 'all_scan_types',
        title: 'Multi-Modaliste',
        progress: stats.scan_types_used.length,
        requirement: 4,
      });
    }

    return nextAchievements;
  }
}

// ═══════════════════════════════════════════════════════════
// EXPORT SINGLETON
// ═══════════════════════════════════════════════════════════

export const EmotionalBackendService = new EmotionalBackendServiceClass();

export default EmotionalBackendService;
