
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'b2c' | 'b2b_user' | 'b2b_admin';
  createdAt: string;
  organizationId?: string;
  avatar?: string;
}
