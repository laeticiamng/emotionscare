
export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string; // Add this for compatibility
  lastName?: string;
  avatar?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UserRole = 'admin' | 'manager' | 'user' | 'guest';

export interface AuthUser extends User {
  token?: string;
  isAuthenticated?: boolean;
}

export interface UserWithStatus extends User {
  status: 'online' | 'offline' | 'away' | 'busy';
  lastActive?: string;
  firstName?: string; // Add this for compatibility
}
