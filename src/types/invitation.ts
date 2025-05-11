export interface InvitationVerificationResult {
  valid: boolean;
  expired: boolean;
  alreadyUsed: boolean;
  email?: string;
  role?: string;
  invitationId?: string;
}

export interface Invitation {
  id: string;
  email: string;
  name?: string;
  status: 'pending' | 'accepted' | 'expired';
  created_at: string;
  expires_at: string;
  role?: string;
  department?: string;
}
