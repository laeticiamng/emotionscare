
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string | Date;
  last_login?: string | Date;
  preferences?: UserPreferences;
  role?: UserRole;
  status?: 'active' | 'inactive' | 'pending';
  profile?: {
    bio?: string;
    location?: string;
    profession?: string;
    interests?: string[];
  };
}

export type UserRole = 'user' | 'admin' | 'coach' | 'premium';

export interface UserPreferences {
  theme?: string;
  notifications_enabled?: boolean;
  language?: string;
  timezone?: string;
  email_frequency?: 'daily' | 'weekly' | 'monthly' | 'none';
  privacy_level?: 'private' | 'friends' | 'public';
  sound_enabled?: boolean;
  animations_enabled?: boolean;
  font_size?: 'small' | 'medium' | 'large';
  high_contrast?: boolean;
}
