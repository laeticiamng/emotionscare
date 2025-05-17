
export type UserRole = 'user' | 'admin' | 'coach' | 'therapist' | 'b2b' | 'b2c';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
  isActive: boolean;
}
