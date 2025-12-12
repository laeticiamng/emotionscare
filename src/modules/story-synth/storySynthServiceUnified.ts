/**
 * Service unifié pour Story Synth - Narration thérapeutique adaptative
 * Consolide storySynthService.ts + storySynthServiceEnriched.ts
 */

import { supabase } from '@/integrations/supabase/client';
import { Sentry } from '@/lib/errors/sentry-compat';
import {
  StorySynthSession,
  StorySynthSessionSchema,
  CreateStorySynthSession,
  CreateStorySynthSessionSchema,
  CompleteStorySynthSession,
  CompleteStorySynthSessionSchema,
  StorySynthStats,
  StorySynthStatsSchema,
  StoryContent,
  StoryContentSchema,
} from './types';

// ============================================================================
// TYPES ENRICHIS
// ============================================================================

export interface EnrichedStorySynthSession {
  id: string;
  user_id: string;
  theme?: string;
  tone?: string;
  story_theme?: string;
  narrative_arc?: NarrativeArc;
  user_choices?: UserChoice[];
  emotional_impact?: EmotionalImpactPoint[];
  therapeutic_goals?: string[];
  personalization_level?: number;
  duration_seconds?: number; // Made optional to support DB records without this field
  reading_duration_seconds?: number;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
  achievements_unlocked?: string[];
  story_content?: StoryContent;
}

export interface NarrativeArc {
  exposition: StorySegment;
  rising_action: StorySegment[];
  climax: StorySegment;
  falling_action: StorySegment[];
  resolution: StorySegment;
  current_position: number;
}

export interface StorySegment {
  id: string;
  content: string;
  mood_tone: string;
  therapeutic_elements: string[];
  choices_offered?: Choice[];
  emotional_resonance: number;
  timestamp: number;
}

export interface Choice {
  id: string;
  text: string;
  emotional_valence: number;
  therapeutic_path: string;
  consequences: string;
}

export interface UserChoice {
  segment_id: string;
  choice_id: string;
  timestamp: number;
  emotional_state_before: number;
  emotional_state_after?: number;
}

export interface EmotionalImpactPoint {
  timestamp: number;
  emotional_intensity: number;
  therapeutic_value: number;
  user_engagement: number;
}

export interface PersonalizedStory {
  theme: string;
  narrative_style: string;
  therapeutic_focus: string[];
  estimated_duration: number;
  difficulty_level: number;
  emotional_journey: string;
}

// ============================================================================
// SERVICE UNIFIÉ
// ============================================================================

export const storySynthService = {
  // --------------------------------------------------------------------------
  // SESSIONS BASIQUES
  // --------------------------------------------------------------------------

  /**
   * Créer une session simple
   */
  async createSession(payload: CreateStorySynthSession): Promise<StorySynthSession> {
    try {
      const validated = CreateStorySynthSessionSchema.parse(payload);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('user_not_authenticated');

      const { data, error } = await supabase
        .from('story_synth_sessions')
        .insert({
          user_id: user.id,
          theme: validated.theme,
          tone: validated.tone,
          user_context: validated.user_context,
          reading_duration_seconds: 0,
        })
        .select()
        .single();

      if (error) throw error;

      return StorySynthSessionSchema.parse(data);
    } catch (err) {
      Sentry.captureException(err, { tags: { scope: 'storySynthService.createSession' } });
      throw err instanceof Error ? err : new Error('create_session_failed');
    }
  },

  /**
   * Compléter une session simple
   */
  async completeSession(payload: CompleteStorySynthSession): Promise<StorySynthSession> {
    try {
      const validated = CompleteStorySynthSessionSchema.parse(payload);

      const { data, error } = await supabase
        .from('story_synth_sessions')
        .update({
          reading_duration_seconds: validated.reading_duration_seconds,
          completed_at: new Date().toISOString(),
        })
        .eq('id', validated.session_id)
        .select()
        .single();

      if (error) throw error;

      return StorySynthSessionSchema.parse(data);
    } catch (err) {
      Sentry.captureException(err, { tags: { scope: 'storySynthService.completeSession' } });
      throw err instanceof Error ? err : new Error('complete_session_failed');
    }
  },

  /**
   * Générer une histoire
   */
  async generateStory(sessionId: string): Promise<StoryContent> {
    try {
      const { data, error } = await supabase.functions.invoke('story-generator', {
        body: { session_id: sessionId },
      });

      if (error) throw error;

      const story = StoryContentSchema.parse(data.story);

      await supabase
        .from('story_synth_sessions')
        .update({ story_content: story })
        .eq('id', sessionId);

      return story;
    } catch (err) {
      Sentry.captureException(err, { tags: { scope: 'storySynthService.generateStory' } });
      throw err instanceof Error ? err : new Error('generate_story_failed');
    }
  },

  // --------------------------------------------------------------------------
  // SESSIONS ENRICHIES
  // --------------------------------------------------------------------------

  /**
   * Générer une histoire thérapeutique personnalisée
   */
  async generatePersonalizedStory(
    userId: string,
    preferences: {
      therapeuticGoals?: string[];
      preferredThemes?: string[];
      emotionalStartPoint?: number;
      complexity?: number;
    }
  ): Promise<PersonalizedStory> {
    const history = await this.fetchHistory(userId, 10);
    const profile = await this.getUserTherapeuticProfile(userId);

    const { data, error } = await supabase.functions.invoke('generate-therapeutic-story', {
      body: {
        userId,
        preferences,
        profile,
        history: history.slice(0, 3)
      }
    });

    if (error) {
      return {
        theme: 'journey-of-healing',
        narrative_style: 'reflective',
        therapeutic_focus: preferences.therapeuticGoals || ['stress-relief', 'self-discovery'],
        estimated_duration: 1200,
        difficulty_level: preferences.complexity || 5,
        emotional_journey: 'gradual-uplift'
      };
    }

    return data.story;
  },

  /**
   * Créer une session narrative avec suivi adaptatif
   */
  async createNarrativeSession(
    userId: string,
    storyConfig: PersonalizedStory
  ): Promise<EnrichedStorySynthSession> {
    const { data, error } = await supabase
      .from('story_synth_sessions')
      .insert({
        user_id: userId,
        story_theme: storyConfig.theme,
        narrative_arc: await this.generateInitialArc(storyConfig),
        user_choices: [],
        emotional_impact: [],
        therapeutic_goals: storyConfig.therapeutic_focus,
        personalization_level: 0.8,
        duration_seconds: 0
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Générer l'arc narratif initial
   */
  async generateInitialArc(config: PersonalizedStory): Promise<NarrativeArc> {
    const { data } = await supabase.functions.invoke('generate-narrative-arc', {
      body: { config }
    });

    return data?.arc || {
      exposition: this.createDefaultSegment('exposition', config.theme),
      rising_action: [
        this.createDefaultSegment('rising-1', config.theme),
        this.createDefaultSegment('rising-2', config.theme)
      ],
      climax: this.createDefaultSegment('climax', config.theme),
      falling_action: [this.createDefaultSegment('falling-1', config.theme)],
      resolution: this.createDefaultSegment('resolution', config.theme),
      current_position: 0
    };
  },

  createDefaultSegment(type: string, theme: string): StorySegment {
    return {
      id: `${type}_${Date.now()}`,
      content: `Segment narratif ${type} sur le thème ${theme}`,
      mood_tone: 'neutral',
      therapeutic_elements: ['reflection', 'growth'],
      emotional_resonance: 0.7,
      timestamp: Date.now()
    };
  },

  /**
   * Enregistrer un choix utilisateur et adapter la narration
   */
  async recordChoiceAndAdapt(
    sessionId: string,
    choice: UserChoice
  ): Promise<{ nextSegment: StorySegment; adaptations: string[] }> {
    const { data: session } = await supabase
      .from('story_synth_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (!session) throw new Error('Session not found');

    const userChoices = [...(session.user_choices || []), choice];

    await supabase
      .from('story_synth_sessions')
      .update({ user_choices: userChoices })
      .eq('id', sessionId);

    const { data } = await supabase.functions.invoke('adapt-story-narrative', {
      body: {
        sessionId,
        choice,
        currentArc: session.narrative_arc,
        emotionalHistory: session.emotional_impact
      }
    });

    return {
      nextSegment: data?.nextSegment || this.createDefaultSegment('adaptive', session.story_theme),
      adaptations: data?.adaptations || []
    };
  },

  /**
   * Suivre l'impact émotionnel en temps réel
   */
  async trackEmotionalImpact(
    sessionId: string,
    impactPoint: EmotionalImpactPoint
  ): Promise<{ shouldIntervene: boolean; intervention?: any }> {
    const { data: session } = await supabase
      .from('story_synth_sessions')
      .select('emotional_impact, therapeutic_goals')
      .eq('id', sessionId)
      .single();

    if (session) {
      const emotionalImpact = [...(session.emotional_impact || []), impactPoint];

      await supabase
        .from('story_synth_sessions')
        .update({ emotional_impact: emotionalImpact })
        .eq('id', sessionId);

      const analysis = this.analyzeEmotionalTrajectory(emotionalImpact);

      if (analysis.needsIntervention) {
        const intervention = await this.generateTherapeuticIntervention(
          sessionId,
          analysis,
          session.therapeutic_goals
        );
        return { shouldIntervene: true, intervention };
      }
    }

    return { shouldIntervene: false };
  },

  analyzeEmotionalTrajectory(
    impacts: EmotionalImpactPoint[]
  ): { needsIntervention: boolean; reason?: string; urgency?: number } {
    if (impacts.length < 3) return { needsIntervention: false };

    const recent = impacts.slice(-5);
    const avgIntensity = recent.reduce((sum, p) => sum + p.emotional_intensity, 0) / recent.length;
    const avgEngagement = recent.reduce((sum, p) => sum + p.user_engagement, 0) / recent.length;

    if (avgIntensity > 0.85) {
      return {
        needsIntervention: true,
        reason: 'high_emotional_intensity',
        urgency: 0.8
      };
    }

    if (avgEngagement < 0.3 && impacts.length > 10) {
      return {
        needsIntervention: true,
        reason: 'low_engagement',
        urgency: 0.6
      };
    }

    const therapeuticValues = recent.map(p => p.therapeutic_value);
    const therapeuticTrend = this.calculateTrend(therapeuticValues);

    if (therapeuticTrend < -0.2) {
      return {
        needsIntervention: true,
        reason: 'declining_therapeutic_value',
        urgency: 0.7
      };
    }

    return { needsIntervention: false };
  },

  async generateTherapeuticIntervention(
    sessionId: string,
    analysis: any,
    therapeuticGoals: string[]
  ): Promise<any> {
    const { data } = await supabase.functions.invoke('story-therapeutic-intervention', {
      body: { sessionId, analysis, therapeuticGoals }
    });

    return data?.intervention || {
      type: 'narrative-pause',
      message: 'Prenons un moment pour réfléchir...',
      duration: 30,
      therapeutic_action: 'grounding'
    };
  },

  calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;

    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const avgFirst = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;

    return avgFirst === 0 ? 0 : (avgSecond - avgFirst) / avgFirst;
  },

  async getUserTherapeuticProfile(userId: string): Promise<any> {
    const { data } = await supabase
      .from('user_therapeutic_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    return data || {
      preferred_narrative_styles: ['reflective', 'hopeful'],
      therapeutic_responsiveness: {},
      emotional_baseline: 50
    };
  },

  /**
   * Compléter une session avec rapport narratif
   */
  async completeSessionWithReport(
    sessionId: string,
    completion: {
      durationSeconds: number;
      finalEmotionalState?: number;
      userReflection?: string;
    }
  ): Promise<{
    narrativeReport: any;
    therapeuticInsights: string[];
    achievementsUnlocked: string[];
    recommendedNextStories: string[];
  }> {
    const { data: session } = await supabase
      .from('story_synth_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (!session) throw new Error('Session not found');

    const achievements = this.calculateAchievements(session);

    await supabase
      .from('story_synth_sessions')
      .update({
        duration_seconds: completion.durationSeconds,
        completed_at: new Date().toISOString(),
        achievements_unlocked: achievements
      })
      .eq('id', sessionId);

    const { data } = await supabase.functions.invoke('generate-story-report', {
      body: {
        sessionId,
        reflection: completion.userReflection
      }
    });

    return {
      narrativeReport: data?.report || {},
      therapeuticInsights: data?.insights || [],
      achievementsUnlocked: achievements,
      recommendedNextStories: data?.recommendations || []
    };
  },

  calculateAchievements(session: EnrichedStorySynthSession): string[] {
    const achievements: string[] = [];
    const userChoices = session.user_choices || [];
    const emotionalImpact = session.emotional_impact || [];
    const durationSeconds = session.duration_seconds || session.reading_duration_seconds || 0;

    if (userChoices.length >= 10) achievements.push('STORY_EXPLORER');
    if (durationSeconds >= 1800) achievements.push('DEEP_READER');

    const avgTherapeuticValue = emotionalImpact.length > 0
      ? emotionalImpact.reduce((sum, p) => sum + p.therapeutic_value, 0) / emotionalImpact.length
      : 0;

    if (avgTherapeuticValue >= 0.8) achievements.push('HEALING_JOURNEY');

    if (emotionalImpact.length > 0) {
      const emotionalGrowth = emotionalImpact[emotionalImpact.length - 1].emotional_intensity -
        emotionalImpact[0].emotional_intensity;

      if (emotionalGrowth >= 0.3) achievements.push('EMOTIONAL_BREAKTHROUGH');
    }

    return achievements;
  },

  // --------------------------------------------------------------------------
  // STATISTIQUES ET HISTORIQUE
  // --------------------------------------------------------------------------

  /**
   * Obtenir les statistiques basiques
   */
  async getStats(): Promise<StorySynthStats> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('user_not_authenticated');

      const { data, error } = await supabase
        .from('story_synth_sessions')
        .select('theme, tone, reading_duration_seconds, completed_at')
        .eq('user_id', user.id);

      if (error) throw error;

      const sessions = data || [];
      const completedSessions = sessions.filter(s => s.completed_at);

      const total_stories_read = completedSessions.length;
      const total_reading_time_minutes =
        completedSessions.reduce((sum, s) => sum + (s.reading_duration_seconds || 0), 0) / 60;

      const themeCounts = completedSessions.reduce((acc, s) => {
        acc[s.theme] = (acc[s.theme] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const favorite_theme = Object.keys(themeCounts).length > 0
        ? (Object.entries(themeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as any)
        : null;

      const toneCounts = completedSessions.reduce((acc, s) => {
        acc[s.tone] = (acc[s.tone] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const favorite_tone = Object.keys(toneCounts).length > 0
        ? (Object.entries(toneCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as any)
        : null;

      const completion_rate = sessions.length > 0
        ? (completedSessions.length / sessions.length) * 100
        : 0;

      return StorySynthStatsSchema.parse({
        total_stories_read,
        total_reading_time_minutes,
        favorite_theme,
        favorite_tone,
        completion_rate,
      });
    } catch (err) {
      Sentry.captureException(err, { tags: { scope: 'storySynthService.getStats' } });
      throw err instanceof Error ? err : new Error('get_stats_failed');
    }
  },

  /**
   * Obtenir les statistiques narratives enrichies
   */
  async getNarrativeStats(userId: string): Promise<{
    totalStories: number;
    totalChoicesMade: number;
    favoriteThemes: string[];
    averageEngagement: number;
    therapeuticProgress: number;
    unlockedAchievements: string[];
  }> {
    const history = await this.fetchHistory(userId, 100);

    const totalChoices = history.reduce((sum, s) => sum + ((s as EnrichedStorySynthSession).user_choices?.length || 0), 0);
    const themeCounts: Record<string, number> = {};

    history.forEach(session => {
      const theme = (session as EnrichedStorySynthSession).story_theme || session.theme;
      if (theme) {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      }
    });

    const favoriteThemes = Object.entries(themeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([theme]) => theme);

    const allImpacts = history.flatMap(s => (s as EnrichedStorySynthSession).emotional_impact || []);
    const avgEngagement = allImpacts.length > 0
      ? allImpacts.reduce((sum, p) => sum + p.user_engagement, 0) / allImpacts.length
      : 0;

    const avgTherapeutic = allImpacts.length > 0
      ? allImpacts.reduce((sum, p) => sum + p.therapeutic_value, 0) / allImpacts.length
      : 0;

    const allAchievements = history.flatMap(s => (s as EnrichedStorySynthSession).achievements_unlocked || []);

    return {
      totalStories: history.length,
      totalChoicesMade: totalChoices,
      favoriteThemes,
      averageEngagement: avgEngagement,
      therapeuticProgress: avgTherapeutic,
      unlockedAchievements: [...new Set(allAchievements)]
    };
  },

  /**
   * Récupérer les sessions récentes
   */
  async getRecentSessions(limit = 10): Promise<StorySynthSession[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('user_not_authenticated');

      const { data, error } = await supabase
        .from('story_synth_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(row => StorySynthSessionSchema.parse(row));
    } catch (err) {
      Sentry.captureException(err, { tags: { scope: 'storySynthService.getRecentSessions' } });
      throw err instanceof Error ? err : new Error('get_recent_sessions_failed');
    }
  },

  /**
   * Récupérer l'historique
   */
  async fetchHistory(userId: string, limit: number = 20): Promise<StorySynthSession[]> {
    const { data, error } = await supabase
      .from('story_synth_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },
};

// Export fonction pour compatibilité avec l'ancien format
export const createSession = storySynthService.createSession.bind(storySynthService);
export const completeSession = storySynthService.completeSession.bind(storySynthService);
export const generateStory = storySynthService.generateStory.bind(storySynthService);
export const getStats = storySynthService.getStats.bind(storySynthService);
export const getRecentSessions = storySynthService.getRecentSessions.bind(storySynthService);

// Export classe pour compatibilité avec le service enrichi
export class StorySynthServiceEnriched {
  static generatePersonalizedStory = storySynthService.generatePersonalizedStory.bind(storySynthService);
  static createNarrativeSession = storySynthService.createNarrativeSession.bind(storySynthService);
  static recordChoiceAndAdapt = storySynthService.recordChoiceAndAdapt.bind(storySynthService);
  static trackEmotionalImpact = storySynthService.trackEmotionalImpact.bind(storySynthService);
  static completeSessionWithReport = storySynthService.completeSessionWithReport.bind(storySynthService);
  static fetchHistory = storySynthService.fetchHistory.bind(storySynthService);
  static getNarrativeStats = storySynthService.getNarrativeStats.bind(storySynthService);
}

export default storySynthService;
