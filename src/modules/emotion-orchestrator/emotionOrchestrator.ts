/**
 * Module EmotionOrchestrator - Service principal
 * Orchestration intelligente des modules basée sur l'état émotionnel
 *
 * @module emotion-orchestrator
 */

import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type {
  EmotionalState,
  UserContext,
  ModuleRecommendation,
  OrchestrationResponse,
  RecommendationFeedback,
  RecommendationStats,
  ModuleType,
  RecommendationReason,
} from './types';

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Mapping émotion → modules recommandés
 */
const EMOTION_MODULE_MAP: Record<string, ModuleType[]> = {
  // Émotions négatives - Respiration & musique thérapeutique
  anxious: ['breath', 'bubble-beat', 'adaptive-music', 'screen-silk'],
  stressed: ['breath-constellation', 'breathing-vr', 'music-therapy', 'flash-glow'],
  sad: ['music-therapy', 'mood-mixer', 'ai-coach', 'community'],
  angry: ['breath', 'bubble-beat', 'screen-silk', 'bounce-back'],
  frustrated: ['breath-constellation', 'ai-coach', 'ambition', 'boss-grit'],

  // Émotions neutres - Engagement & exploration
  neutral: ['dashboard', 'ambition', 'activities', 'community'],
  calm: ['journal', 'mood-mixer', 'ar-filters', 'achievements'],
  focused: ['ambition', 'ambition-arcade', 'boss-grit', 'audio-studio'],

  // Émotions positives - Engagement social & créatif
  happy: ['community', 'mood-mixer', 'ambition-arcade', 'achievements'],
  excited: ['ambition', 'boss-grit', 'audio-studio', 'ar-filters'],
  content: ['journal', 'activities', 'community', 'achievements'],
  peaceful: ['mood-mixer', 'ar-filters', 'journal', 'flash-glow'],
};

/**
 * Durée suggérée par intensité émotionnelle
 */
const INTENSITY_DURATION_MAP = {
  low: 5,      // 5 min
  medium: 10,  // 10 min
  high: 15,    // 15 min
  extreme: 20, // 20 min
};

/**
 * Modules par catégorie thérapeutique
 */
const THERAPEUTIC_CATEGORIES: Record<string, ModuleType[]> = {
  stress_relief: ['breath', 'breath-constellation', 'breathing-vr', 'bubble-beat'],
  mood_enhancement: ['music-therapy', 'mood-mixer', 'adaptive-music', 'audio-studio'],
  emotional_support: ['ai-coach', 'coach', 'community', 'journal'],
  engagement: ['ambition', 'ambition-arcade', 'boss-grit', 'bounce-back'],
  wellbeing: ['screen-silk', 'flash-glow', 'ar-filters', 'activities'],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Détermine l'intensité émotionnelle
 */
function getIntensityLevel(score: number): 'low' | 'medium' | 'high' | 'extreme' {
  if (score < 0.3) return 'low';
  if (score < 0.6) return 'medium';
  if (score < 0.8) return 'high';
  return 'extreme';
}

/**
 * Obtient l'heure de la journée
 */
function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

/**
 * Calcule le score de pertinence pour un module
 */
function calculateRelevanceScore(
  module: ModuleType,
  _emotionalState: EmotionalState,
  context: UserContext,
  reasons: RecommendationReason[]
): number {
  let score = 0;

  // Poids des raisons
  const weights = {
    emotional_match: 0.35,
    therapeutic_benefit: 0.25,
    user_preference: 0.20,
    contextual_fit: 0.10,
    goal_alignment: 0.05,
    pattern_based: 0.03,
    diversity: 0.02,
  };

  // Calculer le score basé sur les raisons
  reasons.forEach(reason => {
    score += reason.confidence * (weights[reason.type] || 0.01);
  });

  // Bonus si module préféré
  if (context.preferences?.preferred_modules?.includes(module)) {
    score += 0.15;
  }

  // Pénalité si module évité
  if (context.preferences?.avoided_modules?.includes(module)) {
    score -= 0.3;
  }

  // Pénalité si utilisé récemment (pour diversité)
  if (context.recent_modules_used?.includes(module)) {
    score -= 0.1;
  }

  return Math.max(0, Math.min(1, score));
}

/**
 * Génère les raisons pour une recommandation
 */
function generateReasons(
  module: ModuleType,
  emotionalState: EmotionalState,
  context: UserContext
): RecommendationReason[] {
  const reasons: RecommendationReason[] = [];
  const dominantEmotion = emotionalState.dominant.emotion.toLowerCase();

  // Raison 1: Correspondance émotionnelle
  const emotionModules = EMOTION_MODULE_MAP[dominantEmotion] || [];
  if (emotionModules.includes(module)) {
    reasons.push({
      type: 'emotional_match',
      explanation: `Ce module est particulièrement efficace pour l'état émotionnel "${dominantEmotion}"`,
      confidence: emotionalState.dominant.confidence,
    });
  }

  // Raison 2: Bénéfice thérapeutique
  const therapeuticMatch = Object.entries(THERAPEUTIC_CATEGORIES).find(([_, modules]) =>
    modules.includes(module)
  );
  if (therapeuticMatch) {
    reasons.push({
      type: 'therapeutic_benefit',
      explanation: `Bénéfices thérapeutiques: ${therapeuticMatch[0].replace('_', ' ')}`,
      confidence: 0.85,
    });
  }

  // Raison 3: Préférence utilisateur
  if (context.preferences?.preferred_modules?.includes(module)) {
    reasons.push({
      type: 'user_preference',
      explanation: 'Basé sur vos préférences personnelles',
      confidence: 0.95,
    });
  }

  // Raison 4: Contexte temporel
  const timeOfDay = context.time_of_day || getTimeOfDay();
  if (timeOfDay === 'night' && ['breath', 'breathing-vr', 'screen-silk'].includes(module)) {
    reasons.push({
      type: 'contextual_fit',
      explanation: 'Recommandé pour la soirée - aide à la détente',
      confidence: 0.75,
    });
  } else if (timeOfDay === 'morning' && ['ambition', 'boss-grit', 'activities'].includes(module)) {
    reasons.push({
      type: 'contextual_fit',
      explanation: 'Recommandé pour le matin - boost de motivation',
      confidence: 0.75,
    });
  }

  // Raison 5: Alignement avec objectifs
  if (context.current_goals && context.current_goals.length > 0) {
    const goalKeywords = context.current_goals.join(' ').toLowerCase();
    if (goalKeywords.includes('stress') && THERAPEUTIC_CATEGORIES.stress_relief.includes(module)) {
      reasons.push({
        type: 'goal_alignment',
        explanation: 'Aligné avec vos objectifs de gestion du stress',
        confidence: 0.80,
      });
    }
  }

  // Raison 6: Diversité
  if (!context.recent_modules_used?.includes(module)) {
    reasons.push({
      type: 'diversity',
      explanation: 'Nouvelle expérience pour varier votre pratique',
      confidence: 0.60,
    });
  }

  return reasons;
}

/**
 * Génère la configuration suggérée pour un module
 */
function generateModuleConfig(
  module: ModuleType,
  emotionalState: EmotionalState,
  context: UserContext
): Record<string, unknown> {
  const intensity = getIntensityLevel(emotionalState.intensityScore);
  const config: Record<string, unknown> = {};

  // Configuration par module
  switch (module) {
    case 'breath':
    case 'bubble-beat':
    case 'breath-constellation':
      config.breathing_pattern = intensity === 'high' || intensity === 'extreme' ? 'deep' : 'balanced';
      config.pace = intensity === 'low' ? 'slow' : 'moderate';
      break;

    case 'music-therapy':
    case 'adaptive-music':
    case 'mood-mixer':
      config.mood = emotionalState.dominant.emotion;
      config.intensity = emotionalState.intensityScore;
      config.target_mood = emotionalState.sentiment === 'negative' ? 'calm' : 'uplifted';
      break;

    case 'ai-coach':
    case 'coach':
      config.focus_area = emotionalState.sentiment === 'negative' ? 'emotional_support' : 'motivation';
      config.session_type = 'guided';
      break;

    case 'screen-silk':
    case 'flash-glow':
      config.pattern_complexity = intensity === 'high' ? 'simple' : 'moderate';
      config.therapeutic_intensity = emotionalState.intensityScore;
      break;

    case 'ambition':
    case 'ambition-arcade':
      config.difficulty = context.preferences?.difficulty_level || 'intermediate';
      config.mode = emotionalState.sentiment === 'positive' ? 'arcade' : 'standard';
      break;
  }

  // Durée suggérée
  config.duration = INTENSITY_DURATION_MAP[intensity];

  return config;
}

// ============================================================================
// MAIN SERVICE
// ============================================================================

/**
 * Service d'orchestration des émotions
 */
export class EmotionOrchestrator {
  /**
   * Génère des recommandations de modules basées sur l'état émotionnel
   */
  async generateRecommendations(
    emotionalState: EmotionalState,
    context: UserContext
  ): Promise<OrchestrationResponse> {
    const now = new Date().toISOString();
    const dominantEmotion = emotionalState.dominant.emotion.toLowerCase();

    // Obtenir les modules candidats
    const candidateModules = EMOTION_MODULE_MAP[dominantEmotion] ||
                             EMOTION_MODULE_MAP['neutral'] ||
                             ['dashboard', 'activities'];

    // Ajouter des modules complémentaires basés sur le sentiment
    if (emotionalState.sentiment === 'negative') {
      candidateModules.push(...THERAPEUTIC_CATEGORIES.stress_relief.slice(0, 2));
      candidateModules.push(...THERAPEUTIC_CATEGORIES.emotional_support.slice(0, 2));
    } else if (emotionalState.sentiment === 'positive') {
      candidateModules.push(...THERAPEUTIC_CATEGORIES.engagement.slice(0, 2));
      candidateModules.push(...THERAPEUTIC_CATEGORIES.wellbeing.slice(0, 2));
    }

    // Dédupliquer et limiter à 8 modules max
    const uniqueModules = Array.from(new Set(candidateModules)).slice(0, 8);

    // Générer les recommandations
    const recommendations: ModuleRecommendation[] = uniqueModules.map(module => {
      const reasons = generateReasons(module, emotionalState, context);
      const relevanceScore = calculateRelevanceScore(module, emotionalState, context, reasons);
      const config = generateModuleConfig(module, emotionalState, context);

      return {
        id: uuidv4(),
        module,
        priority: 0, // Will be set after sorting
        relevance_score: relevanceScore,
        reasons,
        suggested_duration: config.duration as number,
        suggested_config: config,
        expected_benefits: this.getExpectedBenefits(module, emotionalState),
        timestamp: now,
      };
    });

    // Trier par score de pertinence et assigner les priorités
    recommendations.sort((a, b) => b.relevance_score - a.relevance_score);
    recommendations.forEach((rec, index) => {
      rec.priority = index;
    });

    // Générer les insights
    const insights = this.generateInsights(emotionalState, context);

    // Générer les actions immédiates
    const immediateActions = this.generateImmediateActions(emotionalState);

    // Générer les stratégies long terme
    const longTermStrategies = this.generateLongTermStrategies(emotionalState, context);

    return {
      emotional_state: emotionalState,
      user_context: context,
      recommendations,
      immediate_actions: immediateActions,
      long_term_strategies: longTermStrategies,
      insights,
      timestamp: now,
    };
  }

  /**
   * Obtient les bénéfices attendus d'un module
   */
  private getExpectedBenefits(module: ModuleType, _emotionalState: EmotionalState): string[] {
    const benefits: string[] = [];

    // Bénéfices par catégorie
    if (THERAPEUTIC_CATEGORIES.stress_relief.includes(module)) {
      benefits.push('Réduction du stress et de l\'anxiété');
      benefits.push('Amélioration de la respiration');
    }

    if (THERAPEUTIC_CATEGORIES.mood_enhancement.includes(module)) {
      benefits.push('Amélioration de l\'humeur');
      benefits.push('Stimulation émotionnelle positive');
    }

    if (THERAPEUTIC_CATEGORIES.emotional_support.includes(module)) {
      benefits.push('Support émotionnel personnalisé');
      benefits.push('Développement de la résilience');
    }

    if (THERAPEUTIC_CATEGORIES.engagement.includes(module)) {
      benefits.push('Renforcement de la motivation');
      benefits.push('Atteinte des objectifs personnels');
    }

    if (THERAPEUTIC_CATEGORIES.wellbeing.includes(module)) {
      benefits.push('Amélioration du bien-être général');
      benefits.push('Relaxation et apaisement');
    }

    return benefits.slice(0, 3); // Max 3 bénéfices
  }

  /**
   * Génère des insights sur l'état émotionnel
   */
  private generateInsights(
    emotionalState: EmotionalState,
    context: UserContext
  ): OrchestrationResponse['insights'] {
    const insights: OrchestrationResponse['insights'] = {
      notes: [],
    };

    // Analyser le pattern émotionnel
    if (context.emotion_history && context.emotion_history.length >= 3) {
      const recentEmotions = context.emotion_history.slice(0, 3);
      const sentiments = recentEmotions.map(e => e.sentiment);

      if (sentiments.every(s => s === 'negative')) {
        insights.emotional_pattern = 'Tendance négative persistante';
        insights.trend = 'declining';
        insights.risk_level = 'medium';
      } else if (sentiments.every(s => s === 'positive')) {
        insights.emotional_pattern = 'Tendance positive stable';
        insights.trend = 'improving';
        insights.risk_level = 'low';
      } else {
        insights.emotional_pattern = 'État émotionnel variable';
        insights.trend = 'stable';
        insights.risk_level = 'low';
      }
    }

    // Notes spécifiques
    if (emotionalState.intensityScore > 0.75) {
      insights.notes?.push('Intensité émotionnelle élevée détectée');
    }

    if (emotionalState.dominant.confidence > 0.9) {
      insights.notes?.push('Détection émotionnelle très fiable');
    }

    return insights;
  }

  /**
   * Génère des actions immédiates suggérées
   */
  private generateImmediateActions(emotionalState: EmotionalState): string[] {
    const actions: string[] = [];
    const intensity = getIntensityLevel(emotionalState.intensityScore);

    if (emotionalState.sentiment === 'negative') {
      if (intensity === 'high' || intensity === 'extreme') {
        actions.push('Prendre 5 respirations profondes');
        actions.push('Trouver un espace calme');
        actions.push('Commencer une session de respiration guidée');
      } else {
        actions.push('Écouter de la musique apaisante');
        actions.push('Pratiquer quelques minutes de respiration consciente');
      }
    } else if (emotionalState.sentiment === 'positive') {
      actions.push('Capturer ce moment dans votre journal');
      actions.push('Partager votre énergie positive avec la communauté');
      actions.push('Travailler sur vos objectifs personnels');
    }

    return actions;
  }

  /**
   * Génère des stratégies long terme
   */
  private generateLongTermStrategies(
    emotionalState: EmotionalState,
    context: UserContext
  ): string[] {
    const strategies: string[] = [];

    if (emotionalState.sentiment === 'negative') {
      strategies.push('Établir une routine de respiration quotidienne');
      strategies.push('Tenir un journal émotionnel régulier');
      strategies.push('Consulter un coach pour un support personnalisé');
    }

    if (context.emotion_history && context.emotion_history.length >= 5) {
      strategies.push('Analyser vos patterns émotionnels hebdomadaires');
      strategies.push('Identifier vos déclencheurs émotionnels');
    }

    strategies.push('Continuer à utiliser les modules recommandés régulièrement');
    strategies.push('Fixer des objectifs de bien-être mesurables');

    return strategies.slice(0, 4);
  }

  /**
   * Enregistre le feedback sur une recommandation
   */
  async submitFeedback(feedback: RecommendationFeedback): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('module_recommendation_feedback')
        .insert({
          user_id: feedback.user_id,
          recommendation_id: feedback.recommendation_id,
          module_type: feedback.recommendation_id.split('-')[0], // Extract module type from recommendation
          was_helpful: undefined, // Not in RecommendationFeedback type
          was_followed: feedback.was_followed,
          satisfaction_rating: feedback.satisfaction_rating,
          perceived_benefit: feedback.perceived_benefit,
          actual_duration: feedback.actual_duration,
          comments: feedback.comments,
          timestamp: feedback.timestamp,
        });

      if (error) {
        logger.error('Failed to save feedback:', error, 'MODULE');
        return false;
      }

      return true;
    } catch (err) {
      logger.error('Error submitting feedback:', err, 'MODULE');
      return false;
    }
  }

  /**
   * Obtient les statistiques d'efficacité des recommandations
   */
  async getStats(
    userId: string,
    module: ModuleType,
    startDate: Date,
    endDate: Date
  ): Promise<RecommendationStats> {
    try {
      const { data, error } = await supabase
        .from('module_recommendation_feedback')
        .select('*')
        .eq('user_id', userId)
        .eq('module_type', module)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) {
        logger.error('Failed to fetch stats:', error, 'MODULE');
        return {
          user_id: userId,
          module,
          total_recommendations: 0,
          follow_through_rate: 0,
          period_start: startDate.toISOString(),
          period_end: endDate.toISOString(),
        };
      }

      const totalRecommendations = data?.length || 0;
      const followedCount = data?.filter((f) => f.was_followed).length || 0;
      const followThroughRate =
        totalRecommendations > 0 ? (followedCount / totalRecommendations) * 100 : 0;

      return {
        user_id: userId,
        module,
        total_recommendations: totalRecommendations,
        follow_through_rate: followThroughRate,
        period_start: startDate.toISOString(),
        period_end: endDate.toISOString(),
      };
    } catch (err) {
      logger.error('Error fetching stats:', err, 'MODULE');
      return {
        user_id: userId,
        module,
        total_recommendations: 0,
        follow_through_rate: 0,
        period_start: startDate.toISOString(),
        period_end: endDate.toISOString(),
      };
    }
  }
}

// Export singleton instance
export const emotionOrchestrator = new EmotionOrchestrator();
