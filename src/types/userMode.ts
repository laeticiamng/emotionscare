
export type UserModeType = 'b2c' | 'b2b_user' | 'b2b_admin';

export interface UserModeConfig {
  mode: UserModeType;
  label: string;
  description: string;
  features: string[];
  loginPath: string;
  dashboardPath: string;
}
