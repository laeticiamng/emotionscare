
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  avatar?: string;
  avatar_url?: string;
  avatarUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName?: string;
  bio?: string;
  preferences?: Record<string, any>;
  settings?: Record<string, any>;
}
