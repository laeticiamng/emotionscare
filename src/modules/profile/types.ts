/**
 * Types du module Profile
 * Définitions TypeScript pour la gestion du profil utilisateur
 */

// ─────────────────────────────────────────────────────────────
// PROFILE TYPES
// ─────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  role: 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin';
  bio: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  avatar_url: string | null;
  department: string | null;
  job_title: string | null;
  emotional_score: number | null;
  subscription_plan: string | null;
  credits_left: number | null;
  org_id: string | null;
  team_id: string | null;
  preferences: ProfilePreferences;
  created_at: string;
  updated_at: string;
}

export interface ProfilePreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'fr' | 'en';
  timezone: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  sound_enabled: boolean;
  public_profile: boolean;
  share_stats: boolean;
  analytics_opt_in: boolean;
}

export const DEFAULT_PREFERENCES: ProfilePreferences = {
  theme: 'system',
  language: 'fr',
  timezone: 'Europe/Paris',
  notifications_enabled: true,
  email_notifications: true,
  push_notifications: true,
  sound_enabled: true,
  public_profile: false,
  share_stats: false,
  analytics_opt_in: true,
};

// ─────────────────────────────────────────────────────────────
// PROFILE STATS
// ─────────────────────────────────────────────────────────────

export interface ProfileStats {
  totalScans: number;
  totalJournalEntries: number;
  totalBreathingSessions: number;
  totalMeditations: number;
  totalMusicSessions: number;
  currentStreak: number;
  longestStreak: number;
  totalBadges: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  averageEmotionalScore: number;
  totalHoursUsed: number;
  memberSinceDays: number;
}

export const DEFAULT_STATS: ProfileStats = {
  totalScans: 0,
  totalJournalEntries: 0,
  totalBreathingSessions: 0,
  totalMeditations: 0,
  totalMusicSessions: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalBadges: 0,
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  averageEmotionalScore: 0,
  totalHoursUsed: 0,
  memberSinceDays: 0,
};

// ─────────────────────────────────────────────────────────────
// ACHIEVEMENTS
// ─────────────────────────────────────────────────────────────

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type AchievementCategory = 'streak' | 'activity' | 'social' | 'milestone' | 'special';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  category: AchievementCategory;
  target: number;
  progress: number;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface UserBadge {
  id: string;
  badge_id: string;
  name: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  earned_at: string;
}

// ─────────────────────────────────────────────────────────────
// SESSIONS & SECURITY
// ─────────────────────────────────────────────────────────────

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  last_active: string;
  is_current: boolean;
  created_at: string;
}

export interface SecurityInfo {
  password_last_changed: string | null;
  password_strength: 'weak' | 'medium' | 'strong';
  two_factor_enabled: boolean;
  active_sessions_count: number;
  last_login: string | null;
  last_login_ip: string | null;
}

// ─────────────────────────────────────────────────────────────
// ACTIVITY & HISTORY
// ─────────────────────────────────────────────────────────────

export interface ActivityHistoryItem {
  date: string;
  scans: number;
  breathing: number;
  journals: number;
  meditations: number;
  music: number;
}

export interface ProfileExportData {
  profile: Omit<UserProfile, 'id'>;
  stats: ProfileStats;
  achievements: Achievement[];
  badges: UserBadge[];
  activity_history: ActivityHistoryItem[];
  exported_at: string;
  format_version: string;
}

// ─────────────────────────────────────────────────────────────
// INPUT TYPES
// ─────────────────────────────────────────────────────────────

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  department?: string;
  job_title?: string;
}

export interface UpdatePreferencesInput extends Partial<ProfilePreferences> {}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

export function calculateLevel(xp: number): { level: number; currentXp: number; xpToNext: number } {
  const baseXp = 100;
  let level = 1;
  let remainingXp = xp;
  
  while (remainingXp >= baseXp * level) {
    remainingXp -= baseXp * level;
    level++;
  }
  
  return {
    level,
    currentXp: remainingXp,
    xpToNext: baseXp * level,
  };
}

export function getRarityColor(rarity: AchievementRarity): string {
  switch (rarity) {
    case 'common': return 'bg-muted text-muted-foreground';
    case 'rare': return 'bg-blue-500/20 text-blue-600';
    case 'epic': return 'bg-purple-500/20 text-purple-600';
    case 'legendary': return 'bg-amber-500/20 text-amber-600';
  }
}

export function getProfileCompletionPercentage(profile: UserProfile): number {
  const fields = [
    profile.name,
    profile.bio,
    profile.phone,
    profile.location,
    profile.avatar_url,
    profile.job_title,
  ];
  const completed = fields.filter(field => field && String(field).trim()).length;
  return Math.round((completed / fields.length) * 100);
}
