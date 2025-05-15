
import { UserRole } from './user';
import { FontFamily, FontSize, ThemeName } from './theme';

// Types de base pour la compatibilité
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  avatar?: string;
  role: UserRole;
  created_at: string;
  onboarded?: boolean;
  department?: string;
  position?: string;
  joined_at?: string;
  emotional_score?: number;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  reduceMotion: boolean;
  colorBlindMode: boolean;
  autoplayMedia: boolean;
  dashboardLayout?: string;
  notifications: NotificationPreferences;
  privacy?: {
    shareData?: boolean;
    anonymizeReports?: boolean;
    publicProfile?: boolean;
    anonymousMode?: boolean;
    dataSharing?: boolean;
    profileVisibility?: 'team' | 'public' | 'private';
    showEmotionalScore?: boolean;
    shareJournalInsights?: boolean;
    anonymousDataContribution?: boolean;
    shareEmotionalData?: boolean;
  };
  language?: string;
  displayName?: string;
  pronouns?: string;
  biography?: string;
  onboardingCompleted?: boolean;
  highContrast?: boolean;
  soundEnabled?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
}

export interface NotificationPreferences {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  channels?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  frequency?: 'immediate' | 'daily' | 'weekly' | 'never';
  types?: Record<'system' | 'emotion' | 'journal' | 'coach' | 'community' | 'achievement', boolean>;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
  tone?: string;
}

export type Period = 'day' | 'week' | 'month' | 'year' | 'all';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  threshold?: number;
  type?: string;
  imageUrl?: string;
  image_url?: string;
  unlocked?: boolean;
  unlockedAt?: Date | string;
  category?: string;
  level?: string | number;
  points?: number;
  user_id?: string;
  icon_url?: string;
  total_required?: number;
  image?: string;
  dateEarned?: string;
  awarded_at?: Date | string;
  progress?: number;
}

export type UserModeType = 'b2c' | 'b2b-user' | 'b2b-admin' | 'b2b_user' | 'b2b_admin' | 'individual' | 'professional';

export interface UserModeContextType {
  mode: UserModeType;
  setMode: (mode: UserModeType) => void;
  userMode: UserModeType;
  setUserMode: (mode: UserModeType) => void;
  isLoading: boolean;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  text?: string;
  mood: string;
  mood_score?: number;
  emotion?: string;
  date: Date | string;
  tags?: string[];
  ai_feedback?: string;
  user_id?: string;
}

// Export UserRole to fix import issues
export { UserRole } from './user';
