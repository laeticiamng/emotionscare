
export type UserRole = 'user' | 'admin' | 'manager' | 'wellbeing_manager' | 'coach' | 'employee' | 'b2c' | 'b2b_user' | 'b2b_admin';

export interface UserPreferences {
  theme?: string;
  fontSize?: string;
  language?: string;
  fontFamily?: string;
  sound?: {
    volume?: number;
    effects?: boolean;
    music?: boolean;
  } | boolean;
  reduceMotion?: boolean;
  colorBlindMode?: boolean;
  autoplayMedia?: boolean;
  notifications?: {
    enabled?: boolean;
    emailEnabled?: boolean;
    pushEnabled?: boolean;
    frequency?: string;
    types?: {
      system?: boolean;
      emotion?: boolean;
      journal?: boolean;
      coach?: boolean;
      community?: boolean;
      achievement?: boolean;
    };
    tone?: string;
    quietHours?: {
      enabled?: boolean;
      start?: string;
      end?: string;
    };
  };
  notifications_enabled?: boolean;
  profileVisibility?: 'public' | 'private' | 'team';
  privacy?: {
    profileVisibility?: 'public' | 'private' | 'team';
  };
  dashboardLayout?: string;
  onboardingCompleted?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  avatar_url?: string;
  created_at?: string;
  joined_at?: string;
  emotional_score?: number;
  department?: string;
  position?: string;
  preferences?: UserPreferences;
  onboarded?: boolean;
}
