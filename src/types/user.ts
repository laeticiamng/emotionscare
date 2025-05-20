
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  avatarUrl?: string;
  department?: string;
  job_title?: string;
  preferences?: Record<string, any>;
  emotional_score?: number;
  onboarded?: boolean; // Adding this to fix the type error
}

export interface UserWithStatus extends User {
  status: 'online' | 'away' | 'offline';
  lastActive?: string;
}

export interface InvitationVerificationResult {
  valid: boolean;
  message?: string;
  email?: string;
  role?: string;
}
