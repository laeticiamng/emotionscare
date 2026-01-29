/**
 * Boss Level Grit Components - Unified Exports
 * Consolidation de boss-grit/ et boss-level-grit/
 */

// Composants originaux boss-level-grit
export { default as ChallengeCard } from './ChallengeCard';
export { default as ActiveSession } from './ActiveSession';
export { default as ProgressStats } from './ProgressStats';
export { default as AchievementsList } from './AchievementsList';

// Composants migrés de boss-grit/
export { ChallengeCard as BossGritChallengeCard } from './BossGritChallengeCard';
export type { Challenge } from './BossGritChallengeCard';

export { QuestPanel } from './BossGritQuestPanel';
export type { Quest, QuestTask } from './BossGritQuestPanel';

export { PlayerStats } from './BossGritPlayerStats';
export type { PlayerStatsData } from './BossGritPlayerStats';

export { QuestComplete } from './BossGritQuestComplete';
