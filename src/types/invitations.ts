
export interface InvitationFormData {
  email: string;
  role: UserRole;
  message?: string;
  expires_in_days: number;
  expiresIn?: number;
}

export interface InvitationStats {
  total: number;
  pending: number;
  expired: number;
  accepted: number;
  rejected: number;
  sent: number;
  completed: number;
  conversionRate: number;
  averageTimeToAccept: number;
  teams: Record<string, number>;
  recent_invites: InvitationData[];
}

export interface InvitationData {
  id: string;
  email: string;
  status: 'pending' | 'accepted' | 'expired' | 'rejected';
  created_at: string;
  expires_at: string;
  accepted_at?: string;
  role: string;
}

export type UserRole = 'admin' | 'manager' | 'user' | 'therapist' | 'coach' | 'guest' | 'employee';
