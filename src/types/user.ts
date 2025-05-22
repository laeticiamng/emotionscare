
export type UserRole = 'user' | 'admin' | 'collaborator' | 'manager' | 'b2b_user' | 'b2b_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  position?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface UserProfile extends User {
  bio?: string;
  phone?: string;
  preferences?: UserPreferences;
  stats?: UserStats;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: {
    email?: boolean;
    push?: boolean;
  };
  privacy?: {
    shareActivity?: boolean;
    shareEmotionalData?: boolean;
  };
  language?: string;
}

export interface UserStats {
  emotionScans?: number;
  sessionsCompleted?: number;
  journalEntries?: number;
  streak?: number;
}

export interface UserAuth {
  token: string;
  refreshToken: string;
  expiresAt: string;
}
