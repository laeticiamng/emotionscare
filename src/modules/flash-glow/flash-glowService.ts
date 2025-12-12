/**
 * Service enrichi pour Flash Glow (Luminothérapie)
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface FlashGlowSession {
  duration_s: number;
  label: 'gain' | 'léger' | 'incertain';
  glow_type?: string;
  intensity?: number;
  result?: 'completed' | 'interrupted';
  metadata?: Record<string, any>;
}

export interface FlashGlowResponse {
  success: boolean;
  message: string;
  next_session_in?: string;
  session_id?: string | null;
  activity_session_id?: string | null;
  mood_delta?: number | null;
  satisfaction_score?: number | null;
}

export interface FlashGlowStats {
  total_sessions: number;
  avg_duration: number;
  recent_sessions: any[];
  streak: number;
  totalPoints: number;
  weeklyTrend: number[];
  achievements: FlashGlowAchievement[];
  bestSession: { duration: number; score: number; date: string } | null;
}

export interface FlashGlowAchievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
}

const STORAGE_KEY = 'flash-glow-local-data';
const ACHIEVEMENTS_KEY = 'flash-glow-achievements';
const STREAK_KEY = 'flash-glow-streak';

class FlashGlowService {
  /**
   * Démarrer une session Flash Glow
   */
  async startSession(config: {
    glowType: string;
    intensity: number;
    duration: number;
  }): Promise<{ sessionId: string }> {
    logger.info('Flash Glow session started', config, 'MUSIC');
    
    const sessionId = `fg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Update streak
    this.updateStreak();
    
    return { sessionId };
  }

  /**
   * Terminer une session et envoyer les métriques
   */
  async endSession(sessionData: FlashGlowSession): Promise<FlashGlowResponse> {
    try {
      // Save to local storage first
      this.saveLocalSession(sessionData);
      
      const { data, error } = await supabase.functions.invoke('flash-glow-metrics', {
        body: sessionData
      });

      if (error) {
        const message = error.message || 'Erreur lors de l\'envoi des métriques';
        if (typeof error.status === 'number' && error.status === 401) {
          throw new Error('Authentification requise pour enregistrer la session Flash Glow');
        }
        throw new Error(message);
      }

      // Check achievements
      this.checkAchievements(sessionData);

      return data as FlashGlowResponse;
    } catch (error) {
      logger.error('Flash Glow Service Error', error as Error, 'MUSIC');
      throw error;
    }
  }

  /**
   * Récupérer les statistiques utilisateur enrichies
   */
  async getStats(): Promise<FlashGlowStats> {
    try {
      const { data, error } = await supabase.functions.invoke('flash-glow-metrics', {
        method: 'GET'
      });

      const localData = this.getLocalData();
      const achievements = this.getAchievements();
      const streak = this.getStreak();

      if (error) {
        // Return local stats if API fails
        return {
          total_sessions: localData.sessions.length,
          avg_duration: localData.sessions.length > 0 
            ? localData.sessions.reduce((sum, s) => sum + s.duration_s, 0) / localData.sessions.length 
            : 0,
          recent_sessions: localData.sessions.slice(-10),
          streak,
          totalPoints: localData.totalPoints,
          weeklyTrend: this.calculateWeeklyTrend(localData.sessions),
          achievements,
          bestSession: localData.bestSession
        };
      }

      return {
        ...data,
        streak,
        totalPoints: localData.totalPoints,
        weeklyTrend: this.calculateWeeklyTrend(localData.sessions),
        achievements,
        bestSession: localData.bestSession
      };
    } catch (error) {
      logger.error('Flash Glow Stats Error', error as Error, 'MUSIC');
      const localData = this.getLocalData();
      return {
        total_sessions: localData.sessions.length,
        avg_duration: 0,
        recent_sessions: localData.sessions.slice(-10),
        streak: this.getStreak(),
        totalPoints: localData.totalPoints,
        weeklyTrend: this.calculateWeeklyTrend(localData.sessions),
        achievements: this.getAchievements(),
        bestSession: localData.bestSession
      };
    }
  }

  /**
   * Trigger vibration si supporté
   */
  triggerHapticFeedback(pattern: number[] = [100, 50, 100]) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  /**
   * Calculer le score basé sur la performance
   */
  calculateScore(duration: number, intensity: number, completed: boolean): number {
    let score = Math.floor(duration * 2);
    
    if (intensity > 80) score += 20;
    if (intensity > 60) score += 10;
    if (completed) score += 50;
    if (duration >= 90) score += 30;
    if (duration >= 60) score += 15;
    
    // Streak bonus
    const streak = this.getStreak();
    if (streak > 7) score += 50;
    else if (streak > 3) score += 25;
    else if (streak > 0) score += 10;
    
    return Math.min(score, 500);
  }

  /**
   * Obtenir une recommandation basée sur la performance
   */
  getRecommendation(label: FlashGlowSession['label'], streak: number): string {
    const recommendations = {
      'gain': [
        'Excellent ! Votre énergie rayonne ✨',
        'Incroyable performance ! Vous brillez 🌟',
        'Votre aura est éclatante aujourd\'hui 💫',
        'Performance optimale atteinte ! 🎯'
      ],
      'léger': [
        'Progrès en douceur, continuez 🌱',
        'Chaque petit pas compte 🌟',
        'Votre lumière grandit doucement ✨',
        'Belle régularité, gardez le cap 💪'
      ],
      'incertain': [
        'Chaque glow compte, félicitations 💫',
        'Votre persévérance paiera 🌟',
        'La magie opère même en douceur ✨',
        'Demain sera meilleur, reposez-vous 🌙'
      ]
    };

    const messages = recommendations[label];
    const baseMessage = messages[Math.floor(Math.random() * messages.length)];
    
    if (streak > 7) {
      return `${baseMessage}\n🔥 Incroyable streak de ${streak} jours !`;
    } else if (streak > 3) {
      return `${baseMessage}\n🔥 Streak de ${streak} jours !`;
    }
    
    return baseMessage;
  }

  /**
   * Get personalized glow recommendations
   */
  getGlowRecommendations(): { type: string; reason: string; intensity: number }[] {
    const localData = this.getLocalData();
    const hour = new Date().getHours();
    const recommendations = [];

    // Time-based recommendations
    if (hour >= 6 && hour < 10) {
      recommendations.push({
        type: 'energize',
        reason: 'Boost matinal recommandé',
        intensity: 80
      });
    } else if (hour >= 20) {
      recommendations.push({
        type: 'relax',
        reason: 'Relaxation du soir',
        intensity: 40
      });
    }

    // History-based recommendations
    if (localData.sessions.length > 0) {
      const lastSession = localData.sessions[localData.sessions.length - 1];
      if (lastSession.label === 'incertain') {
        recommendations.push({
          type: 'gentle',
          reason: 'Session douce après résultat mitigé',
          intensity: 50
        });
      }
    }

    return recommendations;
  }

  // Private methods
  private saveLocalSession(session: FlashGlowSession): void {
    const data = this.getLocalData();
    const score = this.calculateScore(session.duration_s, session.intensity || 50, session.result === 'completed');
    
    data.sessions.push({
      ...session,
      date: new Date().toISOString(),
      score
    });
    data.totalPoints += score;
    
    if (!data.bestSession || score > data.bestSession.score) {
      data.bestSession = { duration: session.duration_s, score, date: new Date().toISOString() };
    }
    
    // Keep last 100 sessions
    if (data.sessions.length > 100) {
      data.sessions = data.sessions.slice(-100);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  private getLocalData(): { 
    sessions: (FlashGlowSession & { date: string; score: number })[];
    totalPoints: number;
    bestSession: { duration: number; score: number; date: string } | null;
  } {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    return { sessions: [], totalPoints: 0, bestSession: null };
  }

  private updateStreak(): void {
    const stored = localStorage.getItem(STREAK_KEY);
    const data = stored ? JSON.parse(stored) : { streak: 0, lastDate: null };
    
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (data.lastDate === today) {
      // Already logged today
      return;
    } else if (data.lastDate === yesterday) {
      // Consecutive day
      data.streak++;
    } else {
      // Streak broken
      data.streak = 1;
    }
    
    data.lastDate = today;
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  }

  private getStreak(): number {
    const stored = localStorage.getItem(STREAK_KEY);
    if (!stored) return 0;
    const data = JSON.parse(stored);
    
    // Check if streak is still valid
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (data.lastDate === today || data.lastDate === yesterday) {
      return data.streak;
    }
    return 0;
  }

  private calculateWeeklyTrend(sessions: any[]): number[] {
    const trend: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toDateString();
      const count = sessions.filter(s => 
        new Date(s.date).toDateString() === dayStr
      ).length;
      trend.push(count);
    }
    return trend;
  }

  private getAchievements(): FlashGlowAchievement[] {
    const stored = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (stored) return JSON.parse(stored);
    
    const defaults: FlashGlowAchievement[] = [
      { id: 'first_glow', name: 'Premier éclat', description: 'Complétez votre première session', emoji: '✨', unlocked: false, progress: 0, target: 1 },
      { id: 'streak_3', name: 'Régulier', description: '3 jours consécutifs', emoji: '🔥', unlocked: false, progress: 0, target: 3 },
      { id: 'streak_7', name: 'Dévoué', description: '7 jours consécutifs', emoji: '⭐', unlocked: false, progress: 0, target: 7 },
      { id: 'points_1000', name: 'Lumineux', description: 'Cumulez 1000 points', emoji: '💫', unlocked: false, progress: 0, target: 1000 },
      { id: 'sessions_25', name: 'Expert', description: '25 sessions complétées', emoji: '🏆', unlocked: false, progress: 0, target: 25 },
    ];
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(defaults));
    return defaults;
  }

  private checkAchievements(session: FlashGlowSession): void {
    const achievements = this.getAchievements();
    const localData = this.getLocalData();
    const streak = this.getStreak();
    
    achievements.forEach(a => {
      switch (a.id) {
        case 'first_glow':
          a.progress = Math.min(1, localData.sessions.length);
          break;
        case 'streak_3':
        case 'streak_7':
          a.progress = Math.min(streak, a.target);
          break;
        case 'points_1000':
          a.progress = Math.min(localData.totalPoints, a.target);
          break;
        case 'sessions_25':
          a.progress = Math.min(localData.sessions.length, a.target);
          break;
      }
      
      if (a.progress >= a.target && !a.unlocked) {
        a.unlocked = true;
        a.unlockedAt = new Date().toISOString();
      }
    });
    
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  }
}

export const flashGlowService = new FlashGlowService();
