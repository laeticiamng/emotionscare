// @ts-nocheck

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'b2c' | 'b2b';
  createdAt: string;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: 'fr' | 'en';
  notifications?: boolean;
}
