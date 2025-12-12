/**
 * Service unifié pour Nyvee - Respiration guidée avec bulle interactive et personnalisation
 * Consolide nyveeService.ts + nyveeServiceEnriched.ts
 */

import { supabase } from '@/integrations/supabase/client';
import { Sentry } from '@/lib/errors/sentry-compat';
import type {
  CreateNyveeSession,
  CompleteNyveeSession,
  NyveeSession,
  NyveeStats,
  BreathingIntensity,
  BadgeType,
} from './types';

// ============================================================================
// TYPES ENRICHIS
// ============================================================================

export interface EnrichedNyveeSession extends NyveeSession {
  cozy_level?: number;
  session_duration?: number;
  interactions?: any[];
  narrative_elements?: NarrativeElement[];
  personalization_score?: number;
  rewards_earned?: string[];
}

export interface NarrativeElement {
  type: 'discovery' | 'reflection' | 'comfort' | 'growth';
  content: string;
  timestamp: number;
  emotional_impact: number;
}

export interface CozyEnvironment {
  temperature: number;
  lighting: string;
  sounds: string[];
  textures: string[];
  aromatherapy?: string;
  narrative_theme: string;
}

export interface PersonalizedRecommendation {
  action: string;
  reason: string;
  expected_benefit: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface NyveeProgressionStats {
  totalSessions: number;
  totalCycles: number;
  averageCyclesPerSession: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  favoriteIntensity: BreathingIntensity | null;
  cocoonsUnlocked: string[];
  avgMoodDelta: number | null;
  averageCozyLevel: number;
  moodImprovement: number;
  favoriteThemes: string[];
  longestSession: number;
  badgesEarned: {
    calm: number;
    partial: number;
    tense: number;
  };
}

// ============================================================================
// SERVICE UNIFIÉ
// ============================================================================

export const nyveeService = {
  // --------------------------------------------------------------------------
  // SESSIONS BASIQUES
  // --------------------------------------------------------------------------

  /**
   * Créer une nouvelle session Nyvee simple
   */
  async createSession(data: CreateNyveeSession): Promise<NyveeSession> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const session: NyveeSession = {
        id: crypto.randomUUID(),
        userId: user.id,
        intensity: data.intensity,
        cyclesCompleted: 0,
        targetCycles: data.targetCycles,
        moodBefore: data.moodBefore,
        moodAfter: undefined,
        moodDelta: undefined,
        badgeEarned: 'calm',
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: undefined,
      };

      Sentry.addBreadcrumb({
        category: 'nyvee',
        message: 'Session created',
        data: { intensity: data.intensity, targetCycles: data.targetCycles },
      });

      return session;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },

  /**
   * Compléter une session Nyvee
   */
  async completeSession(data: CompleteNyveeSession): Promise<NyveeSession> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let moodDelta: number | undefined;
      if (data.moodAfter !== undefined) {
        moodDelta = data.moodAfter - 50;
      }

      const completedSession: NyveeSession = {
        id: data.sessionId,
        userId: user.id,
        intensity: 'calm',
        cyclesCompleted: data.cyclesCompleted,
        targetCycles: 6,
        moodAfter: data.moodAfter,
        moodDelta,
        badgeEarned: data.badgeEarned,
        cocoonUnlocked: data.cocoonUnlocked,
        completed: true,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };

      Sentry.addBreadcrumb({
        category: 'nyvee',
        message: 'Session completed',
        data: {
          sessionId: data.sessionId,
          cycles: data.cyclesCompleted,
          badge: data.badgeEarned,
        },
      });

      return completedSession;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },

  // --------------------------------------------------------------------------
  // SESSIONS ENRICHIES
  // --------------------------------------------------------------------------

  /**
   * Créer une session avec personnalisation avancée
   */
  async createSessionWithPersonalization(
    userId: string,
    preferences: {
      cozyLevel?: number;
      moodBefore?: number;
      preferredTheme?: string;
      sensoryPreferences?: string[];
    }
  ): Promise<EnrichedNyveeSession> {
    const history = await this.fetchEnrichedHistory(userId, 10);
    const personalizedLevel = this.calculatePersonalizedCozyLevel(history, preferences.cozyLevel);

    const { data, error } = await supabase
      .from('nyvee_sessions')
      .insert({
        user_id: userId,
        cozy_level: personalizedLevel,
        mood_before: preferences.moodBefore,
        session_duration: 0,
        interactions: [],
        narrative_elements: [],
        personalization_score: 0.85
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Générer un environnement personnalisé basé sur l'état émotionnel
   */
  async generatePersonalizedEnvironment(
    userId: string,
    currentMood: number,
    preferences: any
  ): Promise<CozyEnvironment> {
    const { data, error } = await supabase.functions.invoke('generate-cozy-environment', {
      body: {
        userId,
        mood: currentMood,
        preferences,
        timestamp: Date.now()
      }
    });

    if (error) throw error;

    return {
      temperature: data.temperature || 22,
      lighting: data.lighting || 'warm-ambient',
      sounds: data.sounds || ['gentle-rain', 'soft-music'],
      textures: data.textures || ['velvet', 'silk'],
      aromatherapy: data.aromatherapy || 'lavender',
      narrative_theme: data.narrative_theme || 'peaceful-garden'
    };
  },

  /**
   * Ajouter un élément narratif pendant la session
   */
  async addNarrativeElement(
    sessionId: string,
    element: NarrativeElement
  ): Promise<void> {
    const { data: session } = await supabase
      .from('nyvee_sessions')
      .select('narrative_elements')
      .eq('id', sessionId)
      .single();

    if (session) {
      const narrativeElements = [...(session.narrative_elements || []), element];
      const { error } = await supabase
        .from('nyvee_sessions')
        .update({ narrative_elements: narrativeElements })
        .eq('id', sessionId);

      if (error) throw error;
    }
  },

  /**
   * Obtenir des recommandations personnalisées en temps réel
   */
  async getRealtimeRecommendations(
    userId: string,
    currentState: {
      cozyLevel: number;
      mood: number;
      sessionDuration: number;
      interactions: any[];
    }
  ): Promise<PersonalizedRecommendation[]> {
    const { data, error } = await supabase.functions.invoke('nyvee-recommendations', {
      body: {
        userId,
        currentState,
        timestamp: Date.now()
      }
    });

    if (error) throw error;
    return data.recommendations || [];
  },

  /**
   * Compléter une session avec analyse et récompenses
   */
  async completeSessionWithRewards(
    sessionId: string,
    completion: {
      durationSeconds: number;
      moodAfter?: number;
      reflections?: string;
      achievements?: string[];
    }
  ): Promise<{ rewards: string[]; insights: string[] }> {
    const { error } = await supabase
      .from('nyvee_sessions')
      .update({
        session_duration: completion.durationSeconds,
        mood_after: completion.moodAfter,
        completed_at: new Date().toISOString(),
        rewards_earned: completion.achievements || []
      })
      .eq('id', sessionId);

    if (error) throw error;

    const insights = await this.generateSessionInsights(sessionId);

    return {
      rewards: completion.achievements || [],
      insights
    };
  },

  /**
   * Générer des insights personnalisés après session
   */
  async generateSessionInsights(sessionId: string): Promise<string[]> {
    const { data, error } = await supabase.functions.invoke('generate-insights', {
      body: { sessionId, type: 'nyvee' }
    });

    if (error) return [];
    return data.insights || [];
  },

  // --------------------------------------------------------------------------
  // UTILITAIRES
  // --------------------------------------------------------------------------

  /**
   * Calculer le niveau de confort personnalisé
   */
  calculatePersonalizedCozyLevel(
    history: EnrichedNyveeSession[],
    preferredLevel?: number
  ): number {
    if (history.length === 0) return preferredLevel || 50;

    const avgLevel = history.reduce((sum, s) => sum + (s.cozy_level || 50), 0) / history.length;
    const recentTrend = history.slice(0, 3).reduce((sum, s) => sum + (s.cozy_level || 50), 0) / Math.min(3, history.length);

    return Math.round((avgLevel * 0.4 + recentTrend * 0.4 + (preferredLevel || 50) * 0.2));
  },

  /**
   * Déterminer le badge selon l'intensité et les cycles
   */
  determineBadge(intensity: BreathingIntensity, cyclesCompleted: number, targetCycles: number): BadgeType {
    const completionRate = cyclesCompleted / targetCycles;

    if (completionRate >= 0.9 && intensity === 'calm') {
      return 'calm';
    } else if (completionRate >= 0.7) {
      return 'partial';
    } else {
      return 'tense';
    }
  },

  /**
   * Déterminer si un nouveau cocoon est débloqué
   */
  shouldUnlockCocoon(badge: BadgeType): boolean {
    if (badge === 'calm') {
      return Math.random() < 0.3;
    }
    return false;
  },

  // --------------------------------------------------------------------------
  // STATISTIQUES ET HISTORIQUE
  // --------------------------------------------------------------------------

  /**
   * Obtenir les statistiques utilisateur (basique)
   */
  async getStats(): Promise<NyveeStats> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const stats: NyveeStats = {
        totalSessions: 0,
        totalCycles: 0,
        averageCyclesPerSession: 0,
        completionRate: 0,
        currentStreak: 0,
        longestStreak: 0,
        favoriteIntensity: null,
        cocoonsUnlocked: ['crystal'],
        avgMoodDelta: null,
        badgesEarned: {
          calm: 0,
          partial: 0,
          tense: 0,
        },
      };

      return stats;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },

  /**
   * Obtenir les statistiques de progression complètes
   */
  async getProgressionStats(userId: string): Promise<NyveeProgressionStats> {
    const history = await this.fetchEnrichedHistory(userId, 100);

    const totalCycles = history.reduce((sum, s) => sum + (s.cyclesCompleted || 0), 0);
    const completedSessions = history.filter(s => s.completed);

    return {
      totalSessions: history.length,
      totalCycles,
      averageCyclesPerSession: history.length > 0 ? totalCycles / history.length : 0,
      completionRate: history.length > 0 ? completedSessions.length / history.length : 0,
      currentStreak: 0,
      longestStreak: 0,
      favoriteIntensity: null,
      cocoonsUnlocked: ['crystal'],
      avgMoodDelta: this.calculateAverageMoodDelta(history),
      averageCozyLevel: history.reduce((sum, s) => sum + (s.cozy_level || 50), 0) / (history.length || 1),
      moodImprovement: this.calculateMoodImprovement(history),
      favoriteThemes: this.extractFavoriteThemes(history),
      longestSession: Math.max(...history.map(s => s.session_duration || 0), 0),
      badgesEarned: {
        calm: history.filter(s => s.badgeEarned === 'calm').length,
        partial: history.filter(s => s.badgeEarned === 'partial').length,
        tense: history.filter(s => s.badgeEarned === 'tense').length,
      }
    };
  },

  calculateAverageMoodDelta(sessions: NyveeSession[]): number | null {
    const sessionsWithDelta = sessions.filter(s => s.moodDelta !== undefined);
    if (sessionsWithDelta.length === 0) return null;
    return sessionsWithDelta.reduce((sum, s) => sum + (s.moodDelta || 0), 0) / sessionsWithDelta.length;
  },

  calculateMoodImprovement(sessions: EnrichedNyveeSession[]): number {
    const sessionsWithMood = sessions.filter(s => s.moodBefore && s.moodAfter);
    if (sessionsWithMood.length === 0) return 0;

    const improvements = sessionsWithMood.map(s =>
      ((s.moodAfter! - s.moodBefore!) / s.moodBefore!) * 100
    );

    return improvements.reduce((sum, i) => sum + i, 0) / improvements.length;
  },

  extractFavoriteThemes(sessions: EnrichedNyveeSession[]): string[] {
    const themes: Record<string, number> = {};

    sessions.forEach(session => {
      session.narrative_elements?.forEach(element => {
        const theme = (element as any).theme || 'default';
        themes[theme] = (themes[theme] || 0) + 1;
      });
    });

    return Object.entries(themes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([theme]) => theme);
  },

  /**
   * Récupérer les sessions récentes (basique)
   */
  async getRecentSessions(limit: number = 10): Promise<NyveeSession[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      return [];
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },

  /**
   * Récupérer l'historique enrichi avec statistiques
   */
  async fetchEnrichedHistory(userId: string, limit: number = 20): Promise<EnrichedNyveeSession[]> {
    const { data, error } = await supabase
      .from('nyvee_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },
};

// Export classe pour compatibilité avec le service enrichi
export class NyveeServiceEnriched {
  static createSessionWithPersonalization = nyveeService.createSessionWithPersonalization.bind(nyveeService);
  static generatePersonalizedEnvironment = nyveeService.generatePersonalizedEnvironment.bind(nyveeService);
  static addNarrativeElement = nyveeService.addNarrativeElement.bind(nyveeService);
  static getRealtimeRecommendations = nyveeService.getRealtimeRecommendations.bind(nyveeService);
  static completeSessionWithRewards = nyveeService.completeSessionWithRewards.bind(nyveeService);
  static generateSessionInsights = nyveeService.generateSessionInsights.bind(nyveeService);
  static fetchHistory = nyveeService.fetchEnrichedHistory.bind(nyveeService);
  static getProgressionStats = nyveeService.getProgressionStats.bind(nyveeService);
}

export default nyveeService;
