export type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  user_metadata?: Record<string, unknown>;
  firstName?: string;
  avatar?: string;
}
