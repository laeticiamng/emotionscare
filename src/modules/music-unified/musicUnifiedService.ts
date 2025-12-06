/**
 * Module Music Unified - Service principal
 * Service unifié pour toutes les fonctionnalités musicales
 * Consolide music-therapy, mood-mixer, et adaptive-music
 *
 * @module music-unified
 */

import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Import capabilities
import * as Therapeutic from './capabilities/therapeutic';
import * as Blending from './capabilities/blending';
import * as Adaptive from './capabilities/adaptive';

// Import types
import type {
  MusicSession,
  MusicSessionType,
  TherapeuticPlaylist,
  MusicalMood,
  PlaylistGenerationConfig,
  MusicRecommendation,
  EmotionComponent,
  MixingStrategy,
  EmotionBlend,
  BlendingStep,
  PomsState,
  PomsTrend,
  PlaybackAdaptation,
  EmotionalPoint,
  SessionStatistics,
  MusicPreset,
  EmotionalSliders,
} from './types';

// ============================================================================
// MAIN SERVICE CLASS
// ============================================================================

export class MusicUnifiedService {
  // ==========================================================================
  // SESSION MANAGEMENT
  // ==========================================================================

  /**
   * Créer une nouvelle session musicale
   */
  async createSession(
    userId: string,
    sessionType: MusicSessionType,
    config?: {
      playlistId?: string;
      moodBefore?: MusicalMood;
      pomsBefore?: PomsState;
      initialEmotions?: EmotionComponent[];
      targetEmotion?: string;
    }
  ): Promise<MusicSession> {
    const now = new Date().toISOString();

    const session: MusicSession = {
      id: uuidv4(),
      user_id: userId,
      session_type: sessionType,
      playlist_id: config?.playlistId,
      mood_before: config?.moodBefore,
      poms_before: config?.pomsBefore,
      initial_emotions: config?.initialEmotions,
      target_emotion: config?.targetEmotion,
      duration_seconds: 0,
      tracks_played: [],
      created_at: now,
    };

    // Persister dans Supabase
    const { data, error } = await supabase
      .from('music_sessions')
      .insert(session)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Démarrer une session
   */
  async startSession(sessionId: string): Promise<void> {
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('music_sessions')
      .update({ started_at: now })
      .eq('id', sessionId);

    if (error) throw error;
  }

  /**
   * Compléter une session
   */
  async completeSession(
    sessionId: string,
    completion: {
      durationSeconds: number;
      tracksPlayed: string[];
      moodAfter?: MusicalMood;
      pomsAfter?: PomsState;
      finalBlend?: EmotionBlend;
      therapeuticEffectiveness?: number;
      userSatisfaction?: number;
      emotionalJourney?: EmotionalPoint[];
      adaptations?: PlaybackAdaptation[];
    }
  ): Promise<MusicSession> {
    const now = new Date().toISOString();

    // Calculer mood improvement si disponible
    const session = await this.getSession(sessionId);
    let moodImprovement: number | undefined;

    if (session.mood_before && completion.moodAfter) {
      moodImprovement = completion.moodAfter.valence - session.mood_before.valence;
    }

    const { data, error } = await supabase
      .from('music_sessions')
      .update({
        duration_seconds: completion.durationSeconds,
        tracks_played: completion.tracksPlayed,
        mood_after: completion.moodAfter,
        poms_after: completion.pomsAfter,
        final_blend: completion.finalBlend,
        therapeutic_effectiveness: completion.therapeuticEffectiveness,
        user_satisfaction: completion.userSatisfaction,
        mood_improvement: moodImprovement,
        emotional_journey: completion.emotionalJourney,
        adaptations: completion.adaptations,
        completed_at: now,
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Récupérer une session
   */
  async getSession(sessionId: string): Promise<MusicSession> {
    const { data, error } = await supabase
      .from('music_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Récupérer l'historique des sessions
   */
  async getSessionHistory(
    userId: string,
    limit: number = 20,
    sessionType?: MusicSessionType
  ): Promise<MusicSession[]> {
    let query = supabase
      .from('music_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (sessionType) {
      query = query.eq('session_type', sessionType);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  // ==========================================================================
  // THERAPEUTIC CAPABILITIES
  // ==========================================================================

  /**
   * Générer une playlist thérapeutique
   */
  async generateTherapeuticPlaylist(
    userId: string,
    config: PlaylistGenerationConfig
  ): Promise<TherapeuticPlaylist> {
    return await Therapeutic.generateTherapeuticPlaylist(userId, config);
  }

  /**
   * Obtenir une recommandation de playlist
   */
  async getPlaylistRecommendation(
    userId: string,
    currentMood: MusicalMood,
    targetMood: MusicalMood,
    emotionalState: string
  ): Promise<{
    playlist: TherapeuticPlaylist;
    reasoning: string;
    expected_benefits: string[];
    optimal_timing: string;
  }> {
    return await Therapeutic.getPlaylistRecommendation(
      userId,
      currentMood,
      targetMood,
      emotionalState
    );
  }

  // ==========================================================================
  // BLENDING CAPABILITIES
  // ==========================================================================

  /**
   * Créer un mélange émotionnel personnalisé
   */
  async createPersonalizedMix(
    userId: string,
    config: {
      currentEmotions: string[];
      targetEmotion: string;
      intensity?: number;
      therapeuticGoal?: string;
    }
  ): Promise<{
    name: string;
    description: string;
    emotions: EmotionComponent[];
    strategy: MixingStrategy;
    expected_duration: number;
    difficulty_level: number;
  }> {
    return await Blending.createPersonalizedMix(userId, config);
  }

  /**
   * Calculer le blend émotionnel à un instant donné
   */
  calculateBlendAtTime(
    emotions: EmotionComponent[],
    strategy: MixingStrategy,
    elapsedSeconds: number
  ): EmotionBlend {
    return Blending.calculateBlendAtTime(emotions, strategy, elapsedSeconds);
  }

  /**
   * Convertir sliders en composants émotionnels
   */
  slidersToEmotionComponents(sliders: EmotionalSliders): EmotionComponent[] {
    return Blending.slidersToEmotionComponents(sliders);
  }

  /**
   * Générer gradient CSS émotionnel
   */
  generateEmotionalGradient(emotions: EmotionComponent[]): string {
    return Blending.generateEmotionalGradient(emotions);
  }

  // ==========================================================================
  // ADAPTIVE CAPABILITIES
  // ==========================================================================

  /**
   * Analyser l'état POMS
   */
  analyzePoms(state: PomsState): {
    preset: string;
    description: string;
    reasoning: string;
  } {
    return Adaptive.analyzePoms(state);
  }

  /**
   * Calculer la tendance POMS
   */
  calculatePomsTrend(before: PomsState, after: PomsState): PomsTrend {
    return Adaptive.calculatePomsTrend(before, after);
  }

  /**
   * Déterminer si adaptation nécessaire
   */
  shouldAdapt(
    currentPreset: string,
    pomsState: PomsState,
    lastAdaptation: PlaybackAdaptation | null,
    minTimeBetweenAdaptations?: number
  ): {
    should: boolean;
    reason?: string;
    newPreset?: string;
  } {
    return Adaptive.shouldAdapt(
      currentPreset,
      pomsState,
      lastAdaptation,
      minTimeBetweenAdaptations
    );
  }

  /**
   * Créer une adaptation
   */
  createAdaptation(
    fromPreset: string,
    toPreset: string,
    pomsState: PomsState,
    reason: string
  ): PlaybackAdaptation {
    return Adaptive.createAdaptation(fromPreset, toPreset, pomsState, reason);
  }

  /**
   * Mapper POMS vers MusicalMood
   */
  pomsToMusicalMood(state: PomsState): MusicalMood {
    return Adaptive.pomsToMusicalMood(state);
  }

  /**
   * Suggérer ajustements musicaux
   */
  suggestMusicAdjustments(state: PomsState): {
    tempo_adjustment: number;
    volume_adjustment: number;
    complexity_adjustment: number;
    reasoning: string;
  } {
    return Adaptive.suggestMusicAdjustments(state);
  }

  /**
   * Prédire évolution POMS optimale
   */
  predictOptimalPomsEvolution(current: PomsState, targetMinutes: number): PomsState[] {
    return Adaptive.predictOptimalPomsEvolution(current, targetMinutes);
  }

  // ==========================================================================
  // STATISTICS & ANALYTICS
  // ==========================================================================

  /**
   * Obtenir les statistiques de sessions
   */
  async getStatistics(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<SessionStatistics> {
    const { data: sessions, error } = await supabase
      .from('music_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (error) throw error;

    const completedSessions = (sessions || []).filter((s) => s.completed_at);
    const totalSessions = sessions?.length || 0;
    const totalDuration = completedSessions.reduce(
      (sum, s) => sum + (s.duration_seconds || 0),
      0
    );
    const averageDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;

    // Sessions par type
    const sessionsByType: Record<string, number> = {};
    (sessions || []).forEach((s) => {
      sessionsByType[s.session_type] = (sessionsByType[s.session_type] || 0) + 1;
    });

    // Efficacité moyenne
    const effectivenessSessions = completedSessions.filter(
      (s) => s.therapeutic_effectiveness !== null
    );
    const avgEffectiveness =
      effectivenessSessions.length > 0
        ? effectivenessSessions.reduce((sum, s) => sum + (s.therapeutic_effectiveness || 0), 0) /
          effectivenessSessions.length
        : 0;

    // Satisfaction moyenne
    const satisfactionSessions = completedSessions.filter((s) => s.user_satisfaction !== null);
    const avgSatisfaction =
      satisfactionSessions.length > 0
        ? satisfactionSessions.reduce((sum, s) => sum + (s.user_satisfaction || 0), 0) /
          satisfactionSessions.length
        : 0;

    // Amélioration d'humeur moyenne
    const moodSessions = completedSessions.filter((s) => s.mood_improvement !== null);
    const avgMoodImprovement =
      moodSessions.length > 0
        ? moodSessions.reduce((sum, s) => sum + (s.mood_improvement || 0), 0) / moodSessions.length
        : 0;

    return {
      total_sessions: totalSessions,
      total_duration_seconds: totalDuration,
      average_duration_seconds: averageDuration,
      sessions_by_type: sessionsByType,
      average_effectiveness: avgEffectiveness,
      average_satisfaction: avgSatisfaction,
      average_mood_improvement: avgMoodImprovement,
      most_used_moods: [],
      most_effective_moods: [],
      listening_patterns: {
        favorite_genres: [],
        favorite_artists: [],
        preferred_tempo_range: { min: 60, max: 120 },
        preferred_energy_level: 0.5,
        average_session_duration: Math.round(averageDuration),
        most_effective_times: [],
        mood_improvement_average: avgMoodImprovement,
      },
      period_start: startDate.toISOString(),
      period_end: endDate.toISOString(),
    };
  }

  // ==========================================================================
  // PRESETS & FAVORITES
  // ==========================================================================

  /**
   * Créer un preset
   */
  async createPreset(
    userId: string,
    name: string,
    sliders: EmotionalSliders,
    playlistId?: string
  ): Promise<MusicPreset> {
    const now = new Date().toISOString();

    const preset: MusicPreset = {
      id: uuidv4(),
      user_id: userId,
      name,
      sliders,
      playlist_id: playlistId,
      usage_count: 0,
      created_at: now,
    };

    const { data, error } = await supabase.from('music_presets').insert(preset).select().single();

    if (error) throw error;
    return data;
  }

  /**
   * Récupérer les presets de l'utilisateur
   */
  async getUserPresets(userId: string): Promise<MusicPreset[]> {
    const { data, error } = await supabase
      .from('music_presets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Incrémenter l'usage d'un preset
   */
  async incrementPresetUsage(presetId: string): Promise<void> {
    const now = new Date().toISOString();

    const { error } = await supabase.rpc('increment_preset_usage', {
      preset_id: presetId,
      last_used: now,
    });

    if (error) {
      // Fallback si la fonction RPC n'existe pas
      const { data: preset } = await supabase
        .from('music_presets')
        .select('usage_count')
        .eq('id', presetId)
        .single();

      if (preset) {
        await supabase
          .from('music_presets')
          .update({
            usage_count: (preset.usage_count || 0) + 1,
            last_used_at: now,
          })
          .eq('id', presetId);
      }
    }
  }
}

// Export singleton instance
export const musicUnifiedService = new MusicUnifiedService();
