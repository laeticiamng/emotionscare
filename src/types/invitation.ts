
// Types for invitation-related components
export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled';

export interface Invitation {
  id: string;
  email: string;
  status: InvitationStatus;
  role: string;
  created_at: string | Date;
  expires_at: string | Date;
  accepted_at?: string | Date;
}

export interface InvitationFormData {
  email: string;
  role: string;
  expiresIn: number;
  message?: string;
}

export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
  acceptanceRate: number;
  averageTimeToAccept: number;
}
