
export interface Invitation {
  id: string;
  email: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  role: string;
  created_at: string;
  expires_at: string;
  accepted_at?: string;
  token: string;
}

export interface InvitationVerificationResult {
  valid: boolean;
  invitation?: Invitation;
  message: string;
  errorCode?: string;
  data?: {
    id: string;
    email: string;
    role: string;
    expiresAt: string;
  };
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
}
