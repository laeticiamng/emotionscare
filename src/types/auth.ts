
// User Role that can access the platform
export type UserRole = 
  | 'admin' | 'user' | 'manager' | 'coach' | 'guest' 
  | 'b2b_admin' | 'b2b_user' | 'b2c' | 'moderator' | 'wellbeing_manager' 
  | 'employee' | 'team_lead' | 'professional' | 'individual'
  | 'b2b-admin' | 'b2b-user' | 'b2b-collaborator';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  onboarded?: boolean;
  preferences?: {
    theme?: string;
    fontSize?: string;
    fontFamily?: string;
    reduceMotion?: boolean;
    colorBlindMode?: boolean;
    autoplayMedia?: boolean;
    sound?: boolean | {
      volume?: number;
      effects?: boolean;
      music?: boolean;
    };
    [key: string]: any;
  };
  department?: string;
  position?: string;
  job_title?: string;
  company_id?: string;
  team_id?: string;
  last_active?: string;
}
