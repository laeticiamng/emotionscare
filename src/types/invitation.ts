
import { UserRole } from './user';

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

export interface InvitationStats {
  sent: number;
  accepted: number;
  pending: number;
  expired: number;
  rejected?: number;
  conversion_rate: number;
  total: number;
  teams?: Record<string, any>;
  recent_invites?: any[];
}
