
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  preferences?: {
    theme?: string;
    language?: string;
    notifications_enabled?: boolean;
    email_notifications?: boolean;
  };
  trial_end?: string;
  onboarding_completed?: boolean;
}

export interface UserProfile extends User {
  created_at: string;
  updated_at: string;
}
