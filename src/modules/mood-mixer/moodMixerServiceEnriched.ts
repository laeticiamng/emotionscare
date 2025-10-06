/**
 * Service enrichi pour Mood Mixer - Mélange émotionnel thérapeutique avec IA
 */

import { supabase } from '@/integrations/supabase/client';

export interface MoodMixerSession {
  id: string;
  user_id: string;
  initial_emotions: EmotionComponent[];
  target_emotion: string;
  mixing_strategy: MixingStrategy;
  blending_steps: BlendingStep[];
  final_result: EmotionBlend;
  duration_seconds: number;
  created_at: string;
  completed_at?: string;
  therapeutic_effectiveness?: number;
}

export interface EmotionComponent {
  emotion: string;
  intensity: number;
  color: string;
  audio_frequency?: number;
  therapeutic_value: number;
}

export interface MixingStrategy {
  algorithm: 'gradual' | 'instant' | 'oscillating' | 'layered';
  transition_time: number;
  blending_ratio: number[];
  therapeutic_focus: string[];
}

export interface BlendingStep {
  timestamp: number;
  emotions_active: EmotionComponent[];
  blend_percentage: number;
  user_feedback?: number;
  physiological_response?: any;
}

export interface EmotionBlend {
  dominant_emotion: string;
  secondary_emotions: string[];
  intensity_level: number;
  stability_score: number;
  therapeutic_outcome: number;
}

export interface PersonalizedMix {
  name: string;
  description: string;
  emotions: EmotionComponent[];
  strategy: MixingStrategy;
  expected_duration: number;
  difficulty_level: number;
}

export class MoodMixerServiceEnriched {
  /**
   * Créer un mélange émotionnel personnalisé
   */
  static async createPersonalizedMix(
    userId: string,
    config: {
      currentEmotions: string[];
      targetEmotion: string;
      intensity?: number;
      therapeuticGoal?: string;
    }
  ): Promise<PersonalizedMix> {
    const history = await this.fetchHistory(userId, 10);
    const profile = await this.getUserEmotionalProfile(userId);

    const { data, error } = await supabase.functions.invoke('create-mood-mix', {
      body: {
        userId,
        config,
        profile,
        history: history.slice(0, 3)
      }
    });

    if (error) {
      return this.generateDefaultMix(config);
    }

    return data.mix;
  }

  /**
   * Générer un mix par défaut
   */
  private static generateDefaultMix(config: any): PersonalizedMix {
    const emotions: EmotionComponent[] = config.currentEmotions.map((emotion: string, index: number) => ({
      emotion,
      intensity: 0.6 + (index * 0.1),
      color: this.getEmotionColor(emotion),
      audio_frequency: 200 + (index * 100),
      therapeutic_value: 0.7
    }));

    return {
      name: `Mix vers ${config.targetEmotion}`,
      description: `Transition personnalisée`,
      emotions,
      strategy: {
        algorithm: 'gradual',
        transition_time: 300,
        blending_ratio: emotions.map(() => 1 / emotions.length),
        therapeutic_focus: [config.therapeuticGoal || 'equilibrium']
      },
      expected_duration: 600,
      difficulty_level: 5
    };
  }

  /**
   * Démarrer une session de mélange avec suivi en temps réel
   */
  static async startMixingSession(
    userId: string,
    mix: PersonalizedMix,
    initialEmotions: EmotionComponent[]
  ): Promise<MoodMixerSession> {
    const { data, error } = await supabase
      .from('mood_mixer_sessions')
      .insert({
        user_id: userId,
        initial_emotions: initialEmotions,
        target_emotion: mix.name,
        mixing_strategy: mix.strategy,
        blending_steps: [],
        duration_seconds: 0
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Enregistrer une étape de mélange avec analyse
   */
  static async recordBlendingStep(
    sessionId: string,
    step: BlendingStep
  ): Promise<{
    shouldAdjust: boolean;
    adjustment?: MixingStrategy;
    feedback?: string;
  }> {
    const { data: session } = await supabase
      .from('mood_mixer_sessions')
      .select('blending_steps, mixing_strategy, initial_emotions')
      .eq('id', sessionId)
      .single();

    if (session) {
      const steps = [...(session.blending_steps || []), step];
      
      await supabase
        .from('mood_mixer_sessions')
        .update({ blending_steps: steps })
        .eq('id', sessionId);

      // Analyser si un ajustement est nécessaire
      const analysis = this.analyzeBlendingProgress(
        steps,
        session.mixing_strategy,
        session.initial_emotions
      );

      if (analysis.needsAdjustment) {
        const adjustment = await this.generateStrategyAdjustment(
          sessionId,
          analysis
        );
        
        await supabase
          .from('mood_mixer_sessions')
          .update({ mixing_strategy: adjustment.strategy })
          .eq('id', sessionId);

        return {
          shouldAdjust: true,
          adjustment: adjustment.strategy,
          feedback: adjustment.reason
        };
      }
    }

    return { shouldAdjust: false };
  }

  /**
   * Analyser la progression du mélange
   */
  private static analyzeBlendingProgress(
    steps: BlendingStep[],
    strategy: MixingStrategy,
    initialEmotions: EmotionComponent[]
  ): { needsAdjustment: boolean; reason?: string; urgency?: number } {
    if (steps.length < 3) return { needsAdjustment: false };

    const recentSteps = steps.slice(-5);
    
    // Vérifier la stabilité du mélange
    const stabilityScores = recentSteps.map(s => {
      const intensities = s.emotions_active.map(e => e.intensity);
      const variance = this.calculateVariance(intensities);
      return 1 - Math.min(variance, 1);
    });

    const avgStability = stabilityScores.reduce((sum, s) => sum + s, 0) / stabilityScores.length;

    // Détection d'instabilité excessive
    if (avgStability < 0.4) {
      return {
        needsAdjustment: true,
        reason: 'high_instability',
        urgency: 0.8
      };
    }

    // Vérifier le feedback utilisateur
    const recentFeedback = recentSteps
      .filter(s => s.user_feedback !== undefined)
      .map(s => s.user_feedback!);

    if (recentFeedback.length >= 3) {
      const avgFeedback = recentFeedback.reduce((sum, f) => sum + f, 0) / recentFeedback.length;
      
      if (avgFeedback < 3) {
        return {
          needsAdjustment: true,
          reason: 'poor_user_feedback',
          urgency: 0.7
        };
      }
    }

    // Vérifier la progression du mélange
    const progressionRate = this.calculateProgressionRate(steps);
    
    if (progressionRate < 0.2 && steps.length > 10) {
      return {
        needsAdjustment: true,
        reason: 'slow_progression',
        urgency: 0.6
      };
    }

    return { needsAdjustment: false };
  }

  /**
   * Calculer la variance
   */
  private static calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((sum, d) => sum + d, 0) / values.length;
  }

  /**
   * Calculer le taux de progression
   */
  private static calculateProgressionRate(steps: BlendingStep[]): number {
    if (steps.length < 2) return 0;

    const progressions = [];
    for (let i = 1; i < steps.length; i++) {
      const diff = steps[i].blend_percentage - steps[i-1].blend_percentage;
      progressions.push(diff);
    }

    return progressions.reduce((sum, p) => sum + Math.abs(p), 0) / progressions.length;
  }

  /**
   * Générer un ajustement de stratégie
   */
  private static async generateStrategyAdjustment(
    sessionId: string,
    analysis: any
  ): Promise<{ strategy: MixingStrategy; reason: string }> {
    const { data } = await supabase.functions.invoke('adjust-mixing-strategy', {
      body: { sessionId, analysis }
    });

    if (data?.strategy) {
      return {
        strategy: data.strategy,
        reason: data.reason || 'Ajustement automatique'
      };
    }

    // Stratégie d'ajustement par défaut
    let newAlgorithm: 'gradual' | 'instant' | 'oscillating' | 'layered' = 'gradual';
    let reason = 'Ajustement standard';

    if (analysis.reason === 'high_instability') {
      newAlgorithm = 'gradual';
      reason = 'Ralentissement pour plus de stabilité';
    } else if (analysis.reason === 'slow_progression') {
      newAlgorithm = 'layered';
      reason = 'Accélération du processus';
    } else if (analysis.reason === 'poor_user_feedback') {
      newAlgorithm = 'oscillating';
      reason = 'Changement d\'approche thérapeutique';
    }

    return {
      strategy: {
        algorithm: newAlgorithm,
        transition_time: 200,
        blending_ratio: [0.5, 0.5],
        therapeutic_focus: ['stability', 'comfort']
      },
      reason
    };
  }

  /**
   * Obtenir le profil émotionnel de l'utilisateur
   */
  private static async getUserEmotionalProfile(userId: string): Promise<any> {
    const { data } = await supabase
      .from('user_emotional_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    return data || {
      baseline_emotions: ['neutral'],
      responsiveness: 0.7,
      preferred_transitions: 'gradual'
    };
  }

  /**
   * Obtenir la couleur d'une émotion
   */
  private static getEmotionColor(emotion: string): string {
    const colorMap: Record<string, string> = {
      joy: '#FFD700',
      calm: '#87CEEB',
      energy: '#FF4500',
      peace: '#90EE90',
      focus: '#4169E1',
      anxiety: '#FF6B6B',
      sadness: '#6495ED',
      anger: '#DC143C',
      neutral: '#CCCCCC'
    };

    return colorMap[emotion.toLowerCase()] || '#CCCCCC';
  }

  /**
   * Compléter une session avec analyse finale
   */
  static async completeSessionWithAnalysis(
    sessionId: string,
    completion: {
      durationSeconds: number;
      finalEmotions?: EmotionComponent[];
      userSatisfaction?: number;
    }
  ): Promise<{
    finalBlend: EmotionBlend;
    therapeuticReport: any;
    achievementsUnlocked: string[];
  }> {
    const { data: session } = await supabase
      .from('mood_mixer_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (!session) throw new Error('Session not found');

    const finalBlend = this.analyzeFinalBlend(
      session.initial_emotions,
      completion.finalEmotions || session.initial_emotions,
      session.blending_steps
    );

    const effectiveness = this.calculateTherapeuticEffectiveness(
      session.initial_emotions,
      finalBlend,
      session.blending_steps
    );

    const achievements = this.calculateAchievements(session, finalBlend);

    await supabase
      .from('mood_mixer_sessions')
      .update({
        duration_seconds: completion.durationSeconds,
        final_result: finalBlend,
        therapeutic_effectiveness: effectiveness,
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    const { data } = await supabase.functions.invoke('mood-mixer-report', {
      body: {
        sessionId,
        finalBlend,
        satisfaction: completion.userSatisfaction
      }
    });

    return {
      finalBlend,
      therapeuticReport: data?.report || {},
      achievementsUnlocked: achievements
    };
  }

  /**
   * Analyser le mélange final
   */
  private static analyzeFinalBlend(
    initial: EmotionComponent[],
    final: EmotionComponent[],
    steps: BlendingStep[]
  ): EmotionBlend {
    const dominantEmotion = final.reduce((max, e) => 
      e.intensity > max.intensity ? e : max
    , final[0]);

    const secondaryEmotions = final
      .filter(e => e.emotion !== dominantEmotion.emotion && e.intensity > 0.3)
      .map(e => e.emotion);

    const totalIntensity = final.reduce((sum, e) => sum + e.intensity, 0);
    const avgIntensity = totalIntensity / final.length;

    const stability = this.calculateFinalStability(steps);
    const therapeutic = this.calculateTherapeuticOutcome(initial, final);

    return {
      dominant_emotion: dominantEmotion.emotion,
      secondary_emotions: secondaryEmotions,
      intensity_level: avgIntensity,
      stability_score: stability,
      therapeutic_outcome: therapeutic
    };
  }

  /**
   * Calculer la stabilité finale
   */
  private static calculateFinalStability(steps: BlendingStep[]): number {
    if (steps.length < 3) return 0.5;

    const finalSteps = steps.slice(-10);
    const intensityVariances = finalSteps.map(step => {
      const intensities = step.emotions_active.map(e => e.intensity);
      return this.calculateVariance(intensities);
    });

    const avgVariance = intensityVariances.reduce((sum, v) => sum + v, 0) / intensityVariances.length;
    return Math.max(0, 1 - avgVariance);
  }

  /**
   * Calculer l'efficacité thérapeutique
   */
  private static calculateTherapeuticEffectiveness(
    initial: EmotionComponent[],
    final: EmotionBlend,
    steps: BlendingStep[]
  ): number {
    const initialAvgValue = initial.reduce((sum, e) => sum + e.therapeutic_value, 0) / initial.length;
    const improvement = final.therapeutic_outcome - initialAvgValue;

    const smoothness = this.calculateProcessSmoothness(steps);
    const stability = final.stability_score;

    return (improvement * 0.5 + smoothness * 0.25 + stability * 0.25);
  }

  /**
   * Calculer la fluidité du processus
   */
  private static calculateProcessSmoothness(steps: BlendingStep[]): number {
    if (steps.length < 2) return 1;

    let totalChange = 0;
    for (let i = 1; i < steps.length; i++) {
      const diff = Math.abs(steps[i].blend_percentage - steps[i-1].blend_percentage);
      totalChange += diff;
    }

    const avgChange = totalChange / (steps.length - 1);
    return Math.max(0, 1 - (avgChange / 50)); // Normaliser
  }

  /**
   * Calculer le résultat thérapeutique
   */
  private static calculateTherapeuticOutcome(
    initial: EmotionComponent[],
    final: EmotionComponent[]
  ): number {
    const initialValue = initial.reduce((sum, e) => sum + e.therapeutic_value * e.intensity, 0) / initial.length;
    const finalValue = final.reduce((sum, e) => sum + e.therapeutic_value * e.intensity, 0) / final.length;

    return Math.min(1, Math.max(0, finalValue));
  }

  /**
   * Calculer les achievements
   */
  private static calculateAchievements(
    session: MoodMixerSession,
    finalBlend: EmotionBlend
  ): string[] {
    const achievements: string[] = [];

    if (session.blending_steps.length >= 20) achievements.push('MASTER_MIXER');
    if (finalBlend.stability_score >= 0.9) achievements.push('EMOTIONAL_BALANCE');
    if (finalBlend.therapeutic_outcome >= 0.85) achievements.push('HEALING_BLEND');
    
    const complexityScore = session.initial_emotions.length;
    if (complexityScore >= 5) achievements.push('COMPLEXITY_MASTER');

    return achievements;
  }

  /**
   * Récupérer l'historique enrichi
   */
  static async fetchHistory(userId: string, limit: number = 20): Promise<MoodMixerSession[]> {
    const { data, error } = await supabase
      .from('mood_mixer_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Obtenir les statistiques de mélange
   */
  static async getMixingStats(userId: string): Promise<{
    totalSessions: number;
    averageStability: number;
    therapeuticProgress: number;
    favoriteEmotions: string[];
    masteryLevel: number;
    unlockedAchievements: string[];
  }> {
    const history = await this.fetchHistory(userId, 100);

    const avgStability = history
      .filter(s => s.final_result)
      .reduce((sum, s) => sum + (s.final_result.stability_score || 0), 0) / history.length;

    const avgTherapeutic = history
      .filter(s => s.therapeutic_effectiveness)
      .reduce((sum, s) => sum + (s.therapeutic_effectiveness || 0), 0) / history.length;

    const emotionCounts: Record<string, number> = {};
    history.forEach(session => {
      session.initial_emotions.forEach(e => {
        emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
      });
    });

    const favoriteEmotions = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([emotion]) => emotion);

    const masteryLevel = Math.min(10, Math.floor(history.length / 10) + Math.floor(avgStability * 5));

    return {
      totalSessions: history.length,
      averageStability: avgStability,
      therapeuticProgress: avgTherapeutic,
      favoriteEmotions,
      masteryLevel,
      unlockedAchievements: []
    };
  }
}
