
export type UserRole = 'admin' | 'user' | 'manager' | 'coach' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
  last_login?: string;
  is_active?: boolean;
  position?: string;
  department?: string;
  joined_at?: string;
  emotional_score?: number;
}
