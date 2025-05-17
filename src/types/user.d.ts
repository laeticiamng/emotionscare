
export type UserRole = 'user' | 'admin' | 'b2b_user' | 'b2b_admin' | 'b2c' | 'coach' | 'therapist';

export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
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
  department?: string;
  emotional_score?: number;
  joined_at?: string;
  createdAt?: string;
  avatar?: string;
  avatarUrl?: string;
  avatar_url?: string;
  job_title?: string;
  isActive?: boolean;
}

export interface UserWithStatus {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'pending';
  last_active?: string;
  department?: string;
  firstName?: string;
  lastName?: string;
}

export interface UserPreferences {
  theme?: string;
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
  
  // Properties used in the application
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
    inApp?: boolean;
  };
  dashboardLayout?: Record<string, any> | string;
  onboardingCompleted?: boolean;
  showTips?: boolean;
  privacy?: {
    shareData?: boolean;
    anonymizeReports?: boolean;
    profileVisibility?: string;
  };
  
  // Additional properties needed by preferences components
  reduceMotion?: boolean;
  colorBlindMode?: boolean;
  autoplayMedia?: boolean;
  soundEnabled?: boolean;
}
