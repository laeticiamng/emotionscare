
export type UserRole = "admin" | "user" | "b2b_user" | "b2b_admin" | "guest";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: UserRole;
  preferences?: UserPreferences;
  onboarded?: boolean;
}

export interface UserPreferences {
  theme?: string;
  fontSize?: string;
  fontFamily?: string;
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
