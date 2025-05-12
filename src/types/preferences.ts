
export type ThemeName = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'system' | 'mono';
export type PrivacyLevel = 'private' | 'friends' | 'public';
export type DashboardLayout = 'compact' | 'standard' | 'expanded';

export interface UserPreferences {
  theme: ThemeName;
  language: string;
  fontSize: FontSize;
  fontFamily: FontFamily;
  notifications: boolean;
  soundEnabled: boolean;
  privacyLevel: PrivacyLevel;
  onboardingCompleted: boolean;
  dashboardLayout: DashboardLayout;
}
