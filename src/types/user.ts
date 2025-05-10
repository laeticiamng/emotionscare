
export interface User {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
  role?: UserRole;
  anonymity_code?: string;
  emotional_score?: number;
  last_activity?: string | Date;
  created_at?: string | Date;
}

export enum UserRole {
  EMPLOYEE = 'employee',
  ANALYST = 'analyst',
  WELLBEING_MANAGER = 'wellbeing_manager',
  ADMIN = 'admin'
}
