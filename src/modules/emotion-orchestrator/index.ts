/**
 * Module EmotionOrchestrator - Point d'entrée
 * Orchestration intelligente des modules basée sur l'état émotionnel
 *
 * @module emotion-orchestrator
 */

// ============================================================================
// SERVICE
// ============================================================================

export {
  EmotionOrchestrator,
  emotionOrchestrator,
} from './emotionOrchestrator';

// ============================================================================
// HOOKS
// ============================================================================

export {
  useEmotionOrchestrator,
} from './useEmotionOrchestrator';

// ============================================================================
// TYPES
// ============================================================================

export type {
  EmotionalState,
  UserContext,
  ModuleType,
  RecommendationReason,
  ModuleRecommendation,
  OrchestrationResponse,
  RecommendationFeedback,
  RecommendationStats,
} from './types';

// ============================================================================
// SCHEMAS (pour validation Zod)
// ============================================================================

export {
  EmotionalState as EmotionalStateSchema,
  UserContext as UserContextSchema,
  ModuleType as ModuleTypeSchema,
  RecommendationReason as RecommendationReasonSchema,
  ModuleRecommendation as ModuleRecommendationSchema,
  OrchestrationResponse as OrchestrationResponseSchema,
  RecommendationFeedback as RecommendationFeedbackSchema,
  RecommendationStats as RecommendationStatsSchema,
} from './types';

// Export default
export { emotionOrchestrator as default } from './emotionOrchestrator';
