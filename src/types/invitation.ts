
export interface InvitationFormData {
  email: string;
  role: string;
  message?: string;
  expires_in_days?: number;
}

export interface InvitationStats {
  total: number;
  sent: number;
  pending: number;
  accepted: number;
  expired: number;
  rejected: number;
  completed: number;
  conversionRate: number;
  averageTimeToAccept: number;
  recent_invites: any[];
  teams?: Record<string, any>;
}
