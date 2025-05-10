
export interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  invited_by: string;
  created_at: string | Date;
  expires_at: string | Date;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  message?: string;
  code: string;
}

export interface InvitationFormData {
  email: string;
  role: UserRole;
  message?: string;
  expires_in?: number;
}

export type UserRole = 'user' | 'admin' | 'manager' | 'supervisor';

export interface InvitationStats {
  sent: number;
  accepted: number;
  pending: number;
  expired: number;
  conversion_rate: number;
  total: number;
}
