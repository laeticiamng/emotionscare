
import { UserRole } from './user';

export interface InvitationStats {
  total: number;
  pending: number;
  expired: number;
  completed: number;
  conversionRate: number;
  averageTimeToAccept: number;
}

export interface InvitationFormData {
  email: string;
  role: UserRole;
  message: string;
  expires_in_days: number;
}
