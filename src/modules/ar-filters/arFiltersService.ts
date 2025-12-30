/**
 * Service enrichi pour AR Filters (Filtres de réalité augmentée)
 */

import { supabase } from '@/integrations/supabase/client';
import type { ARFilterSession, ARFilterStats, FilterType } from './types';

const STORAGE_KEY = 'ar-filters-local-history';
const ACHIEVEMENTS_KEY = 'ar-filters-achievements';

// Liste des filtres valides
const VALID_FILTERS: FilterType[] = [
  'joy', 'calm', 'energy', 'creativity', 
  'confidence', 'serenity', 'playful', 'focused'
];

export interface ARFilterAchievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: string;
  progress: number;
  target: number;
  icon: string;
}

export interface ARFilterRecommendation {
  filterId: string;
  filterName: string;
  filterEmoji: string;
  reason: string;
  score: number;
}

const FILTER_NAMES: Record<string, string> = {
  joy: 'Joie',
  calm: 'Calme',
  energy: 'Énergie',
  serenity: 'Sérénité',
  creativity: 'Créativité',
  confidence: 'Confiance',
  playful: 'Ludique',
  focused: 'Focus',
};

const FILTER_EMOJIS: Record<string, string> = {
  joy: '😊',
  calm: '😌',
  energy: '⚡',
  serenity: '🧘',
  creativity: '🎨',
  confidence: '💪',
  playful: '🎉',
  focused: '🎯',
};

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
    
    // Check first session achievement
    const achievements = this.getAchievements();
    const firstSession = achievements.find(a => a.id === 'first_session');
    if (firstSession && !firstSession.unlockedAt) {
      firstSession.progress = 1;
      firstSession.unlockedAt = new Date().toISOString();
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
    }
    
    // Check explorer achievement
    this.checkExplorerAchievement(filterType);
    
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
    this.checkRegularUserAchievement();
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

    // Get achievements with updated progress
    const achievements = this.getAchievements();
    this.updateAchievementsProgress(achievements, totalSessions, totalPhotosTaken, filterCount);
    
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
   * Get local achievements with icons
   */
  private static getAchievements(): ARFilterAchievement[] {
    const stored = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (stored) return JSON.parse(stored);
    
    const defaultAchievements: ARFilterAchievement[] = [
      { id: 'first_session', name: 'Première expérience', description: 'Complétez votre première session AR', progress: 0, target: 1, icon: '🌟' },
      { id: 'photo_master', name: 'Photographe', description: 'Prenez 50 photos en AR', progress: 0, target: 50, icon: '📸' },
      { id: 'regular_user', name: 'Habitué', description: 'Complétez 10 sessions', progress: 0, target: 10, icon: '🎖️' },
      { id: 'marathon', name: 'Marathon AR', description: 'Cumulez 1 heure en AR', progress: 0, target: 3600, icon: '⏱️' },
      { id: 'explorer', name: 'Explorateur', description: 'Essayez les 8 filtres différents', progress: 0, target: 8, icon: '🧭' },
    ];
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(defaultAchievements));
    return defaultAchievements;
  }

  /**
   * Update achievements progress based on current data
   */
  private static updateAchievementsProgress(
    achievements: ARFilterAchievement[], 
    totalSessions: number, 
    totalPhotos: number,
    filterCount: Map<string, number>
  ): void {
    const regularUser = achievements.find(a => a.id === 'regular_user');
    if (regularUser) {
      regularUser.progress = Math.min(totalSessions, regularUser.target);
      if (regularUser.progress >= regularUser.target && !regularUser.unlockedAt) {
        regularUser.unlockedAt = new Date().toISOString();
      }
    }

    const photoMaster = achievements.find(a => a.id === 'photo_master');
    if (photoMaster) {
      photoMaster.progress = Math.min(totalPhotos, photoMaster.target);
      if (photoMaster.progress >= photoMaster.target && !photoMaster.unlockedAt) {
        photoMaster.unlockedAt = new Date().toISOString();
      }
    }

    const explorer = achievements.find(a => a.id === 'explorer');
    if (explorer) {
      const uniqueFilters = filterCount.size;
      explorer.progress = Math.min(uniqueFilters, explorer.target);
      if (explorer.progress >= explorer.target && !explorer.unlockedAt) {
        explorer.unlockedAt = new Date().toISOString();
      }
    }

    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
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
   * Check explorer achievement
   */
  private static checkExplorerAchievement(filterType: string): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    const stats = stored ? JSON.parse(stored) : { filters: {} };
    const uniqueFilters = Object.keys(stats.filters).filter(f => VALID_FILTERS.includes(f as FilterType)).length;
    
    const achievements = this.getAchievements();
    const explorer = achievements.find(a => a.id === 'explorer');
    if (explorer) {
      explorer.progress = uniqueFilters;
      if (explorer.progress >= explorer.target && !explorer.unlockedAt) {
        explorer.unlockedAt = new Date().toISOString();
      }
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
    }
  }

  /**
   * Check regular user achievement
   */
  private static checkRegularUserAchievement(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    const stats = stored ? JSON.parse(stored) : { sessions: 0 };
    
    const achievements = this.getAchievements();
    const regularUser = achievements.find(a => a.id === 'regular_user');
    if (regularUser) {
      regularUser.progress = Math.min(stats.sessions, regularUser.target);
      if (regularUser.progress >= regularUser.target && !regularUser.unlockedAt) {
        regularUser.unlockedAt = new Date().toISOString();
      }
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
    }
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
   * Generate personalized recommendations with correct filter names
   */
  private static generateRecommendations(
    sessions: ARFilterSession[], 
    filterCount: Map<string, number>
  ): ARFilterRecommendation[] {
    const recommendations: ARFilterRecommendation[] = [];
    
    // Recommend filters not tried yet
    VALID_FILTERS.forEach(filter => {
      if (!filterCount.has(filter)) {
        recommendations.push({
          filterId: filter,
          filterName: FILTER_NAMES[filter] || filter,
          filterEmoji: FILTER_EMOJIS[filter] || '🎭',
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
          filterName: FILTER_NAMES[filter] || filter,
          filterEmoji: FILTER_EMOJIS[filter] || '🎭',
          reason: 'Impact positif sur votre humeur',
          score: 0.85
        });
      }
    });

    // Sort by score and limit
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }
}
