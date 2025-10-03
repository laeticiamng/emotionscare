
export interface Invitation {
  id: string;
  email: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  role: string;
  created_at: string;
  expires_at: string;
  accepted_at?: string;
  token: string;
  sent_at?: string;
}

export interface InvitationVerificationResult {
  valid: boolean;
  invitation?: Invitation;
  message: string;
  errorCode?: string;
}

export interface NewInvitationData {
  email: string;
  role: string;
  expiresInDays?: number;
}

export interface InvitationResponse {
  success: boolean;
  message: string;
  invitation?: Invitation;
  error?: string;
}

export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
  rejected?: number;
  sent?: number;
  completed?: number;
  conversionRate?: number;
  conversion_rate?: number;
  averageTimeToAccept?: number;
  teams?: Record<string, number>;
  recent_invites?: InvitationData[];
  last_sent?: InvitationData[];
}

export interface InvitationData {
  id: string;
  email: string;
  name?: string;
  status: string;
  sent_at?: string;
  accepted_at?: string;
  role: string;
  sent_by?: string;
  created_at: string;
  expires_at: string;
}
