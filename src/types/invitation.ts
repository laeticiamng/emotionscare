
export interface InvitationFormData {
  email: string;
  role?: UserRole;
  message?: string;
  expires_at?: Date;
}

export interface Invitation {
  id: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  created_at: string | Date;
  expires_at: string | Date;
  accepted_at?: string | Date;
  token: string;
}

export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  expired: number;
  recent_invitations: Invitation[];
  conversion_rate: number;
}
