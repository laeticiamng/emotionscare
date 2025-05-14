
import { Theme, FontFamily, FontSize } from '@/contexts/ThemeContext';

export type ThemeName = Theme;
export type PrivacyLevel = 'private' | 'friends' | 'public';
export type DashboardLayout = 'compact' | 'standard' | 'expanded';

// Re-export FontSize and FontFamily from ThemeContext using 'export type'
export type { FontSize, FontFamily };

export interface UserPreferences {
  theme: ThemeName;
  language: string;
  fontSize: FontSize;
  fontFamily: FontFamily;
  notifications: {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    frequency: string;
  };
  soundEnabled: boolean;
  privacyLevel: PrivacyLevel;
  onboardingCompleted: boolean;
  dashboardLayout: DashboardLayout;
  
  // Propriétés supplémentaires utilisées dans l'application
  notifications_enabled?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  privacy?: {
    anonymousMode?: boolean;
    dataSharing?: boolean;
    profileVisibility?: 'public' | 'team' | 'private';
  };
  autoplayVideos?: boolean;
  dataCollection?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  fullAnonymity?: boolean;
}
