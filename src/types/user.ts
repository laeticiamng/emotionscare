
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin';

export type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin' | null;

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  soundEffects?: boolean;
  language?: string;
  accessibility?: {
    highContrast?: boolean;
    largeText?: boolean;
    reducedMotion?: boolean;
  };
}
