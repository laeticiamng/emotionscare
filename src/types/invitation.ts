
import { UserRole } from './user';

export interface InvitationStats {
  total: number;
  pending: number;
  expired: number;
  completed: number;
  conversionRate: number;
  averageTimeToAccept: number;
  
  // Adding missing properties
  sent: number;
  accepted: number;
  rejected: number;
  teams: Record<string, any>;
  recent_invites: any[];
}

export interface InvitationFormData {
  email: string;
  role: UserRole;
  message: string;
  expires_in_days: number;
}
