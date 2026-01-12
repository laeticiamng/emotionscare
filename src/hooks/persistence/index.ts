/**
 * Index des hooks de persistance EmotionsCare
 * Export centralisé pour faciliter les imports
 */

// Hooks de persistance par module
export { useFlashGlowPersistence } from '../useFlashGlowPersistence';
export { useBubbleBeatPersistence } from '../useBubbleBeatPersistence';
export { useMoodMixerPersistence } from '../useMoodMixerPersistence';
export { useBossGritPersistence } from '../useBossGritPersistence';
export { useStorySynthPersistence } from '../useStorySynthPersistence';

// Hooks gamification
export { useUserBadges, AVAILABLE_BADGES } from '../useUserBadges';
export { useGlobalLeaderboard } from '../useGlobalLeaderboard';
export { useRealtimeLeaderboard } from '../useRealtimeLeaderboard';
export { useDailyChallenges } from '../useDailyChallenges';

// Hooks statistiques
export { useWeeklyProgress } from '../useWeeklyProgress';
export { useStreakTracker } from '../useStreakTracker';
export { useUserConsolidatedStats } from '../useUserConsolidatedStats';

// Hook d'intégration modules
export { useModuleIntegration } from '../useModuleIntegration';
