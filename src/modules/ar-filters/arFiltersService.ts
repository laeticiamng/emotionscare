/**
 * Service enrichi pour AR Filters (Filtres de réalité augmentée)
 */

import { supabase } from '@/integrations/supabase/client';
import type { ARFilterSession, ARFilterStats } from './types';

const STORAGE_KEY = 'ar-filters-local-history';
const ACHIEVEMENTS_KEY = 'ar-filters-achievements';

export interface ARFilterAchievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: string;
  progress: number;
  target: number;
}

export interface ARFilterRecommendation {
  filterId: string;
  reason: string;
  score: number;
}

export class ARFiltersService {
  /**
   * Créer une session AR Filter
   */
  static async createSession(
    userId: string,
    filterType: string
  ): Promise<ARFilterSession> {
    const { data, error } = await supabase
      .from('ar_filter_sessions')
      .insert({
        user_id: userId,
        filter_type: filterType,
        duration_seconds: 0,
        photos_taken: 0
      })
      .select()
      .single();

    if (error) throw error;
    
    // Update local stats
    this.updateLocalStats(filterType, 'start');
    
    return data;
  }

  /**
   * Incrémenter le nombre de photos prises
   */
  static async incrementPhotosTaken(sessionId: string): Promise<void> {
    const { data: session } = await supabase
      .from('ar_filter_sessions')
      .select('photos_taken')
      .eq('id', sessionId)
      .single();

    if (session) {
      const newCount = (session.photos_taken || 0) + 1;
      const { error } = await supabase
        .from('ar_filter_sessions')
        .update({ photos_taken: newCount })
        .eq('id', sessionId);

      if (error) throw error;
      
      // Check photo achievements
      this.checkPhotoAchievements(newCount);
    }
  }

  /**
   * Compléter une session
   */
  static async completeSession(
    sessionId: string,
    durationSeconds: number,
    moodImpact?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('ar_filter_sessions')
      .update({
        duration_seconds: durationSeconds,
        mood_impact: moodImpact,
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;
    
    // Update local stats and check achievements
    this.updateLocalStats('', 'complete', durationSeconds);
    this.checkDurationAchievements(durationSeconds);
  }

  /**
   * Récupérer l'historique
   */
  static async fetchHistory(userId: string, limit: number = 20): Promise<ARFilterSession[]> {
    const { data, error } = await supabase
      .from('ar_filter_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Obtenir des statistiques enrichies
   */
  static async getStats(userId: string): Promise<ARFilterStats & { 
    weeklyTrend: number[];
    achievements: ARFilterAchievement[];
    recommendations: ARFilterRecommendation[];
  }> {
    const sessions = await this.fetchHistory(userId, 100);

    const totalSessions = sessions.length;
    const totalPhotosTaken = sessions.reduce((sum, s) => sum + (s.photos_taken || 0), 0);
    
    const filterCount = new Map<string, number>();
    sessions.forEach(s => {
      filterCount.set(s.filter_type, (filterCount.get(s.filter_type) || 0) + 1);
    });

    const favoriteFilter = Array.from(filterCount.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';

    const completedSessions = sessions.filter(s => s.completed_at);
    const averageDuration = completedSessions.length > 0
      ? completedSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / completedSessions.length
      : 0;

    // Calculate weekly trend (last 7 days)
    const weeklyTrend: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toDateString();
      const count = sessions.filter(s => 
        new Date(s.created_at).toDateString() === dayStr
      ).length;
      weeklyTrend.push(count);
    }

    // Get achievements
    const achievements = this.getAchievements();
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(sessions, filterCount);

    return {
      totalSessions,
      totalPhotosTaken,
      favoriteFilter,
      averageDuration,
      weeklyTrend,
      achievements,
      recommendations
    };
  }

  /**
   * Get local achievements
   */
  private static getAchievements(): ARFilterAchievement[] {
    const stored = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (stored) return JSON.parse(stored);
    
    const defaultAchievements: ARFilterAchievement[] = [
      { id: 'first_session', name: 'Première expérience', description: 'Complétez votre première session AR', progress: 0, target: 1 },
      { id: 'photo_master', name: 'Photographe', description: 'Prenez 50 photos en AR', progress: 0, target: 50 },
      { id: 'regular_user', name: 'Habitué', description: 'Complétez 10 sessions', progress: 0, target: 10 },
      { id: 'marathon', name: 'Marathon AR', description: 'Cumulez 1 heure en AR', progress: 0, target: 3600 },
      { id: 'explorer', name: 'Explorateur', description: 'Essayez tous les filtres', progress: 0, target: 4 },
    ];
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(defaultAchievements));
    return defaultAchievements;
  }

  /**
   * Update local stats
   */
  private static updateLocalStats(filterType: string, action: 'start' | 'complete', duration?: number): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    const stats = stored ? JSON.parse(stored) : { sessions: 0, totalDuration: 0, filters: {} };
    
    if (action === 'start') {
      stats.sessions++;
      stats.filters[filterType] = (stats.filters[filterType] || 0) + 1;
    }
    if (action === 'complete' && duration) {
      stats.totalDuration += duration;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }

  /**
   * Check and update photo achievements
   */
  private static checkPhotoAchievements(photoCount: number): void {
    const achievements = this.getAchievements();
    const photoAchievement = achievements.find(a => a.id === 'photo_master');
    if (photoAchievement) {
      photoAchievement.progress = Math.min(photoCount, photoAchievement.target);
      if (photoAchievement.progress >= photoAchievement.target && !photoAchievement.unlockedAt) {
        photoAchievement.unlockedAt = new Date().toISOString();
      }
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
    }
  }

  /**
   * Check and update duration achievements
   */
  private static checkDurationAchievements(duration: number): void {
    const achievements = this.getAchievements();
    const marathonAchievement = achievements.find(a => a.id === 'marathon');
    if (marathonAchievement) {
      marathonAchievement.progress = Math.min(marathonAchievement.progress + duration, marathonAchievement.target);
      if (marathonAchievement.progress >= marathonAchievement.target && !marathonAchievement.unlockedAt) {
        marathonAchievement.unlockedAt = new Date().toISOString();
      }
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
    }
  }

  /**
   * Generate personalized recommendations
   */
  private static generateRecommendations(
    sessions: ARFilterSession[], 
    filterCount: Map<string, number>
  ): ARFilterRecommendation[] {
    const allFilters = ['aura', 'breathing', 'bubbles', 'music'];
    const recommendations: ARFilterRecommendation[] = [];
    
    // Recommend filters not tried yet
    allFilters.forEach(filter => {
      if (!filterCount.has(filter)) {
        recommendations.push({
          filterId: filter,
          reason: 'Nouveau filtre à découvrir',
          score: 0.9
        });
      }
    });

    // Recommend based on mood impact
    const positiveImpactFilters = sessions
      .filter(s => s.mood_impact === 'positive')
      .map(s => s.filter_type);
    
    const uniquePositive = [...new Set(positiveImpactFilters)];
    uniquePositive.forEach(filter => {
      if (!recommendations.find(r => r.filterId === filter)) {
        recommendations.push({
          filterId: filter,
          reason: 'Impact positif sur votre humeur',
          score: 0.85
        });
      }
    });

    return recommendations.slice(0, 3);
  }
}
