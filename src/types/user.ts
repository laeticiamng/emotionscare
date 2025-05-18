
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin' | string;

import type {
  UserPreferences,
  PrivacyPreferences,
  AccessibilityPreferences,
} from './preferences';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  /** Jeton d'authentification courant */
  accessToken?: string;
  /** Jeton de rafraîchissement de session */
  refreshToken?: string;
  avatar_url?: string;
  avatarUrl?: string;
  avatar?: string;
  department?: string;
  jobTitle?: string;
  job_title?: string;
  preferences?: UserPreferences;
  emotionalScore?: number;
  emotional_score?: number;
  position?: string;
  joined_at?: string | Date;
  created_at?: string | Date;
  createdAt?: string | Date;
  updated_at?: string | Date;
  updatedAt?: string | Date;
  /** Date de dernière connexion */
  lastLogin?: string | Date;
  /** Indique si le compte est actif */
  isActive?: boolean;
  [key: string]: any;
}

export interface UserWithStatus extends User {
  status?: 'online' | 'offline' | 'away' | 'busy';
  lastActive?: string | Date;
}

// Helper types for API operations
export type CreateUserDto = Omit<User, 'id'> & {
  password?: string;
};

export type UpdateUserDto = Partial<User>;

export type UserAuthResponse = {
  user: User;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
};
