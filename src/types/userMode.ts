
export type UserModeType = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin';

export interface UserModeContextType {
  mode: UserModeType;
  setMode: (mode: UserModeType) => void;
  previousMode?: UserModeType;
  setPreviousMode?: (mode: UserModeType) => void;
  setModeWithHistory?: (mode: UserModeType) => void;
  goBack?: () => void;
  isAdmin?: boolean;
  isB2B?: boolean;
  isB2C?: boolean;
}

export const USER_MODES = {
  B2C: 'b2c',
  B2B_USER: 'b2b_user',
  B2B_ADMIN: 'b2b_admin',
  ADMIN: 'admin'
} as const;

export const USER_MODE_LABELS: Record<UserModeType, string> = {
  b2c: 'Particulier',
  b2b_user: 'Collaborateur',
  b2b_admin: 'Responsable RH',
  admin: 'Administrateur'
};
