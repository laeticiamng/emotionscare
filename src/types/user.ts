
import { NotificationsPreferences, UserPreferences } from './preferences';

export type UserRole = 'admin' | 'b2c' | 'b2b_user' | 'b2b_admin';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  avatar_url?: string;
  department?: string;
  job_title?: string;
  emotional_score?: number;
}

export interface UserWithStatus extends User {
  status?: 'online' | 'offline' | 'away' | 'busy';
  last_active?: string;
  gamification?: {
    level: number;
    points: number;
    badges: number;
    streak: number;
  };
}

// Re-export UserPreferences from preferences.ts
export type { UserPreferences, NotificationsPreferences };
