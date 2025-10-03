
export type { User, UserRole } from './user';
export type { UserPreferences } from './preferences';
export type { Badge, Challenge } from './badge';
export type { ChatMessage, ChatConversation, ChatResponse } from './chat';
export type { MoodData } from './other';
export type { KpiCardProps, DashboardWidgetConfig, GamificationData } from './dashboard';
export type { LeaderboardEntry } from './gamification';
export type { JournalEntry } from './journal';

export interface EmotionalData {
  id?: string;
  user_id?: string;
  timestamp?: string;
  emotion?: string;
  intensity?: number;
  created_at?: string;
  updated_at?: string;
  context?: string;
  source?: string;
}

export interface FontFamily {
  name: string;
  value: string;
}

export interface FontSize {
  name: string;
  value: string;
}

export interface ThemeName {
  name: string;
  value: string;
}

export interface InvitationVerificationResult {
  valid: boolean;
  message?: string;
  email?: string;
  role?: string;
}

export interface NotificationPreferences {
  enabled: boolean;
  email: boolean;
  push: boolean;
  inApp: boolean;
  types?: Record<string, boolean>;
}

export interface Period {
  label: string;
  value: string;
  days: number;
}

export type UserModeType = 'b2c' | 'b2b_user' | 'b2b_admin';

export interface Story {
  id: string;
  title: string;
  content: string;
  author?: string;
  emotion?: string;
  created_at: string;
  tags?: string[];
}
