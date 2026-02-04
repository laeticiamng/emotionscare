/**
 * Gamification Types - EmotionsCare Platform
 * Types complets pour le système de gamification
 */

// ============================================================================
// XP & LEVELS
// ============================================================================

export interface XPEvent {
  id: string;
  user_id: string;
  action: XPAction;
  amount: number;
  multiplier: number;
  source: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export type XPAction = 
  | 'journal_entry'
  | 'scan_complete'
  | 'breath_session'
  | 'meditation_complete'
  | 'challenge_complete'
  | 'daily_login'
  | 'streak_bonus'
  | 'guild_contribution'
  | 'tournament_win'
  | 'badge_unlock'
  | 'achievement_complete'
  | 'referral_bonus'
  | 'community_post'
  | 'community_reaction';

export interface LevelConfig {
  level: number;
  xp_required: number;
  title: string;
  perks: string[];
  badge_id?: string;
}

export interface UserLevel {
  user_id: string;
  level: number;
  current_xp: number;
  xp_to_next: number;
  total_xp: number;
  title: string;
  progress_percent: number;
}

// ============================================================================
// BADGES & ACHIEVEMENTS
// ============================================================================

export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type BadgeCategory = 
  | 'journal'
  | 'meditation'
  | 'breath'
  | 'scan'
  | 'streak'
  | 'social'
  | 'challenge'
  | 'special'
  | 'seasonal';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  category: BadgeCategory;
  xp_reward: number;
  unlock_condition: BadgeCondition;
  is_hidden: boolean;
  created_at: string;
}

export interface BadgeCondition {
  type: 'count' | 'streak' | 'time' | 'achievement' | 'custom';
  action?: XPAction;
  target: number;
  custom_check?: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  badge: Badge;
  unlocked_at: string;
  notified: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  tiers: AchievementTier[];
  is_repeatable: boolean;
}

export interface AchievementTier {
  tier: number;
  name: string;
  target: number;
  xp_reward: number;
  badge_id?: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  achievement: Achievement;
  current_tier: number;
  progress: number;
  completed_at?: string;
}

// ============================================================================
// STREAKS
// ============================================================================

export interface StreakData {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  streak_type: StreakType;
  freeze_available: number;
  freeze_used_today: boolean;
}

export type StreakType = 'daily' | 'weekly';

export interface StreakReward {
  day: number;
  xp_bonus: number;
  badge_id?: string;
  special_reward?: string;
}

// ============================================================================
// LEADERBOARDS
// ============================================================================

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'all_time' | 'season';
export type LeaderboardMetric = 'xp' | 'streak' | 'activities' | 'harmony' | 'badges';

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  score: number;
  level: number;
  badge_count: number;
  trend: 'up' | 'down' | 'stable';
  trend_change: number;
}

export interface LeaderboardConfig {
  id: string;
  name: string;
  metric: LeaderboardMetric;
  period: LeaderboardPeriod;
  min_level?: number;
  guild_only?: boolean;
  rewards: LeaderboardReward[];
}

export interface LeaderboardReward {
  rank_start: number;
  rank_end: number;
  xp_reward: number;
  badge_id?: string;
  title?: string;
}

// ============================================================================
// CHALLENGES
// ============================================================================

export type ChallengeType = 'daily' | 'weekly' | 'special' | 'seasonal' | 'guild';
export type ChallengeStatus = 'active' | 'completed' | 'failed' | 'expired';

export interface Challenge {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: ChallengeType;
  target: ChallengeTarget;
  xp_reward: number;
  badge_id?: string;
  starts_at: string;
  ends_at: string;
  participants_count: number;
  completions_count: number;
}

export interface ChallengeTarget {
  action: XPAction;
  count: number;
  min_duration?: number;
  specific_activity?: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  challenge: Challenge;
  progress: number;
  status: ChallengeStatus;
  started_at: string;
  completed_at?: string;
}

// ============================================================================
// SEASONS
// ============================================================================

export interface Season {
  id: string;
  name: string;
  theme: string;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  rewards: SeasonReward[];
  pass_price?: number;
}

export interface SeasonReward {
  level: number;
  xp_required: number;
  free_reward?: SeasonRewardItem;
  premium_reward?: SeasonRewardItem;
}

export interface SeasonRewardItem {
  type: 'xp' | 'badge' | 'title' | 'cosmetic';
  value: string | number;
  name: string;
  icon: string;
}

export interface UserSeasonProgress {
  user_id: string;
  season_id: string;
  current_level: number;
  current_xp: number;
  has_premium_pass: boolean;
  claimed_rewards: number[];
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export type GamificationNotificationType = 
  | 'xp_earned'
  | 'level_up'
  | 'badge_unlocked'
  | 'achievement_progress'
  | 'achievement_complete'
  | 'streak_milestone'
  | 'challenge_complete'
  | 'leaderboard_rank'
  | 'season_reward';

export interface GamificationNotification {
  id: string;
  user_id: string;
  type: GamificationNotificationType;
  title: string;
  message: string;
  icon: string;
  data: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

// ============================================================================
// STORE STATE
// ============================================================================

export interface GamificationState {
  userLevel: UserLevel | null;
  badges: UserBadge[];
  achievements: UserAchievement[];
  streak: StreakData | null;
  activeChallenges: UserChallenge[];
  leaderboardPosition: number | null;
  notifications: GamificationNotification[];
  isLoading: boolean;
  error: string | null;
}

export interface GamificationActions {
  fetchUserProgress: () => Promise<void>;
  fetchBadges: () => Promise<void>;
  fetchAchievements: () => Promise<void>;
  fetchChallenges: () => Promise<void>;
  claimReward: (rewardId: string) => Promise<boolean>;
  markNotificationRead: (notificationId: string) => void;
  useStreakFreeze: () => Promise<boolean>;
}
