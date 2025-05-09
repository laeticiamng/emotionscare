
// Invitation related types
import { UserRole } from './index';

export interface Invitation {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  team_id?: string;
  status: 'pending' | 'accepted' | 'expired' | 'rejected';
  created_at: string;
  expires_at: string;
  accepted_at?: string;
  created_by: string;
  token: string;
  message?: string;
  reminder_sent_at?: string;
  reminder_count?: number;
}

export interface InvitationFormData {
  email: string;
  name?: string;
  role: UserRole;
  team_id?: string;
  expiration_days?: number;
  message?: string;
}

export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
  sent: number;
  rejected: number;
  teams?: Record<string, number>;
  recent_invites?: any[];
}
