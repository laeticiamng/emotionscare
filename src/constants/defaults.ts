
import { UserPreferences, ThemeName, FontSize, FontFamily, PrivacyLevel } from '@/types/preferences';

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'system' as ThemeName,
  fontSize: 'medium' as FontSize,
  fontFamily: 'system' as FontFamily,
  language: 'fr',
  notifications: {
    enabled: true,
    emailEnabled: true,
    pushEnabled: false,
    frequency: 'daily'
  },
  autoplayVideos: false,
  dataCollection: true,
  accessibilityFeatures: {
    highContrast: false,
    reducedMotion: false,
    screenReader: false
  },
  dashboardLayout: 'standard',
  onboardingCompleted: false,
  privacyLevel: 'balanced' as PrivacyLevel,
  soundEnabled: true
};

// Alias for backward compatibility
export const defaultPreferences = DEFAULT_USER_PREFERENCES;
