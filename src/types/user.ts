
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin';
