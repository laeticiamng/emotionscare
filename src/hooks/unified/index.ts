/**
 * Unified Hooks - Hooks consolidés pour architecture optimisée
 * Point d'entrée unique pour les hooks unifiés
 */

// Mood Management (consolide 5+ hooks)
export { 
  useMoodUnified, 
  useUnifiedMoodStore,
  type MoodState,
  type MoodEntry,
  type SessionState,
  type MoodStats,
} from './useMoodUnified';

// AI Router (orchestration proactive)
export { 
  useAIRouter,
  type ModuleType,
  type UserContext,
  type AIRecommendation,
  type AIRouterState,
} from './useAIRouter';
