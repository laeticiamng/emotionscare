
// User related types
export type { User, UserRole, UserPreferences } from './user';
export type { UserModeType } from './userMode';

// Period type for date selections
export type Period = 'day' | 'week' | 'month' | 'year' | 'all';

// Invitation verification result
export interface InvitationVerificationResult {
  valid: boolean;
  expired?: boolean;
  email?: string;
  role?: string;
  message?: string;
}
