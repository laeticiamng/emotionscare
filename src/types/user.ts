
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  soundEnabled: boolean;
}
