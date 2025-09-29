
export type UserRole = string;

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: 'fr' | 'en';
  notifications?: boolean;
}

export interface UserProfile {
  [key: string]: any;
}
