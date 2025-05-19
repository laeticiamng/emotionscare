
export type UserRole = 'user' | 'admin' | 'manager' | 'guest' | 'b2c' | 'b2b_user' | 'b2b_admin';

export interface User {
  id: string;
  email: string;
  name?: string;
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
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
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
