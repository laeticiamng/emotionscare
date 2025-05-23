
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  permissions?: string[];
  preferences?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  interests?: string[];
  preferences?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface B2BUserMetadata {
  companyCode?: string;
  companyId?: string;
  position?: string;
  department?: string;
  teamId?: string;
  managerId?: string;
  startDate?: string;
}

export interface B2BAdminMetadata {
  companyId: string;
  permissions: string[];
  adminLevel?: number;
}
