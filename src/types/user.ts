export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin' | 'user';
export type ThemeName = 'light' | 'dark' | 'system';
export type FontFamily = 'sans' | 'serif' | 'mono';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl';

export interface UserPreferences {
  onboardingCompleted?: boolean;
  dashboardLayout?: string;
  theme?: ThemeName;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
  notifications?: NotificationPreference[];
  language?: string;
  accessibility?: {
    highContrast?: boolean;
    reducedMotion?: boolean;
    largeText?: boolean;
  };
  privacy?: {
    showRealName?: boolean;
    showAvatar?: boolean;
    shareData?: boolean;
    profileVisibility?: 'public' | 'team' | 'private';
  };
  dataCollection?: boolean;
  showWelcomeScreen?: boolean;
  fullAnonymity?: boolean;
  notifications_enabled?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
}

export interface UserPreferencesState extends UserPreferences {
  isLoading: boolean;
  error: Error | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  avatar?: string;
  emotional_score?: number;
  anonymity_code?: string;
  onboarded?: boolean;
  team_id?: string;
  preferences?: UserPreferences;
  createdAt: string;
  position?: string;
  joined_at?: string;
}

export interface InvitationVerificationResult {
  valid: boolean;
  email?: string;
  role?: UserRole;
  expires_at?: string;
  company_name?: string;
  error?: string;
}
