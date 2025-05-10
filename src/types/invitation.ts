
export interface Invitation {
  id: string;
  email: string;
  name?: string;
  role: string;
  status: 'pending' | 'accepted' | 'expired';
  created_at: string | Date;
  expires_at: string | Date;
  accepted_at?: string | Date;
  message?: string;
  created_by: string;
  code: string;
}

export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
  conversion_rate: number;
  last_week: {
    sent: number;
    accepted: number;
  }
}
