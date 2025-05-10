
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  joined_at?: string | Date;
  last_active?: string | Date;
  position?: string;
  department?: string;
  teams?: string[];
  emotional_state?: string;
  streak?: number;
  mood_today?: string;
  pronouns?: 'il' | 'elle' | 'iel' | 'autre';
  biography?: string;
}

export type UserRole = 'admin' | 'user' | 'coach' | 'guest';

export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
  conversionRate: number;
}

export interface InvitationFormData {
  email: string;
  name?: string;
  role: UserRole;
  message?: string;
  expires_in?: number;
}

export interface Invitation {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  created_at: string | Date;
  expires_at: string | Date;
  status: 'pending' | 'accepted' | 'expired';
  created_by: string;
  token: string;
  message?: string;
}
