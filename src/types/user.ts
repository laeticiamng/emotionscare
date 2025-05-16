
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  avatar?: string;
  joined_at?: string;
  created_at?: string; 
  onboarded?: boolean;
  department?: string;
  position?: string;
  emotional_score?: number;
  preferences?: {
    theme?: 'light' | 'dark' | 'system' | 'pastel';
    fontSize?: 'small' | 'medium' | 'large';
    fontFamily?: string;
    reduceMotion?: boolean;
    colorBlindMode?: boolean;
    autoplayMedia?: boolean;
    soundEnabled?: boolean;
    language?: string;
    notifications_enabled?: boolean;
    privacy?: {
      showProfile?: boolean;
      shareActivity?: boolean;
      allowMessages?: boolean;
      allowNotifications?: boolean;
    };
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
      frequency?: 'daily' | 'weekly' | 'never';
    };
  };
}

export interface Profile {
  id: string;
  user_id: string;
  username?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin';
