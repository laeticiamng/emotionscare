
export type ThemeName = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'system' | 'serif' | 'mono';

export interface UserPreferences {
  theme?: ThemeName;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
  language?: string;
  notifications?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  autoplayVideos?: boolean;
  dataCollection?: boolean;
  accessibilityFeatures?: {
    highContrast?: boolean;
    reducedMotion?: boolean;
    screenReader?: boolean;
  };
  dashboardLayout?: string;
  onboardingCompleted?: boolean;
  privacyLevel?: string;
  soundEnabled?: boolean;
}
