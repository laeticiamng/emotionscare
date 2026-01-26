/**
 * Service unifié pour Music Therapy - Musicothérapie adaptative avec IA
 * Consolide musicTherapyService.ts + musicTherapyServiceEnriched.ts
 */

import { supabase } from '@/integrations/supabase/client';
import type { ListeningPatterns, HistorySummary } from './types';

// ============================================================================
// TYPES
// ============================================================================

export interface MusicSession {
  id: string;
  user_id: string;
  playlist_id?: string;
  mood_before?: number;
  mood_after?: number;
  duration_seconds: number;
  tracks_played: string[];
  created_at: string;
  completed_at?: string;
  emotional_journey?: EmotionalPoint[];
  ai_adaptations?: number;
  therapeutic_effectiveness?: number;
}

export interface EmotionalPoint {
  timestamp: number;
  mood: number;
  energy: number;
  track_id: string;
  user_interaction?: string;
}

export interface TherapeuticPlaylist {
  id: string;
  name: string;
  tracks: Track[];
  therapeutic_goal: string;
  expected_mood_shift: number;
  personalization_score: number;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  therapeutic_properties: {
    mood_target: string;
    energy_level: number;
    stress_reduction: number;
    emotional_resonance: number;
  };
  ai_metadata?: any;
}

export interface MusicTherapyRecommendation {
  playlist: TherapeuticPlaylist;
  reasoning: string;
  expected_benefits: string[];
  optimal_timing: string;
  duration_minutes: number;
}

export interface MusicTherapyStats {
  totalSessions: number;
  totalListeningTime: number;
  averageMoodImprovement: number;
  adaptationRate: number;
  favoriteGenres: string[];
  therapeuticEffectiveness: number;
}

// ============================================================================
// SERVICE UNIFIÉ
// ============================================================================

export class MusicTherapyService {
  // --------------------------------------------------------------------------
  // SESSIONS BASIQUES
  // --------------------------------------------------------------------------

  /**
   * Générer une playlist basée sur l'humeur (version simple)
   */
  static async generatePlaylist(
    _userId: string,
    mood: string,
    preferences?: any
  ): Promise<any> {
    // Utiliser adaptive-music au lieu de coach-ai (qui n'existe pas)
    const { data, error } = await supabase.functions.invoke('adaptive-music', {
      body: {
        action: 'create-playlist',
        emotions: [mood],
        duration: preferences?.duration || 30,
        playlist_type: 'therapeutic'
      }
    });

    if (error) throw error;
    return data;
  }

  /**
   * Créer une session d'écoute simple
   */
  static async createSession(
    userId: string,
    playlistId?: string,
    moodBefore?: number
  ): Promise<MusicSession> {
    const { data, error } = await supabase
      .from('music_sessions')
      .insert({
        user_id: userId,
        playlist_id: playlistId,
        mood_before: moodBefore,
        duration_seconds: 0,
        tracks_played: []
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Compléter une session simple
   */
  static async completeSession(
    sessionId: string,
    durationSeconds: number,
    tracksPlayed: string[],
    moodAfter?: number
  ): Promise<void> {
    const { error } = await supabase
      .from('music_sessions')
      .update({
        duration_seconds: durationSeconds,
        tracks_played: tracksPlayed,
        mood_after: moodAfter,
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;
  }

  // --------------------------------------------------------------------------
  // SESSIONS ENRICHIES AVEC IA
  // --------------------------------------------------------------------------

  /**
   * Générer une playlist thérapeutique personnalisée avec IA
   */
  static async generateTherapeuticPlaylist(
    userId: string,
    therapeuticGoal: {
      currentMood: number;
      targetMood: number;
      emotionalState: string;
      preferences?: string[];
      sessionDuration?: number;
    }
  ): Promise<TherapeuticPlaylist> {
    const history = await this.fetchHistory(userId, 20);
    const listeningPatterns = this.analyzeListeningPatterns(history);

    const { data, error } = await supabase.functions.invoke('generate-therapeutic-music', {
      body: {
        userId,
        therapeuticGoal,
        listeningPatterns,
        history: history.slice(0, 5)
      }
    });

    if (error) throw error;

    return {
      id: data.playlistId,
      name: data.name,
      tracks: data.tracks,
      therapeutic_goal: therapeuticGoal.emotionalState,
      expected_mood_shift: therapeuticGoal.targetMood - therapeuticGoal.currentMood,
      personalization_score: data.personalizationScore || 0.85
    };
  }

  /**
   * Créer une session avec suivi émotionnel en temps réel
   */
  static async createSessionWithEmotionalTracking(
    userId: string,
    playlistId: string,
    initialMood: number
  ): Promise<MusicSession> {
    const { data, error } = await supabase
      .from('music_sessions')
      .insert({
        user_id: userId,
        playlist_id: playlistId,
        mood_before: initialMood,
        duration_seconds: 0,
        tracks_played: [],
        emotional_journey: [],
        ai_adaptations: 0
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Enregistrer un point émotionnel pendant l'écoute
   */
  static async recordEmotionalPoint(
    sessionId: string,
    point: EmotionalPoint
  ): Promise<{ shouldAdapt: boolean; recommendation?: any }> {
    const { data: session } = await supabase
      .from('music_sessions')
      .select('emotional_journey, ai_adaptations')
      .eq('id', sessionId)
      .single();

    if (session) {
      const journey = [...(session.emotional_journey || []), point];

      const { error } = await supabase
        .from('music_sessions')
        .update({ emotional_journey: journey })
        .eq('id', sessionId);

      if (error) throw error;

      const analysis = await this.analyzeEmotionalTrajectory(journey);

      if (analysis.needsAdaptation) {
        const adaptation = await this.adaptPlaylist(sessionId, analysis);
        return { shouldAdapt: true, recommendation: adaptation };
      }
    }

    return { shouldAdapt: false };
  }

  /**
   * Adapter la playlist en temps réel selon l'état émotionnel
   */
  private static async adaptPlaylist(
    sessionId: string,
    analysis: any
  ): Promise<any> {
    const { data: session } = await supabase
      .from('music_sessions')
      .select('user_id, playlist_id, emotional_journey, ai_adaptations')
      .eq('id', sessionId)
      .single();

    if (!session) return null;

    const { data, error } = await supabase.functions.invoke('adaptive-music', {
      body: {
        action: 'adapt-session',
        sessionId,
        userId: session.user_id,
        currentPlaylistId: session.playlist_id,
        emotionalJourney: session.emotional_journey,
        analysis
      }
    });

    if (error) return null;

    await supabase
      .from('music_sessions')
      .update({ ai_adaptations: (session.ai_adaptations || 0) + 1 })
      .eq('id', sessionId);

    return data.adaptation;
  }

  /**
   * Analyser la trajectoire émotionnelle
   */
  private static async analyzeEmotionalTrajectory(
    journey: EmotionalPoint[]
  ): Promise<{ needsAdaptation: boolean; reason?: string; urgency?: number }> {
    if (journey.length < 3) return { needsAdaptation: false };

    const recentPoints = journey.slice(-5);
    const moodTrend = this.calculateTrend(recentPoints.map(p => p.mood));

    // Stagnation émotionnelle
    if (Math.abs(moodTrend) < 0.1 && journey.length > 10) {
      return {
        needsAdaptation: true,
        reason: 'emotional_stagnation',
        urgency: 0.6
      };
    }

    // Régression émotionnelle
    if (moodTrend < -0.3) {
      return {
        needsAdaptation: true,
        reason: 'mood_decline',
        urgency: 0.9
      };
    }

    // Énergie inadaptée
    const avgEnergy = recentPoints.reduce((sum, p) => sum + p.energy, 0) / recentPoints.length;
    const avgMood = recentPoints.reduce((sum, p) => sum + p.mood, 0) / recentPoints.length;

    if (avgMood < 50 && avgEnergy > 70) {
      return {
        needsAdaptation: true,
        reason: 'energy_mood_mismatch',
        urgency: 0.7
      };
    }

    return { needsAdaptation: false };
  }

  /**
   * Calculer la tendance d'une série de valeurs
   */
  private static calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;

    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const avgFirst = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;

    return avgFirst === 0 ? 0 : (avgSecond - avgFirst) / avgFirst;
  }

  /**
   * Obtenir des recommandations musicales intelligentes
   */
  static async getIntelligentRecommendations(
    userId: string,
    context: {
      timeOfDay: string;
      currentActivity?: string;
      recentMood?: number;
      energyLevel?: number;
    }
  ): Promise<MusicTherapyRecommendation[]> {
    const history = await this.fetchHistory(userId, 30);
    const patterns = this.analyzeListeningPatterns(history);

    const { data, error } = await supabase.functions.invoke('music-recommendations', {
      body: {
        userId,
        context,
        patterns,
        historySummary: this.summarizeHistory(history)
      }
    });

    if (error) return [];
    return data.recommendations || [];
  }

  /**
   * Analyser les patterns d'écoute
   */
  private static analyzeListeningPatterns(history: MusicSession[]): ListeningPatterns {
    const patterns: ListeningPatterns = {
      preferredDurations: [],
      moodResponses: {},
      therapeuticEffectiveness: {},
      timePreferences: {}
    };

    history.forEach(session => {
      patterns.preferredDurations.push(session.duration_seconds);

      if (session.mood_before && session.mood_after) {
        const improvement = session.mood_after - session.mood_before;
        const effectiveness = session.tracks_played.length > 0
          ? improvement / session.tracks_played.length
          : 0;

        session.tracks_played.forEach(trackId => {
          patterns.therapeuticEffectiveness[trackId] =
            (patterns.therapeuticEffectiveness[trackId] || 0) + effectiveness;
        });
      }
    });

    return patterns;
  }

  /**
   * Résumer l'historique pour le contexte IA
   */
  private static summarizeHistory(history: MusicSession[]): HistorySummary {
    return {
      totalSessions: history.length,
      avgImprovement: this.calculateAverageMoodImprovement(history),
      totalListeningTime: history.reduce((sum, s) => sum + s.duration_seconds, 0),
      adaptationRate: history.reduce((sum, s) => sum + (s.ai_adaptations || 0), 0) / (history.length || 1)
    };
  }

  /**
   * Compléter une session avec analyse thérapeutique
   */
  static async completeSessionWithAnalysis(
    sessionId: string,
    completion: {
      durationSeconds: number;
      tracksPlayed: string[];
      finalMood?: number;
      userFeedback?: string;
    }
  ): Promise<{
    therapeuticReport: any;
    effectiveness: number;
    recommendations: string[];
  }> {
    const { data: session } = await supabase
      .from('music_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (!session) throw new Error('Session not found');

    const effectiveness = this.calculateTherapeuticEffectiveness(
      session.mood_before,
      completion.finalMood,
      session.emotional_journey
    );

    const { error } = await supabase
      .from('music_sessions')
      .update({
        duration_seconds: completion.durationSeconds,
        tracks_played: completion.tracksPlayed,
        mood_after: completion.finalMood,
        therapeutic_effectiveness: effectiveness,
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;

    const { data } = await supabase.functions.invoke('adaptive-music', {
      body: { action: 'generate-report', sessionId, feedback: completion.userFeedback }
    });

    return {
      therapeuticReport: data?.report || {},
      effectiveness,
      recommendations: data?.recommendations || []
    };
  }

  /**
   * Calculer l'efficacité thérapeutique
   */
  private static calculateTherapeuticEffectiveness(
    moodBefore?: number,
    moodAfter?: number,
    journey?: EmotionalPoint[]
  ): number {
    if (!moodBefore || !moodAfter) return 0;

    const directImprovement = (moodAfter - moodBefore) / moodBefore;

    if (!journey || journey.length === 0) return directImprovement;

    const smoothness = this.calculateJourneySmoothness(journey);
    const consistency = this.calculateJourneyConsistency(journey);

    return (directImprovement * 0.6 + smoothness * 0.2 + consistency * 0.2);
  }

  private static calculateJourneySmoothness(journey: EmotionalPoint[]): number {
    if (journey.length < 2) return 1;

    let totalVariation = 0;
    for (let i = 1; i < journey.length; i++) {
      totalVariation += Math.abs(journey[i].mood - journey[i-1].mood);
    }

    const avgVariation = totalVariation / (journey.length - 1);
    return Math.max(0, 1 - (avgVariation / 50));
  }

  private static calculateJourneyConsistency(journey: EmotionalPoint[]): number {
    if (journey.length < 3) return 1;

    const trends: number[] = [];
    for (let i = 2; i < journey.length; i++) {
      const trend1 = journey[i-1].mood - journey[i-2].mood;
      const trend2 = journey[i].mood - journey[i-1].mood;
      trends.push(trend1 * trend2 > 0 ? 1 : 0);
    }

    return trends.reduce((sum, t) => sum + t, 0) / trends.length;
  }

  private static calculateAverageMoodImprovement(sessions: MusicSession[]): number {
    const sessionsWithMood = sessions.filter(s => s.mood_before && s.mood_after);
    if (sessionsWithMood.length === 0) return 0;

    const improvements = sessionsWithMood.map(s =>
      ((s.mood_after! - s.mood_before!) / s.mood_before!) * 100
    );

    return improvements.reduce((sum, i) => sum + i, 0) / improvements.length;
  }

  // --------------------------------------------------------------------------
  // HISTORIQUE ET STATISTIQUES
  // --------------------------------------------------------------------------

  /**
   * Récupérer l'historique
   */
  static async fetchHistory(userId: string, limit: number = 20): Promise<MusicSession[]> {
    const { data, error } = await supabase
      .from('music_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Obtenir les statistiques complètes
   */
  static async getStats(userId: string): Promise<MusicTherapyStats> {
    const history = await this.fetchHistory(userId, 100);

    const totalListeningTime = history.reduce((sum, s) => sum + s.duration_seconds, 0);
    const avgImprovement = this.calculateAverageMoodImprovement(history);
    const adaptationRate = history.reduce((sum, s) => sum + (s.ai_adaptations || 0), 0) / (history.length || 1);

    const sessionsWithEffectiveness = history.filter(s => s.therapeutic_effectiveness);
    const avgEffectiveness = sessionsWithEffectiveness.length > 0
      ? sessionsWithEffectiveness.reduce((sum, s) => sum + (s.therapeutic_effectiveness || 0), 0) / sessionsWithEffectiveness.length
      : 0;

    return {
      totalSessions: history.length,
      totalListeningTime,
      averageMoodImprovement: avgImprovement,
      adaptationRate,
      favoriteGenres: [],
      therapeuticEffectiveness: avgEffectiveness
    };
  }
}

// Export par défaut pour compatibilité
export const musicTherapyService = MusicTherapyService;
