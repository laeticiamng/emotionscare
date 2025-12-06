/**
 * Service enrichi pour Nyvee - Cocoon interactif avec personnalisation avancée
 */

import { supabase } from '@/integrations/supabase/client';

export interface NyveeSession {
  id: string;
  user_id: string;
  cozy_level: number;
  session_duration: number;
  interactions: any[];
  mood_before?: number;
  mood_after?: number;
  created_at: string;
  completed_at?: string;
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

export class NyveeServiceEnriched {
  /**
   * Créer une session avec personnalisation avancée
   */
  static async createSessionWithPersonalization(
    userId: string,
    preferences: {
      cozyLevel?: number;
      moodBefore?: number;
      preferredTheme?: string;
      sensoryPreferences?: string[];
    }
  ): Promise<NyveeSession> {
    // Récupérer l'historique pour personnaliser
    const history = await this.fetchHistory(userId, 10);
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
  }

  /**
   * Générer un environnement personnalisé basé sur l'état émotionnel
   */
  static async generatePersonalizedEnvironment(
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
  }

  /**
   * Ajouter un élément narratif pendant la session
   */
  static async addNarrativeElement(
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
  }

  /**
   * Obtenir des recommandations personnalisées en temps réel
   */
  static async getRealtimeRecommendations(
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
  }

  /**
   * Calculer le niveau de confort personnalisé
   */
  private static calculatePersonalizedCozyLevel(
    history: NyveeSession[],
    preferredLevel?: number
  ): number {
    if (history.length === 0) return preferredLevel || 50;

    const avgLevel = history.reduce((sum, s) => sum + s.cozy_level, 0) / history.length;
    const recentTrend = history.slice(0, 3).reduce((sum, s) => sum + s.cozy_level, 0) / Math.min(3, history.length);

    return Math.round((avgLevel * 0.4 + recentTrend * 0.4 + (preferredLevel || 50) * 0.2));
  }

  /**
   * Compléter une session avec analyse et récompenses
   */
  static async completeSessionWithRewards(
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

    // Analyser les progrès et générer des insights
    const insights = await this.generateSessionInsights(sessionId);
    
    return {
      rewards: completion.achievements || [],
      insights
    };
  }

  /**
   * Générer des insights personnalisés après session
   */
  static async generateSessionInsights(sessionId: string): Promise<string[]> {
    const { data, error } = await supabase.functions.invoke('generate-insights', {
      body: { sessionId, type: 'nyvee' }
    });

    if (error) return [];
    return data.insights || [];
  }

  /**
   * Récupérer l'historique enrichi avec statistiques
   */
  static async fetchHistory(userId: string, limit: number = 20): Promise<NyveeSession[]> {
    const { data, error } = await supabase
      .from('nyvee_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Obtenir les statistiques de progression
   */
  static async getProgressionStats(userId: string): Promise<{
    totalSessions: number;
    averageCozyLevel: number;
    moodImprovement: number;
    favoriteThemes: string[];
    longestSession: number;
  }> {
    const history = await this.fetchHistory(userId, 100);
    
    return {
      totalSessions: history.length,
      averageCozyLevel: history.reduce((sum, s) => sum + s.cozy_level, 0) / history.length,
      moodImprovement: this.calculateMoodImprovement(history),
      favoriteThemes: this.extractFavoriteThemes(history),
      longestSession: Math.max(...history.map(s => s.session_duration))
    };
  }

  private static calculateMoodImprovement(sessions: NyveeSession[]): number {
    const sessionsWithMood = sessions.filter(s => s.mood_before && s.mood_after);
    if (sessionsWithMood.length === 0) return 0;

    const improvements = sessionsWithMood.map(s => 
      (s.mood_after! - s.mood_before!) / s.mood_before! * 100
    );

    return improvements.reduce((sum, i) => sum + i, 0) / improvements.length;
  }

  private static extractFavoriteThemes(sessions: NyveeSession[]): string[] {
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
  }
}
