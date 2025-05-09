
// Invitation related types

import { UserRole } from './index';

export interface InvitationStats {
  total: number;
  sent: number;
  pending: number;
  accepted: number;
  expired: number;
  rejected: number;
  teams: Record<string, number>;
  recent_invites?: any[];
}

export interface InvitationFormData {
  email: string;
  role: string;
  name?: string;
  team_id?: string;
  message?: string;
}

export interface InvitationVerificationResult {
  valid: boolean;
  message: string;
  invitation?: any;
  email?: string;
  role?: string;
}
