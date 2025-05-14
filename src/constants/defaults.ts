
import { FontFamily, FontSize, ThemeName } from '@/types';

export const DEFAULT_USER_PREFERENCES = {
  theme: 'system' as ThemeName,
  fontSize: 'medium' as FontSize,
  fontFamily: 'sans' as FontFamily,
  notifications: {
    enabled: true,
    emailEnabled: false,
    pushEnabled: true,
    frequency: 'daily',
  },
  autoplayVideos: true,
  dataCollection: true,
  animations: true,
  soundEffects: true,
  highContrast: false,
  reducedMotion: false,
  privacyLevel: 'standard',
};

// Alias for backward compatibility
export const defaultPreferences = DEFAULT_USER_PREFERENCES;
