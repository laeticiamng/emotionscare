
export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  expired: number;
  recent_invitations: {
    id: string;
    email: string;
    status: string;
    created_at: string;
  }[];
  conversion_rate: number;
}

export interface InvitationFormData {
  email: string;
  role?: string;
  message?: string;
  expires_at?: Date;
}
