
export type UserRole = 'user' | 'admin' | 'b2b_user' | 'b2b_admin' | 'b2b-user' | 'b2b-admin' | 'collaborator' | 'b2c';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
  avatar?: string;
  company_id?: string;
  department?: string;
  position?: string;
  settings?: Record<string, any>;
}
