
export type UserRole = 'user' | 'admin' | 'manager' | 'guest' | 'b2c' | 'b2b_user' | 'b2b_admin';

export interface User {
  id: string;
  email: string;
  name: string; // Changed from optional to required to match AuthUser
  role?: UserRole;
  avatar_url?: string;
  avatar?: string;
  avatarUrl?: string;
  created_at?: string;
  position?: string;
  department?: string;
  joined_at?: string;
  preferences?: any;
  emotional_score?: number;
  job_title?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: UserRole;
  avatar?: string;
  avatar_url?: string;
  avatarUrl?: string;
  created_at?: string;
  position?: string;
  department?: string;
  joined_at?: string;
}

export interface UserWithStatus extends User {
  status?: 'online' | 'away' | 'offline' | 'busy';
  lastSeen?: Date;
  mood?: string;
  moodEmoji?: string;
}
