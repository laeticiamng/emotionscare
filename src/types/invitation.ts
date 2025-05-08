
export interface InvitationFormData {
  email: string;
  role: string;
}

export interface InvitationStats {
  total: number;
  sent: number;
  pending: number;
  accepted: number;
  expired: number;
  recent_invites?: {
    email: string;
    status: string;
    created_at: string;
  }[];
}

export interface InvitationVerificationResult {
  valid: boolean;
  message?: string;
  email?: string;
  role?: string;
}
