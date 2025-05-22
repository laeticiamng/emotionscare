
export type UserModeType = 'b2c' | 'b2b_user' | 'b2b_admin';

export interface UserModeContextType {
  userMode: UserModeType | null;
  setUserMode: (mode: UserModeType | null) => void;
  isLoading: boolean;
}

export const USER_MODES = {
  B2C: 'b2c' as UserModeType,
  B2B_USER: 'b2b_user' as UserModeType,
  B2B_ADMIN: 'b2b_admin' as UserModeType,
  ADMIN: 'admin' as UserModeType
};

export const USER_MODE_LABELS: Record<string, string> = {
  'b2c': 'Particulier',
  'b2b_user': 'Collaborateur',
  'b2b_admin': 'Administrateur',
  'admin': 'Super Admin'
};
