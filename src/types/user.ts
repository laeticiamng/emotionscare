
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  created_at?: Date | string;
  emotional_score?: number;
  anonymity_code?: string;
}

export type UserRole = 'user' | 'admin' | 'coach' | 'therapist' | 'hr';

export interface UserPreferences {
  theme: ThemeName;
  font_size: FontSize;
  notifications_enabled: boolean;
  language: string;
}

export interface ThemeName {
  light: 'light';
  dark: 'dark';
  system: 'system';
  pastel: 'pastel';
  nature: 'nature';
  'deep-night': 'deep-night';
  starry: 'starry';
  misty: 'misty';
}

export interface FontSize {
  small: 'small';
  medium: 'medium';
  large: 'large';
}
