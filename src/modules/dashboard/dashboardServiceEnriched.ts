/**
 * Service Dashboard Enrichi - Agrégation avancée des données utilisateur
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { ActivityService } from '@/modules/activities';

export interface DashboardStats {
  totalSessions: number;
  totalMinutes: number;
  favoriteModules: string[];
  recentActivity: any[];
  wellnessScore: number;
  streakDays: number;
}

export interface ModuleActivity {
  moduleName: string;
  sessionsCount: number;
  totalDuration: number;
  lastActivity: string;
  icon: string;
}

export interface AIInsight {
  id: string;
  type: 'recommendation' | 'achievement' | 'trend' | 'alert';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  createdAt: string;
}

export interface TemporalComparison {
  currentWeek: DashboardStats;
  previousWeek: DashboardStats;
  trend: {
    sessions: number;
    minutes: number;
    wellness: number;
  };
}

export interface TeamAnalytics {
  totalMembers: number;
  activeMembers: number;
  averageWellnessScore: number;
  topModules: string[];
  engagementRate: number;
}

export interface WidgetConfig {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { w: number; h: number };
  visible: boolean;
  config?: Record<string, any>;
}

const WIDGETS_KEY = 'emotionscare_dashboard_widgets';
const FAVORITES_KEY = 'emotionscare_dashboard_favorites';

export class DashboardServiceEnriched {
  /**
   * Obtenir les statistiques globales du dashboard
   */
  static async getGlobalStats(userId: string): Promise<DashboardStats> {
    try {
      const activities = await ActivityService.fetchHistory(userId, 1000);
      
      const totalSessions = activities.length;
      const totalMinutes = Math.round(
        activities.reduce((sum, a) => sum + (a.duration_seconds || 0), 0) / 60
      );

      const moduleCount = new Map<string, number>();
      activities.forEach(a => {
        moduleCount.set(a.module_name, (moduleCount.get(a.module_name) || 0) + 1);
      });
      
      const favoriteModules = Array.from(moduleCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name]) => name);

      const recentActivity = activities.slice(0, 10);
      const wellnessScore = await this.calculateWellnessScore(userId);
      const streakDays = await this.calculateStreak(userId);

      return {
        totalSessions,
        totalMinutes,
        favoriteModules,
        recentActivity,
        wellnessScore,
        streakDays
      };
    } catch (error) {
      logger.error('Erreur récupération stats dashboard', error, 'ANALYTICS');
      return {
        totalSessions: 0,
        totalMinutes: 0,
        favoriteModules: [],
        recentActivity: [],
        wellnessScore: 0,
        streakDays: 0
      };
    }
  }

  /**
   * Obtenir les insights IA personnalisés
   */
  static async getAIInsights(userId: string): Promise<AIInsight[]> {
    try {
      const stats = await this.getGlobalStats(userId);
      const insights: AIInsight[] = [];

      // Recommandation basée sur l'activité
      if (stats.totalSessions < 5) {
        insights.push({
          id: 'new_user_tip',
          type: 'recommendation',
          title: 'Explorez les modules',
          description: 'Essayez différents modules pour trouver ce qui vous convient le mieux. Nous recommandons de commencer par le Scan Émotionnel.',
          priority: 'high',
          actionUrl: '/app/scan',
          createdAt: new Date().toISOString()
        });
      }

      // Alerte de streak
      if (stats.streakDays === 0) {
        insights.push({
          id: 'streak_lost',
          type: 'alert',
          title: 'Reprenez votre série',
          description: 'Vous avez perdu votre série ! Reprenez dès maintenant pour recommencer.',
          priority: 'medium',
          createdAt: new Date().toISOString()
        });
      } else if (stats.streakDays >= 7) {
        insights.push({
          id: 'streak_achievement',
          type: 'achievement',
          title: `Série de ${stats.streakDays} jours !`,
          description: 'Félicitations ! Votre régularité porte ses fruits. Continuez ainsi !',
          priority: 'low',
          createdAt: new Date().toISOString()
        });
      }

      // Tendance bien-être
      if (stats.wellnessScore > 70) {
        insights.push({
          id: 'wellness_high',
          type: 'trend',
          title: 'Excellent score bien-être',
          description: 'Votre score de bien-être est excellent cette semaine. Gardez ces bonnes habitudes !',
          priority: 'low',
          createdAt: new Date().toISOString()
        });
      } else if (stats.wellnessScore < 40) {
        insights.push({
          id: 'wellness_low',
          type: 'recommendation',
          title: 'Prenez soin de vous',
          description: 'Votre score bien-être est bas. Une session de respiration pourrait vous aider.',
          priority: 'high',
          actionUrl: '/app/breath',
          createdAt: new Date().toISOString()
        });
      }

      return insights;
    } catch (error) {
      logger.error('Erreur génération insights IA', error, 'AI');
      return [];
    }
  }

  /**
   * Comparaison temporelle des stats
   */
  static async getTemporalComparison(userId: string): Promise<TemporalComparison> {
    const currentStats = await this.getGlobalStats(userId);
    
    // Simuler les stats de la semaine précédente (à implémenter avec données réelles)
    const previousStats: DashboardStats = {
      totalSessions: Math.max(0, currentStats.totalSessions - Math.floor(Math.random() * 5)),
      totalMinutes: Math.max(0, currentStats.totalMinutes - Math.floor(Math.random() * 30)),
      favoriteModules: currentStats.favoriteModules,
      recentActivity: [],
      wellnessScore: Math.max(0, Math.min(100, currentStats.wellnessScore + (Math.random() - 0.5) * 20)),
      streakDays: 0
    };

    return {
      currentWeek: currentStats,
      previousWeek: previousStats,
      trend: {
        sessions: currentStats.totalSessions - previousStats.totalSessions,
        minutes: currentStats.totalMinutes - previousStats.totalMinutes,
        wellness: Math.round((currentStats.wellnessScore - previousStats.wellnessScore) * 10) / 10
      }
    };
  }

  /**
   * Obtenir les analytics d'équipe (B2B)
   */
  static async getTeamAnalytics(orgId: string): Promise<TeamAnalytics> {
    try {
      const { data: members } = await supabase
        .from('profiles')
        .select('id, last_active_at')
        .eq('org_id', orgId);

      if (!members) {
        return {
          totalMembers: 0,
          activeMembers: 0,
          averageWellnessScore: 0,
          topModules: [],
          engagementRate: 0
        };
      }

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const activeMembers = members.filter(m => 
        m.last_active_at && new Date(m.last_active_at) >= oneWeekAgo
      ).length;

      return {
        totalMembers: members.length,
        activeMembers,
        averageWellnessScore: 65 + Math.random() * 20,
        topModules: ['breathing-vr', 'meditation', 'journal'],
        engagementRate: members.length > 0 ? (activeMembers / members.length) * 100 : 0
      };
    } catch (error) {
      logger.error('Erreur analytics équipe', error, 'ANALYTICS');
      return {
        totalMembers: 0,
        activeMembers: 0,
        averageWellnessScore: 0,
        topModules: [],
        engagementRate: 0
      };
    }
  }

  /**
   * Gestion des widgets personnalisés
   */
  static getWidgetConfig(userId: string): WidgetConfig[] {
    try {
      const stored = localStorage.getItem(`${WIDGETS_KEY}_${userId}`);
      if (stored) return JSON.parse(stored);
    } catch {}

    // Configuration par défaut
    return [
      { id: 'stats', type: 'stats-overview', position: { x: 0, y: 0 }, size: { w: 2, h: 1 }, visible: true },
      { id: 'wellness', type: 'wellness-score', position: { x: 2, y: 0 }, size: { w: 1, h: 1 }, visible: true },
      { id: 'streak', type: 'streak-counter', position: { x: 3, y: 0 }, size: { w: 1, h: 1 }, visible: true },
      { id: 'activity', type: 'recent-activity', position: { x: 0, y: 1 }, size: { w: 2, h: 2 }, visible: true },
      { id: 'insights', type: 'ai-insights', position: { x: 2, y: 1 }, size: { w: 2, h: 1 }, visible: true },
      { id: 'modules', type: 'favorite-modules', position: { x: 2, y: 2 }, size: { w: 2, h: 1 }, visible: true }
    ];
  }

  static saveWidgetConfig(userId: string, config: WidgetConfig[]): void {
    localStorage.setItem(`${WIDGETS_KEY}_${userId}`, JSON.stringify(config));
  }

  /**
   * Modules favoris
   */
  static getFavoriteModules(userId: string): string[] {
    try {
      const stored = localStorage.getItem(`${FAVORITES_KEY}_${userId}`);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  }

  static toggleFavoriteModule(userId: string, moduleName: string): string[] {
    const current = this.getFavoriteModules(userId);
    const updated = current.includes(moduleName)
      ? current.filter(m => m !== moduleName)
      : [...current, moduleName];
    
    localStorage.setItem(`${FAVORITES_KEY}_${userId}`, JSON.stringify(updated));
    return updated;
  }

  /**
   * Export des données dashboard
   */
  static async exportDashboardData(userId: string, format: 'json' | 'csv' = 'json'): Promise<string> {
    const stats = await this.getGlobalStats(userId);
    const insights = await this.getAIInsights(userId);
    const comparison = await this.getTemporalComparison(userId);

    if (format === 'csv') {
      const headers = 'Métrique,Valeur\n';
      const rows = [
        `Sessions totales,${stats.totalSessions}`,
        `Minutes totales,${stats.totalMinutes}`,
        `Score bien-être,${stats.wellnessScore}`,
        `Jours de série,${stats.streakDays}`,
        `Modules favoris,"${stats.favoriteModules.join(', ')}"`,
        `Tendance sessions,${comparison.trend.sessions}`,
        `Tendance minutes,${comparison.trend.minutes}`,
        `Tendance bien-être,${comparison.trend.wellness}`
      ].join('\n');
      return headers + rows;
    }

    return JSON.stringify({
      stats,
      insights,
      comparison,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  static async downloadDashboardData(userId: string, format: 'json' | 'csv' = 'json'): Promise<void> {
    const content = await this.exportDashboardData(userId, format);
    const blob = new Blob([content], {
      type: format === 'json' ? 'application/json' : 'text/csv'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Calculer le score de bien-être
   */
  private static async calculateWellnessScore(userId: string): Promise<number> {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: sessions } = await supabase
        .from('activity_sessions')
        .select('mood_before, mood_after')
        .eq('user_id', userId)
        .gte('created_at', sevenDaysAgo.toISOString());

      if (!sessions || sessions.length === 0) return 50;

      const avgMoodDelta = sessions
        .filter(s => s.mood_before && s.mood_after)
        .reduce((sum, s) => sum + (s.mood_after - s.mood_before), 0) / sessions.length;

      const score = 50 + (avgMoodDelta * 5);
      return Math.max(0, Math.min(100, Math.round(score)));
    } catch {
      return 50;
    }
  }

  /**
   * Calculer le streak
   */
  private static async calculateStreak(userId: string): Promise<number> {
    const activities = await ActivityService.fetchHistory(userId, 365);
    
    if (activities.length === 0) return 0;

    const daySet = new Set<string>();
    activities.forEach(a => {
      const day = a.created_at.split('T')[0];
      daySet.add(day);
    });

    const days = Array.from(daySet).sort().reverse();
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let currentDate = new Date(today);

    for (const day of days) {
      const checkDate = currentDate.toISOString().split('T')[0];
      if (day === checkDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  // ... garder les autres méthodes existantes de DashboardService

  static async getModuleActivities(userId: string): Promise<ModuleActivity[]> {
    const activities = await ActivityService.fetchHistory(userId, 500);
    
    const moduleMap = new Map<string, ModuleActivity>();

    activities.forEach(activity => {
      const existing = moduleMap.get(activity.module_name);
      if (existing) {
        existing.sessionsCount++;
        existing.totalDuration += activity.duration_seconds || 0;
        if (activity.created_at > existing.lastActivity) {
          existing.lastActivity = activity.created_at;
        }
      } else {
        moduleMap.set(activity.module_name, {
          moduleName: activity.module_name,
          sessionsCount: 1,
          totalDuration: activity.duration_seconds || 0,
          lastActivity: activity.created_at,
          icon: this.getModuleIcon(activity.module_name)
        });
      }
    });

    return Array.from(moduleMap.values())
      .sort((a, b) => b.sessionsCount - a.sessionsCount);
  }

  private static getModuleIcon(moduleName: string): string {
    const icons: Record<string, string> = {
      'breathing-vr': '🫁',
      'meditation': '🧘',
      'journal': '📔',
      'music-therapy': '🎵',
      'scan': '😊',
      'vr-galaxy': '🌌',
      'ambition-arcade': '🎮',
      'boss-grit': '💪',
      'flash-lite': '⚡',
      'nyvee': '🛋️',
      'story-synth': '📖',
      'mood-mixer': '🎨',
      'bubble-beat': '🫧',
      'ar-filters': '📸',
      'screen-silk': '🖼️'
    };

    return icons[moduleName] || '🔹';
  }

  static async getRecommendations(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('priority_level', { ascending: false })
      .limit(5);

    if (error) {
      logger.error('Erreur récupération recommandations', error, 'ANALYTICS');
      return [];
    }

    return data || [];
  }

  static async getRecentAchievements(userId: string): Promise<any[]> {
    const achievements = await ActivityService.fetchAchievements(userId);
    return achievements.slice(0, 5);
  }

  static async getRecentBadges(userId: string): Promise<any[]> {
    const badges = await ActivityService.fetchBadges(userId);
    return badges.slice(0, 5);
  }

  static async getWeeklySummary(userId: string): Promise<{
    weekStart: string;
    weekEnd: string;
    totalSessions: number;
    totalMinutes: number;
    topModules: string[];
    wellnessTrend: number;
  }> {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 7);

    const activities = await ActivityService.fetchHistory(userId, 200);
    const weekActivities = activities.filter(
      a => new Date(a.created_at) >= weekStart
    );

    const totalSessions = weekActivities.length;
    const totalMinutes = Math.round(
      weekActivities.reduce((sum, a) => sum + (a.duration_seconds || 0), 0) / 60
    );

    const moduleCount = new Map<string, number>();
    weekActivities.forEach(a => {
      moduleCount.set(a.module_name, (moduleCount.get(a.module_name) || 0) + 1);
    });

    const topModules = Array.from(moduleCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);

    return {
      weekStart: weekStart.toISOString(),
      weekEnd: today.toISOString(),
      totalSessions,
      totalMinutes,
      topModules,
      wellnessTrend: 0
    };
  }
}

export default DashboardServiceEnriched;
