
export type UserModeType = 'b2c' | 'b2b-user' | 'b2b-admin' | 'b2b_user' | 'b2b_admin';

export interface UserModeContextType {
  mode: UserModeType;
  setMode: (mode: UserModeType) => void;
  userMode: UserModeType;
  setUserMode: (mode: UserModeType | string) => void;
  isLoading: boolean;
}

export const normalizeUserMode = (mode: string | UserModeType | null | undefined): UserModeType => {
  if (!mode) return 'b2c';
  
  const lowerMode = typeof mode === 'string' ? mode.toLowerCase() : mode;
  
  switch (lowerMode) {
    case 'b2c':
    case 'particulier':
    case 'individual':
    case 'user':
      return 'b2c';
    case 'b2b-user':
    case 'b2b_user':
    case 'b2buser':
    case 'b2b-collaborator':
    case 'collaborateur':
      return 'b2b-user';
    case 'b2b-admin':
    case 'b2b_admin':
    case 'b2badmin':
    case 'admin':
    case 'rh':
    case 'manager':
      return 'b2b-admin';
    default:
      return 'b2c';
  }
};
