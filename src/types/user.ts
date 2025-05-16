
export type UserRole = 'admin' | 'user' | 'manager' | 'coach' | 'guest' | 'b2b_user' | 'b2b_admin' | 'b2b-user' | 'b2b-admin' | 'collaborator' | 'b2c' | 'moderator' | 'wellbeing_manager' | 'employee' | 'team_lead' | 'professional' | 'individual';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  avatar?: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
  last_login?: string;
  is_active?: boolean;
  position?: string;
  department?: string;
  joined_at?: string;
  emotional_score?: number;
  onboarded?: boolean;
  preferences?: {
    theme?: string;
    language?: string;
    notifications_enabled?: boolean;
    privacy?: {
      profileVisibility?: 'public' | 'private' | 'team';
    };
    profileVisibility?: 'public' | 'private' | 'team';
  };
  company_id?: string;
  settings?: Record<string, any>;
}
