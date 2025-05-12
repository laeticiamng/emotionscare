
import { Theme, FontFamily, FontSize } from '@/contexts/ThemeContext';

export type ThemeName = Theme;
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
