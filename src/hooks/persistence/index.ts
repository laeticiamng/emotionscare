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

// Hook d'historique unifié
export { useSessionHistory } from '../useSessionHistory';
export type { 
  ModuleType, 
  SessionHistoryEntry, 
  SessionHistoryStats,
  CreateSessionParams 
} from '../useSessionHistory';

// Hooks gamification
export { useUserBadges, AVAILABLE_BADGES } from '../useUserBadges';
export { useGlobalLeaderboard } from '../useGlobalLeaderboard';
export { useRealtimeLeaderboard } from '../useRealtimeLeaderboard';
export type { LeaderboardEntry } from '../useRealtimeLeaderboard';
export { useDailyChallenges } from '../useDailyChallenges';

// Hooks statistiques
export { useWeeklyProgress } from '../useWeeklyProgress';
export type { WeeklyProgress } from '../useWeeklyProgress';
export { useStreakTracker } from '../useStreakTracker';
export type { StreakData } from '../useStreakTracker';
export { useUserConsolidatedStats } from '../useUserConsolidatedStats';

// Hook d'intégration modules
export { useModuleIntegration } from '../useModuleIntegration';

// Re-export SessionFeedback
export { SessionFeedback } from '@/components/feedback/SessionFeedback';
export type { FeedbackData } from '@/components/feedback/SessionFeedback';
