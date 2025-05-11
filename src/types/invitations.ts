
export interface InvitationFormData {
  email: string;
  role: string;
  message?: string;
  expiresIn?: number;
}

export interface InvitationStats {
  total: number;
  pending: number;
  expired: number;
  completed: number;
  conversionRate: number;
  averageTimeToAccept: number;
  sent: number;
  accepted: number;
  rejected: number;
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
