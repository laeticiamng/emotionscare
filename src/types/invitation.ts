
export interface InvitationFormData {
  email: string;
  role: string;
  name?: string;
  team_id?: string;
  message?: string;
}

export interface InvitationStats {
  total: number;
  sent: number;
  pending: number;
  accepted: number;
  expired: number;
  teams: Record<string, number>;
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
