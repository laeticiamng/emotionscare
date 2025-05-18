
export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  avatar?: string;
  avatar_url?: string; // For backward compatibility
  role?: UserRole;
}

export type UserRole = 'admin' | 'user' | 'guest';

export interface UserWithStatus extends AuthUser {
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}
