
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar_url?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
  emailVerified?: boolean;
  isAdmin?: boolean;
  company?: string;
  position?: string;
  preferences?: UserPreferences;
  active?: boolean;
  status?: 'active' | 'inactive' | 'pending' | 'blocked';
  lastLoginDate?: string;
  totalSessions?: number;
  name?: string;
  department?: string;
  emotional_score?: number;
  joined_at?: string;
  avatarUrl?: string;
}

export type UserRole = 'admin' | 'user' | 'coach' | 'therapist' | 'b2b' | 'b2c' | 'b2b_user' | 'b2b_admin';

export interface UserPreferences {
  theme: string;
  fontSize?: string;
  fontFamily?: string;
  useSystemTheme?: boolean;
  highContrast?: boolean;
  reducedMotion?: boolean;
  soundEffects?: boolean;
  language?: string;
  timeZone?: string;
  dateFormat?: string;
  notifications_enabled?: boolean;
  email_notifications?: boolean;
  
  // Add properties that are used in the application
  notifications?: {
    enabled?: boolean;
    emailEnabled?: boolean;
    pushEnabled?: boolean;
    inAppEnabled?: boolean;
    types?: Record<string, boolean>;
    frequency?: string;
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  dashboardLayout?: Record<string, any> | string;
  onboardingCompleted?: boolean;
  showTips?: boolean;
  privacy?: {
    shareData?: boolean;
    anonymizeReports?: boolean;
    profileVisibility?: string;
  };
}
