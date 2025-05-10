
export interface Invitation {
  id: string;
  email: string;
  name?: string;
  role: string;
  status: 'pending' | 'accepted' | 'expired';
  created_at: string;
  expires_at: string;
  message?: string;
  accepted_at?: string;
  used_count?: number;
}

export interface InvitationStats {
  total: number;
  accepted: number;
  pending: number;
  expired: number;
  conversion_rate: number;
}
