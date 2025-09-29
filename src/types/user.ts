
export type UserRole = 'b2c' | 'b2b' | 'b2b_user' | 'b2b_admin' | 'admin' | 'consumer' | 'employee' | 'manager';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: 'fr' | 'en';
  notifications?: boolean;
}
