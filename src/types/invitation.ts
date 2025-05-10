
export interface InvitationFormData {
  email: string;
  role: string;
  message?: string;
}

export interface InvitationStats {
  total: number;
  sent: number;
  pending: number;
  accepted: number;
  expired: number;
  rejected: number;
  completed: number; // Add missing property
  conversionRate: number; // Add missing property
  averageTimeToAccept: number; // Add missing property
  recent_invites: any[]; // Add missing property
  teams?: Record<string, any>;
}
