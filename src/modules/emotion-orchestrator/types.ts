/**
 * Module EmotionOrchestrator - Types
 * Types pour l'orchestration intelligente des modules basée sur l'état émotionnel
 *
 * @module emotion-orchestrator/types
 */

import { z } from 'zod';

// ============================================================================
// EMOTIONAL STATE
// ============================================================================

/**
 * État émotionnel détecté via scan multimodal
 */
export const EmotionalState = z.object({
  // Émotion dominante
  dominant: z.object({
    emotion: z.string(),
    intensity: z.number().min(0).max(1),
    confidence: z.number().min(0).max(1),
  }),

  // Toutes les émotions détectées
  emotions: z.array(z.object({
    emotion: z.string(),
    probability: z.number().min(0).max(1),
    intensity: z.number().min(0).max(1),
  })),

  // Sentiment global
  sentiment: z.enum(['positive', 'negative', 'neutral']),

  // Score d'intensité globale
  intensityScore: z.number().min(0).max(1),

  // Horodatage
  timestamp: z.string().datetime(),

  // Source de détection
  source: z.enum(['text', 'voice', 'facial', 'combined']).optional(),

  // Métadonnées additionnelles
  metadata: z.record(z.unknown()).optional(),
});

export type EmotionalState = z.infer<typeof EmotionalState>;

// ============================================================================
// USER CONTEXT
// ============================================================================

/**
 * Contexte utilisateur pour personnalisation
 */
export const UserContext = z.object({
  user_id: z.string().uuid(),

  // Contexte temporel
  time_of_day: z.enum(['morning', 'afternoon', 'evening', 'night']).optional(),
  day_of_week: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']).optional(),

  // Activités récentes
  recent_activities: z.array(z.string()).optional(),
  recent_modules_used: z.array(z.string()).optional(),

  // Préférences utilisateur
  preferences: z.object({
    preferred_modules: z.array(z.string()).optional(),
    avoided_modules: z.array(z.string()).optional(),
    difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    session_duration_preference: z.enum(['short', 'medium', 'long']).optional(),
  }).optional(),

  // Objectifs actuels
  current_goals: z.array(z.string()).optional(),

  // Historique émotionnel récent
  emotion_history: z.array(EmotionalState).optional(),

  // Métadonnées
  metadata: z.record(z.unknown()).optional(),
});

export type UserContext = z.infer<typeof UserContext>;

// ============================================================================
// MODULE RECOMMENDATIONS
// ============================================================================

/**
 * Type de module disponible
 */
export const ModuleType = z.enum([
  // Respiration
  'breath',
  'breath-constellation',
  'breathing-vr',
  'bubble-beat',

  // Musique
  'adaptive-music',
  'music-therapy',
  'mood-mixer',
  'audio-studio',

  // Coaching
  'ai-coach',
  'coach',

  // Bien-être
  'screen-silk',
  'flash-glow',
  'ar-filters',

  // Engagement
  'ambition',
  'ambition-arcade',
  'boss-grit',
  'bounce-back',

  // Social
  'community',
  'journal',

  // Autre
  'dashboard',
  'activities',
  'achievements',
]);

export type ModuleType = z.infer<typeof ModuleType>;

/**
 * Raison de la recommandation
 */
export const RecommendationReason = z.object({
  // Type de raison
  type: z.enum([
    'emotional_match',      // Correspond à l'état émotionnel
    'therapeutic_benefit',  // Bénéfice thérapeutique prouvé
    'user_preference',      // Préférence utilisateur
    'contextual_fit',       // Adapté au contexte (heure, lieu)
    'goal_alignment',       // Aligné avec objectifs
    'pattern_based',        // Basé sur patterns historiques
    'diversity',            // Pour varier l'expérience
  ]),

  // Explication textuelle
  explanation: z.string(),

  // Score de confiance
  confidence: z.number().min(0).max(1),
});

export type RecommendationReason = z.infer<typeof RecommendationReason>;

/**
 * Recommandation de module
 */
export const ModuleRecommendation = z.object({
  // ID unique de la recommandation
  id: z.string().uuid(),

  // Module recommandé
  module: ModuleType,

  // Priorité (0 = la plus haute)
  priority: z.number().int().min(0),

  // Score de pertinence (0-1)
  relevance_score: z.number().min(0).max(1),

  // Raisons de la recommandation
  reasons: z.array(RecommendationReason),

  // Durée suggérée en minutes
  suggested_duration: z.number().int().min(1).optional(),

  // Configuration suggérée pour le module
  suggested_config: z.record(z.unknown()).optional(),

  // Bénéfices attendus
  expected_benefits: z.array(z.string()).optional(),

  // Horodatage
  timestamp: z.string().datetime(),

  // Métadonnées
  metadata: z.record(z.unknown()).optional(),
});

export type ModuleRecommendation = z.infer<typeof ModuleRecommendation>;

// ============================================================================
// ORCHESTRATION RESPONSE
// ============================================================================

/**
 * Réponse complète de l'orchestrateur
 */
export const OrchestrationResponse = z.object({
  // État émotionnel analysé
  emotional_state: EmotionalState,

  // Contexte utilisateur
  user_context: UserContext,

  // Recommandations de modules (triées par priorité)
  recommendations: z.array(ModuleRecommendation),

  // Actions immédiates suggérées
  immediate_actions: z.array(z.string()).optional(),

  // Stratégies long terme
  long_term_strategies: z.array(z.string()).optional(),

  // Insights générés
  insights: z.object({
    emotional_pattern: z.string().optional(),
    trend: z.enum(['improving', 'stable', 'declining']).optional(),
    risk_level: z.enum(['low', 'medium', 'high']).optional(),
    notes: z.array(z.string()).optional(),
  }).optional(),

  // Horodatage de l'analyse
  timestamp: z.string().datetime(),

  // Métadonnées
  metadata: z.record(z.unknown()).optional(),
});

export type OrchestrationResponse = z.infer<typeof OrchestrationResponse>;

// ============================================================================
// FEEDBACK & LEARNING
// ============================================================================

/**
 * Feedback sur une recommandation
 */
export const RecommendationFeedback = z.object({
  recommendation_id: z.string().uuid(),
  user_id: z.string().uuid(),

  // L'utilisateur a-t-il suivi la recommandation ?
  was_followed: z.boolean(),

  // Note de satisfaction (1-5)
  satisfaction_rating: z.number().int().min(1).max(5).optional(),

  // Amélioration ressentie
  perceived_benefit: z.enum(['none', 'slight', 'moderate', 'significant', 'excellent']).optional(),

  // Durée réelle de la session
  actual_duration: z.number().int().min(0).optional(),

  // Commentaires
  comments: z.string().optional(),

  // Horodatage
  timestamp: z.string().datetime(),

  // Métadonnées
  metadata: z.record(z.unknown()).optional(),
});

export type RecommendationFeedback = z.infer<typeof RecommendationFeedback>;

/**
 * Statistiques d'efficacité des recommandations
 */
export const RecommendationStats = z.object({
  user_id: z.string().uuid(),
  module: ModuleType,

  // Métriques
  total_recommendations: z.number().int().min(0),
  follow_through_rate: z.number().min(0).max(1),
  average_satisfaction: z.number().min(1).max(5).optional(),
  average_benefit: z.number().min(0).max(1).optional(),

  // Efficacité par contexte
  effectiveness_by_emotion: z.record(z.number()).optional(),
  effectiveness_by_time: z.record(z.number()).optional(),

  // Période
  period_start: z.string().datetime(),
  period_end: z.string().datetime(),

  // Métadonnées
  metadata: z.record(z.unknown()).optional(),
});

export type RecommendationStats = z.infer<typeof RecommendationStats>;
