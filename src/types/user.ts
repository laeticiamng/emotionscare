
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

// Add User interface for older components
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  avatarUrl?: string;
  avatar_url?: string;
  role?: string;
}
