
export type UserModeType = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin';

export interface UserModeContextType {
  userMode: UserModeType;
  setUserMode: (mode: UserModeType | string) => void;
  clearUserMode: () => void;
  isLoading: boolean;
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
