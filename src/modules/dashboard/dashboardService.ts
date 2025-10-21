/**
 * Service Dashboard - Agrégation de toutes les données utilisateur
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { BreathingVRService } from '@/modules/breathing-vr/breathingVRService';
import { meditationService } from '@/modules/meditation/meditationService';
import { ActivityService } from '@/modules/activity/activityService';
import { EmotionalScanService } from '@/modules/emotional-scan/emotionalScanService';
import { MusicTherapyService } from '@/modules/music-therapy/musicTherapyService';
import { FlashLiteService } from '@/modules/flash-lite/flashLiteService';
import { VRGalaxyService } from '@/modules/vr-galaxy/vrGalaxyService';
import { BossGritService } from '@/modules/boss-grit/bossGritService';
import { CommunityService } from '@/modules/community/communityService';
import { nyveeService } from '@/modules/nyvee/nyveeService';
import * as storySynthService from '@/modules/story-synth/storySynthService';
import { MoodMixerService } from '@/modules/mood-mixer/moodMixerService';
import * as bubbleBeatService from '@/modules/bubble-beat/bubbleBeatService';
import { ARFiltersService } from '@/modules/ar-filters/arFiltersService';
import { ScreenSilkService } from '@/modules/screen-silk/screenSilkService';

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

export class DashboardService {
  /**
   * Obtenir les statistiques globales du dashboard
   */
  static async getGlobalStats(userId: string): Promise<DashboardStats> {
    try {
      // Récupérer toutes les activités
      const activities = await ActivityService.fetchActivities(userId, 1000);
      
      // Calculer les stats globales
      const totalSessions = activities.length;
      const totalMinutes = Math.round(
        activities.reduce((sum, a) => sum + (a.duration_seconds || 0), 0) / 60
      );

      // Modules favoris
      const moduleCount = new Map<string, number>();
      activities.forEach(a => {
        moduleCount.set(a.module_name, (moduleCount.get(a.module_name) || 0) + 1);
      });
      
      const favoriteModules = Array.from(moduleCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name]) => name);

      // Activités récentes
      const recentActivity = activities.slice(0, 10);

      // Score de bien-être (calculé sur les derniers 7 jours)
      const wellnessScore = await this.calculateWellnessScore(userId);

      // Streak (jours consécutifs)
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
   * Obtenir l'activité par module
   */
  static async getModuleActivities(userId: string): Promise<ModuleActivity[]> {
    const activities = await ActivityService.fetchActivities(userId, 500);
    
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

  /**
   * Calculer le score de bien-être
   */
  private static async calculateWellnessScore(userId: string): Promise<number> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    try {
      // Récupérer les scans émotionnels récents
      const emotionScans = await EmotionalScanService.fetchHistory(userId, 50);
      const recentScans = emotionScans.filter(
        s => new Date(s.created_at) >= sevenDaysAgo
      );

      if (recentScans.length === 0) return 50; // Score neutre

      // Calculer la moyenne des scores de confiance
      const avgConfidence = recentScans.reduce(
        (sum, s) => sum + s.confidence_score, 0
      ) / recentScans.length;

      // Score entre 0-100
      return Math.round(avgConfidence * 100);
    } catch {
      return 50;
    }
  }

  /**
   * Calculer le streak (jours consécutifs d'activité)
   */
  private static async calculateStreak(userId: string): Promise<number> {
    const activities = await ActivityService.fetchActivities(userId, 365);
    
    if (activities.length === 0) return 0;

    // Grouper par jour
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

  /**
   * Obtenir les recommandations personnalisées
   */
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

  /**
   * Obtenir les achievements récents
   */
  static async getRecentAchievements(userId: string): Promise<any[]> {
    const achievements = await ActivityService.fetchAchievements(userId);
    return achievements.slice(0, 5);
  }

  /**
   * Obtenir les badges récents
   */
  static async getRecentBadges(userId: string): Promise<any[]> {
    const badges = await ActivityService.fetchBadges(userId);
    return badges.slice(0, 5);
  }

  /**
   * Obtenir l'icône du module
   */
  private static getModuleIcon(moduleName: string): string {
    const icons: Record<string, string> = {
      'breathing-vr': '🫁',
      'meditation': '🧘',
      'journal': '📔',
      'music-therapy': '🎵',
      'emotional-scan': '😊',
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

  /**
   * Obtenir un résumé hebdomadaire
   */
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

    const activities = await ActivityService.fetchActivities(userId, 200);
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
      wellnessTrend: 0 // À calculer avec l'historique
    };
  }
}
