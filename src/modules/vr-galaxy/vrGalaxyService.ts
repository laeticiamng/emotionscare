/**
 * Service enrichi pour VR Galaxy (Nébuleuse VR)
 * Version simplifiée avec persistance locale
 */

import { supabase } from '@/integrations/supabase/client';
import type { VRNebulaSession, BiometricMetrics } from './types';

const STORAGE_KEY = 'vr-galaxy-local-data';
const ACHIEVEMENTS_KEY = 'vr-galaxy-achievements';
const FAVORITES_KEY = 'vr-galaxy-favorites';

export interface VRGalaxyAchievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface VRGalaxyLocalStats {
  totalSessions: number;
  totalDuration: number;
  galaxiesVisited: string[];
  discoveries: number;
  avgCoherence: number;
  streak: number;
  weeklyTrend: number[];
  favoriteGalaxy: string | null;
  lastSession: string | null;
  achievements: VRGalaxyAchievement[];
  personalBests: {
    longestSession: number;
    highestCoherence: number;
    mostDiscoveries: number;
  };
}

export class VRGalaxyService {
  /**
   * Créer une session VR Nebula
   */
  static async createSession(userId: string, sessionId: string): Promise<VRNebulaSession> {
    const { data, error } = await supabase
      .from('vr_nebula_sessions')
      .insert({
        user_id: userId,
        session_id: sessionId,
        duration_seconds: 0
      })
      .select()
      .single();

    if (error) throw error;
    
    // Update local stats
    this.updateLocalStreak();
    
    return data;
  }

  /**
   * Mettre à jour les métriques biométriques
   */
  static async updateBiometrics(
    sessionId: string,
    metrics: BiometricMetrics
  ): Promise<void> {
    const { error } = await supabase
      .from('vr_nebula_sessions')
      .update(metrics)
      .eq('session_id', sessionId);

    if (error) throw error;
  }

  /**
   * Compléter une session
   */
  static async completeSession(
    sessionId: string,
    durationSeconds: number,
    galaxyName?: string,
    discoveries?: number,
    coherenceScore?: number
  ): Promise<void> {
    const { error } = await supabase
      .from('vr_nebula_sessions')
      .update({
        duration_seconds: durationSeconds,
        completed_at: new Date().toISOString()
      })
      .eq('session_id', sessionId);

    if (error) throw error;

    // Update local stats
    this.saveLocalSession({
      sessionId,
      duration: durationSeconds,
      galaxy: galaxyName || 'Unknown',
      discoveries: discoveries || 0,
      coherence: coherenceScore || 0,
      date: new Date().toISOString()
    });
  }

  /**
   * Récupérer l'historique
   */
  static async fetchHistory(userId: string, limit: number = 20): Promise<VRNebulaSession[]> {
    const { data, error } = await supabase
      .from('vr_nebula_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Obtenir les statistiques locales enrichies
   */
  static getLocalStats(): VRGalaxyLocalStats {
    const data = this.getLocalData();
    const achievements = this.getAchievements();
    const streak = this.getStreak();

    // Calculate weekly trend
    const weeklyTrend: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toDateString();
      const count = data.sessions.filter(s => 
        new Date(s.date).toDateString() === dayStr
      ).length;
      weeklyTrend.push(count);
    }

    // Calculate averages and favorites
    const galaxyCounts: Record<string, number> = {};
    data.sessions.forEach(s => {
      galaxyCounts[s.galaxy] = (galaxyCounts[s.galaxy] || 0) + 1;
    });
    const favoriteGalaxy = Object.entries(galaxyCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    const avgCoherence = data.sessions.length > 0
      ? data.sessions.reduce((sum, s) => sum + s.coherence, 0) / data.sessions.length
      : 0;

    return {
      totalSessions: data.sessions.length,
      totalDuration: data.sessions.reduce((sum, s) => sum + s.duration, 0),
      galaxiesVisited: [...new Set(data.sessions.map(s => s.galaxy))],
      discoveries: data.sessions.reduce((sum, s) => sum + s.discoveries, 0),
      avgCoherence: Math.round(avgCoherence),
      streak,
      weeklyTrend,
      favoriteGalaxy,
      lastSession: data.sessions[data.sessions.length - 1]?.date || null,
      achievements,
      personalBests: data.personalBests
    };
  }

  /**
   * Ajouter une galaxie aux favoris
   */
  static toggleFavoriteGalaxy(galaxyName: string): boolean {
    const stored = localStorage.getItem(FAVORITES_KEY);
    const favorites: string[] = stored ? JSON.parse(stored) : [];
    
    const index = favorites.indexOf(galaxyName);
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(galaxyName);
    }
    
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return index === -1;
  }

  /**
   * Obtenir les galaxies favorites
   */
  static getFavoriteGalaxies(): string[] {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Obtenir des recommandations de galaxies
   */
  static getGalaxyRecommendations(): { galaxy: string; reason: string; score: number }[] {
    const data = this.getLocalData();
    const recommendations = [];

    // Time-based recommendation
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) {
      recommendations.push({
        galaxy: 'Aurore Cosmique',
        reason: 'Parfaite pour l\'éveil matinal',
        score: 0.9
      });
    } else if (hour >= 20) {
      recommendations.push({
        galaxy: 'Nébuleuse Paisible',
        reason: 'Idéale pour la relaxation du soir',
        score: 0.9
      });
    }

    // History-based recommendations
    if (data.sessions.length > 0) {
      const lastSession = data.sessions[data.sessions.length - 1];
      if (lastSession.coherence < 50) {
        recommendations.push({
          galaxy: 'Jardin Stellaire',
          reason: 'Pour améliorer votre cohérence',
          score: 0.85
        });
      }
    }

    // Exploration-based
    const visitedGalaxies = new Set(data.sessions.map(s => s.galaxy));
    const allGalaxies = ['Nébuleuse Paisible', 'Aurore Cosmique', 'Jardin Stellaire', 'Voie Lactée Méditative', 'Espace Infini'];
    const unexplored = allGalaxies.filter(g => !visitedGalaxies.has(g));
    unexplored.forEach(galaxy => {
      recommendations.push({
        galaxy,
        reason: 'Nouvelle galaxie à découvrir',
        score: 0.8
      });
    });

    return recommendations.slice(0, 3);
  }

  // Private helper methods
  private static getLocalData(): {
    sessions: { sessionId: string; duration: number; galaxy: string; discoveries: number; coherence: number; date: string }[];
    personalBests: { longestSession: number; highestCoherence: number; mostDiscoveries: number };
  } {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    return { 
      sessions: [], 
      personalBests: { longestSession: 0, highestCoherence: 0, mostDiscoveries: 0 }
    };
  }

  private static saveLocalSession(session: { sessionId: string; duration: number; galaxy: string; discoveries: number; coherence: number; date: string }): void {
    const data = this.getLocalData();
    data.sessions.push(session);
    
    // Update personal bests
    if (session.duration > data.personalBests.longestSession) {
      data.personalBests.longestSession = session.duration;
    }
    if (session.coherence > data.personalBests.highestCoherence) {
      data.personalBests.highestCoherence = session.coherence;
    }
    if (session.discoveries > data.personalBests.mostDiscoveries) {
      data.personalBests.mostDiscoveries = session.discoveries;
    }

    // Keep last 100 sessions
    if (data.sessions.length > 100) {
      data.sessions = data.sessions.slice(-100);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    // Check achievements
    this.checkAchievements(data);
  }

  private static updateLocalStreak(): void {
    const stored = localStorage.getItem('vr-galaxy-streak');
    const data = stored ? JSON.parse(stored) : { streak: 0, lastDate: null };
    
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (data.lastDate === today) return;
    
    if (data.lastDate === yesterday) {
      data.streak++;
    } else {
      data.streak = 1;
    }
    
    data.lastDate = today;
    localStorage.setItem('vr-galaxy-streak', JSON.stringify(data));
  }

  private static getStreak(): number {
    const stored = localStorage.getItem('vr-galaxy-streak');
    if (!stored) return 0;
    const data = JSON.parse(stored);
    
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (data.lastDate === today || data.lastDate === yesterday) {
      return data.streak;
    }
    return 0;
  }

  private static getAchievements(): VRGalaxyAchievement[] {
    const stored = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (stored) return JSON.parse(stored);
    
    const defaults: VRGalaxyAchievement[] = [
      { id: 'first_voyage', name: 'Premier Voyage', description: 'Complétez votre première exploration', emoji: '🚀', unlocked: false, progress: 0, target: 1, rarity: 'common' },
      { id: 'explorer_5', name: 'Explorateur', description: '5 sessions complétées', emoji: '🌟', unlocked: false, progress: 0, target: 5, rarity: 'common' },
      { id: 'galaxy_hopper', name: 'Voyageur Galactique', description: 'Visitez 3 galaxies différentes', emoji: '🌌', unlocked: false, progress: 0, target: 3, rarity: 'rare' },
      { id: 'coherence_master', name: 'Maître de la Cohérence', description: 'Atteignez 80% de cohérence', emoji: '💫', unlocked: false, progress: 0, target: 80, rarity: 'epic' },
      { id: 'time_traveler', name: 'Voyageur Temporel', description: 'Cumulez 1 heure en VR', emoji: '⏱️', unlocked: false, progress: 0, target: 3600, rarity: 'rare' },
      { id: 'streak_7', name: 'Dédié', description: '7 jours consécutifs', emoji: '🔥', unlocked: false, progress: 0, target: 7, rarity: 'epic' },
      { id: 'discovery_50', name: 'Découvreur Cosmique', description: '50 découvertes', emoji: '🔭', unlocked: false, progress: 0, target: 50, rarity: 'legendary' },
    ];
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(defaults));
    return defaults;
  }

  private static checkAchievements(data: ReturnType<typeof VRGalaxyService.getLocalData>): void {
    const achievements = this.getAchievements();
    const streak = this.getStreak();
    const uniqueGalaxies = new Set(data.sessions.map(s => s.galaxy)).size;
    const totalDuration = data.sessions.reduce((sum, s) => sum + s.duration, 0);
    const totalDiscoveries = data.sessions.reduce((sum, s) => sum + s.discoveries, 0);
    
    achievements.forEach(a => {
      switch (a.id) {
        case 'first_voyage':
          a.progress = Math.min(data.sessions.length, 1);
          break;
        case 'explorer_5':
          a.progress = Math.min(data.sessions.length, 5);
          break;
        case 'galaxy_hopper':
          a.progress = Math.min(uniqueGalaxies, 3);
          break;
        case 'coherence_master':
          a.progress = Math.min(data.personalBests.highestCoherence, 80);
          break;
        case 'time_traveler':
          a.progress = Math.min(totalDuration, 3600);
          break;
        case 'streak_7':
          a.progress = Math.min(streak, 7);
          break;
        case 'discovery_50':
          a.progress = Math.min(totalDiscoveries, 50);
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
