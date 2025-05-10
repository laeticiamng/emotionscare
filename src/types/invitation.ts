
import { UserRole } from './user';

export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
  sent?: number;
  rejected?: number;
  teams?: Record<string, number>;
  recent_invites?: InvitationData[];
}

export interface InvitationData {
  id: string;
  email: string;
  status: 'pending' | 'accepted' | 'expired' | 'rejected';
  created_at: string | Date;
  expires_at: string | Date;
  accepted_at?: string | Date;
}

export interface InvitationFormData {
  email: string;
  role: UserRole;
  message?: string;
  team_id?: string;
  expires_in_days?: number;
}
