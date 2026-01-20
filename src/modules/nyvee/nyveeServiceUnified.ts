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
   * Créer une nouvelle session Nyvee simple avec persistance DB
   */
  async createSession(data: CreateNyveeSession): Promise<NyveeSession> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Persister en base de données
      const { data: dbSession, error } = await supabase
        .from('nyvee_sessions')
        .insert({
          user_id: user.id,
          intensity: data.intensity,
          cycles_completed: 0,
          target_cycles: data.targetCycles,
          mood_before: data.moodBefore,
          badge_earned: 'calm',
          completed: false,
        })
        .select()
        .single();

      if (error) {
        Sentry.captureException(error);
        throw error;
      }

      const session: NyveeSession = {
        id: dbSession.id,
        userId: user.id,
        intensity: data.intensity,
        cyclesCompleted: 0,
        targetCycles: data.targetCycles,
        moodBefore: data.moodBefore,
        moodAfter: undefined,
        moodDelta: undefined,
        badgeEarned: 'calm',
        completed: false,
        createdAt: dbSession.created_at,
        completedAt: undefined,
      };

      Sentry.addBreadcrumb({
        category: 'nyvee',
        message: 'Session created and persisted',
        data: { sessionId: session.id, intensity: data.intensity, targetCycles: data.targetCycles },
      });

      return session;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },

  /**
   * Compléter une session Nyvee avec persistance DB
   */
  async completeSession(data: CompleteNyveeSession): Promise<NyveeSession> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Récupérer la session existante pour obtenir moodBefore
      const { data: existingSession } = await supabase
        .from('nyvee_sessions')
        .select('mood_before, intensity, target_cycles, created_at')
        .eq('id', data.sessionId)
        .eq('user_id', user.id)
        .single();

      let moodDelta: number | undefined;
      if (data.moodAfter !== undefined && existingSession?.mood_before !== undefined) {
        moodDelta = data.moodAfter - existingSession.mood_before;
      } else if (data.moodAfter !== undefined) {
        moodDelta = data.moodAfter - 50; // Fallback si mood_before n'existe pas
      }

      const completedAt = new Date().toISOString();

      // Mettre à jour en base de données
      const { data: dbSession, error } = await supabase
        .from('nyvee_sessions')
        .update({
          cycles_completed: data.cyclesCompleted,
          mood_after: data.moodAfter,
          mood_delta: moodDelta,
          badge_earned: data.badgeEarned,
          cocoon_unlocked: data.cocoonUnlocked,
          completed: true,
          completed_at: completedAt,
        })
        .eq('id', data.sessionId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        Sentry.captureException(error);
        throw error;
      }

      const completedSession: NyveeSession = {
        id: dbSession.id,
        userId: user.id,
        intensity: dbSession.intensity || 'calm',
        cyclesCompleted: data.cyclesCompleted,
        targetCycles: dbSession.target_cycles || 6,
        moodBefore: dbSession.mood_before,
        moodAfter: data.moodAfter,
        moodDelta,
        badgeEarned: data.badgeEarned,
        cocoonUnlocked: data.cocoonUnlocked,
        completed: true,
        createdAt: dbSession.created_at,
        completedAt,
      };

      Sentry.addBreadcrumb({
        category: 'nyvee',
        message: 'Session completed and persisted',
        data: {
          sessionId: data.sessionId,
          cycles: data.cyclesCompleted,
          badge: data.badgeEarned,
          moodDelta,
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
   * Obtenir les statistiques utilisateur (avec calcul réel depuis la DB)
   */
  async getStats(): Promise<NyveeStats> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Récupérer toutes les sessions de l'utilisateur
      const { data: sessions, error } = await supabase
        .from('nyvee_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        Sentry.captureException(error);
        throw error;
      }

      const allSessions = sessions || [];
      const completedSessions = allSessions.filter(s => s.completed);

      // Calculs des statistiques
      const totalSessions = allSessions.length;
      const totalCycles = allSessions.reduce((sum, s) => sum + (s.cycles_completed || 0), 0);
      const averageCyclesPerSession = totalSessions > 0 ? totalCycles / totalSessions : 0;
      const completionRate = totalSessions > 0 ? completedSessions.length / totalSessions : 0;

      // Calcul du streak
      const { currentStreak, longestStreak } = this.calculateStreaks(completedSessions);

      // Intensité favorite
      const intensityCounts: Record<string, number> = {};
      allSessions.forEach(s => {
        if (s.intensity) {
          intensityCounts[s.intensity] = (intensityCounts[s.intensity] || 0) + 1;
        }
      });
      const favoriteIntensity = Object.entries(intensityCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] as BreathingIntensity | undefined || null;

      // Cocoons débloqués
      const cocoonsUnlocked = [...new Set(
        allSessions
          .filter(s => s.cocoon_unlocked)
          .map(s => s.cocoon_unlocked)
      )];
      if (cocoonsUnlocked.length === 0) cocoonsUnlocked.push('crystal');

      // Moyenne du mood delta
      const sessionsWithDelta = allSessions.filter(s => s.mood_delta !== null && s.mood_delta !== undefined);
      const avgMoodDelta = sessionsWithDelta.length > 0
        ? sessionsWithDelta.reduce((sum, s) => sum + (s.mood_delta || 0), 0) / sessionsWithDelta.length
        : null;

      // Badges earned
      const badgesEarned = {
        calm: allSessions.filter(s => s.badge_earned === 'calm').length,
        partial: allSessions.filter(s => s.badge_earned === 'partial').length,
        tense: allSessions.filter(s => s.badge_earned === 'tense').length,
      };

      const stats: NyveeStats = {
        totalSessions,
        totalCycles,
        averageCyclesPerSession,
        completionRate,
        currentStreak,
        longestStreak,
        favoriteIntensity,
        cocoonsUnlocked,
        avgMoodDelta,
        badgesEarned,
      };

      return stats;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },

  /**
   * Calculer les streaks (séries consécutives de jours)
   */
  calculateStreaks(sessions: any[]): { currentStreak: number; longestStreak: number } {
    if (sessions.length === 0) return { currentStreak: 0, longestStreak: 0 };

    // Trier par date décroissante
    const sortedSessions = [...sessions].sort((a, b) =>
      new Date(b.completed_at || b.created_at).getTime() - new Date(a.completed_at || a.created_at).getTime()
    );

    // Obtenir les dates uniques de sessions
    const sessionDates = [...new Set(
      sortedSessions.map(s => {
        const date = new Date(s.completed_at || s.created_at);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      })
    )];

    // Calculer le streak actuel
    let currentStreak = 0;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;

    if (sessionDates[0] === todayStr || sessionDates[0] === yesterdayStr) {
      currentStreak = 1;
      let checkDate = new Date(sessionDates[0].split('-').map(Number).join('/'));

      for (let i = 1; i < sessionDates.length; i++) {
        const prevDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
        const prevDateStr = `${prevDate.getFullYear()}-${prevDate.getMonth()}-${prevDate.getDate()}`;

        if (sessionDates[i] === prevDateStr) {
          currentStreak++;
          checkDate = prevDate;
        } else {
          break;
        }
      }
    }

    // Calculer le plus long streak
    let longestStreak = currentStreak;
    let tempStreak = 1;

    for (let i = 1; i < sessionDates.length; i++) {
      const currentDate = new Date(sessionDates[i - 1].split('-').map(Number).join('/'));
      const prevDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      const prevDateStr = `${prevDate.getFullYear()}-${prevDate.getMonth()}-${prevDate.getDate()}`;

      if (sessionDates[i] === prevDateStr) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
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
   * Récupérer les sessions récentes depuis la DB
   */
  async getRecentSessions(limit: number = 10): Promise<NyveeSession[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: sessions, error } = await supabase
        .from('nyvee_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        Sentry.captureException(error);
        throw error;
      }

      // Mapper les données DB vers le type NyveeSession
      return (sessions || []).map(s => ({
        id: s.id,
        userId: s.user_id,
        intensity: s.intensity || 'calm',
        cyclesCompleted: s.cycles_completed || 0,
        targetCycles: s.target_cycles || 6,
        moodBefore: s.mood_before,
        moodAfter: s.mood_after,
        moodDelta: s.mood_delta,
        badgeEarned: s.badge_earned || 'calm',
        cocoonUnlocked: s.cocoon_unlocked,
        completed: s.completed || false,
        createdAt: s.created_at,
        completedAt: s.completed_at,
      }));
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
