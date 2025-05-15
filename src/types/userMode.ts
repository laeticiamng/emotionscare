
export type UserModeType = 'b2c' | 'b2b-user' | 'b2b-admin';

export interface UserModeContextType {
  mode: UserModeType;
  setMode: (mode: UserModeType) => void;
  userMode: UserModeType;
  setUserMode: (mode: UserModeType | string) => void;
  isLoading: boolean;
}

export const normalizeUserMode = (mode: string | UserModeType): UserModeType => {
  switch (mode) {
    case 'b2c':
    case 'B2C':
    case 'particulier':
      return 'b2c';
    case 'b2b-user':
    case 'B2B-user':
    case 'collaborateur':
    case 'b2b_user':
      return 'b2b-user';
    case 'b2b-admin':
    case 'B2B-admin':
    case 'admin':
    case 'rh':
    case 'manager':
    case 'b2b_admin':
      return 'b2b-admin';
    default:
      return 'b2c'; // Default to b2c if unknown mode
  }
};
