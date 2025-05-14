
export type ThemeName = 
  | 'light'
  | 'dark'
  | 'system';

export type FontSize = 
  | 'small'
  | 'medium'
  | 'large';

export type FontFamily =
  | 'system'
  | 'serif'
  | 'sans'
  | 'mono';

export interface UserPreferences {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  language: string;
  notifications: {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    frequency: string;
  };
  autoplayVideos: boolean;
  dataCollection: boolean;
  accessibilityFeatures: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
  dashboardLayout: string;
  onboardingCompleted: boolean;
  privacyLevel: string;
}

export interface ThemePreferences {
  mode: ThemeName;
  accentColor: string;
  borderRadius: number;
  reducedMotion: boolean;
  highContrast: boolean;
}
