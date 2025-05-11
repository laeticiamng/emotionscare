
export interface InvitationVerificationResult {
  valid: boolean;
  message: string;
  invitation?: {
    id: string;
    email: string;
    role: string;
    expires_at: string;
    status: 'pending' | 'accepted' | 'expired' | 'rejected';
  };
}
