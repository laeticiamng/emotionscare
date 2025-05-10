
// Types for user-related components
export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  avatar?: string;
  created_at?: string | Date;
  preferences?: UserPreferences;
  department?: string;
  position?: string;
  last_active?: string | Date;
  status?: 'active' | 'inactive' | 'pending';
}

export type UserRole = 'admin' | 'manager' | 'user' | 'guest';
