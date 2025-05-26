
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole | string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserProfile extends User {
  firstName?: string;
  lastName?: string;
  bio?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  language?: string;
  timezone?: string;
}
