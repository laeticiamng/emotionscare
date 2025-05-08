
export interface InvitationFormData {
  email: string;
  role: string;
}

export interface InvitationStats {
  total: number; // Added required property
  sent: number;
  pending: number;
  accepted: number;
  expired: number;
}

export interface InvitationVerificationResult {
  valid: boolean;
  message?: string;
  email?: string;
  role?: string;
}
