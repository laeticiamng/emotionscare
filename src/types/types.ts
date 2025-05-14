
import { ReactNode } from "react";

// User types
export type UserRole = 'admin' | 'manager' | 'wellbeing_manager' | 'coach' | 'team' | 'employee' | 'personal' | 'b2b_admin' | 'b2b-admin' | 'b2b_user' | 'b2b-user' | 'b2c' | 'user';

export type Theme = 'light' | 'dark' | 'system';
export type ThemeName = Theme;
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';
export type FontFamily = 'inter' | 'roboto' | 'poppins' | 'merriweather' | 'system';

export interface User {
  id: string;
  email: string;
  name: string;
  role?: UserRole;
  avatar?: string;
  avatar_url?: string;
  onboarded?: boolean;
  preferences?: UserPreferences;
  job_title?: string;
  position?: string;
  created_at?: string;
  status?: 'active' | 'inactive' | 'pending';
}

export interface UserPreferences {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  language: string;
  notifications: NotificationPreference;
  email_notifications: boolean;
  push_notifications: boolean;
  privacy: {
    profileVisibility?: 'private' | 'team' | 'public';
  };
  accessibility: {
    highContrast: boolean;
    reduceAnimations: boolean;
    largeText: boolean;
  };
  analytics_consent: boolean;
  marketing_consent: boolean;
  sound: boolean;
  notifications_enabled: boolean;
  privacyLevel: 'strict' | 'balanced' | 'open';
  fullAnonymity?: boolean;
}

export interface UserPreferencesState extends UserPreferences {
  loading: boolean;
  error: string | null;
}

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  frequency: NotificationFrequency;
  types?: NotificationType[];
  tone?: NotificationTone;
  quiet_hours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export type NotificationFrequency = 'realtime' | 'daily' | 'weekly' | 'none';
export type NotificationType = 'all' | 'emotions' | 'coach' | 'journal' | 'community' | 'system';
export type NotificationTone = 'professional' | 'friendly' | 'minimal';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  date: string;
  action_url?: string;
  icon?: string;
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (font: FontFamily) => void;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
}

export interface ThemeButtonProps {
  theme?: Theme;
  onClick?: () => void;
  collapsed?: boolean;
}

export interface InvitationVerificationResult {
  valid: boolean;
  email?: string;
  role?: UserRole;
  expired?: boolean;
  message: string;
}

// Team types
export interface TeamOverviewProps {
  users: User[];
  onUserClick?: (userId: string) => void;
  period?: string;
  dateRange?: { start: Date; end: Date };
  onRefresh?: () => void;
  userId?: string;
  teamId?: string;
  className?: string;
}

// VR Types
export interface VoiceEmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  userId?: string;
  maxDuration?: number;
  onCancel?: () => void;
}

// Add Challenge type definition
export interface Challenge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  points: number;
  completions: number;
  progress?: number;
  total?: number;
  type: 'daily' | 'weekly' | 'one-time';
  category: 'emotion' | 'journal' | 'community' | 'coach' | 'activity';
  status?: 'complete' | 'in-progress' | 'not-started';
}

// Add GamificationStats type definition
export interface GamificationStats {
  points: number;
  level: number;
  rank?: string;
  badges: number;
  completedChallenges: number;
  totalChallenges: number;
  streak: number;
  graph?: {
    date: string;
    points: number;
  }[];
}

// Add LeaderboardEntry type definition
export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  avatar?: string;
  isCurrentUser?: boolean;
  department?: string;
  level?: number;
}

// Add EmotionalTeamViewProps type definition
export interface EmotionalTeamViewProps {
  departmentId?: string;
  teamId?: string;
  users?: User[];
  anonymized?: boolean;
  onUserClick?: (userId: string) => void;
}
