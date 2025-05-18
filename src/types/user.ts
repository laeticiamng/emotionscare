
export type UserRole = 'user' | 'admin' | 'b2b_user' | 'b2b_admin' | 'b2c' | 'coach' | 'therapist' | 'b2b';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
  isActive?: boolean;
  job_title?: string;
  department?: string;
  notifications_enabled?: boolean;
  avatar?: string;
  avatarUrl?: string;
  avatar_url?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  joined_at?: string;
  position?: string;
  emotional_score?: number;
  preferences?: UserPreferences;
  displayName?: string;  // Added for identity settings
  firstName?: string;    // Added for user info
  lastName?: string;     // Added for user info
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system' | 'pastel';
  language: string;
  notifications_enabled?: boolean;
  email_notifications?: boolean;
  fontSize?: string;
  fontFamily?: string;
  reduceMotion?: boolean;
  colorBlindMode?: boolean;
  autoplayMedia?: boolean;
  soundEnabled?: boolean;
  dashboardLayout?: Record<string, any> | string;
  onboardingCompleted?: boolean;
  privacy?: {
    shareData: boolean;
    anonymizeReports: boolean;
    profileVisibility: string;
    anonymousMode?: boolean;
    shareActivity?: boolean;  // Added for data privacy settings
    shareJournal?: boolean;   // Added for data privacy settings
    publicProfile?: boolean;  // Added for data privacy settings
  };
  notifications?: {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    inAppEnabled: boolean;
    types: {
      system: boolean;
      emotion: boolean;
      coach: boolean;
      journal: boolean;
      community: boolean;
      achievement: boolean;
      badge?: boolean;
    };
    frequency: string;
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  // Identity fields
  avatarUrl?: string;
  displayName?: string;
  pronouns?: string;
  biography?: string;
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
