
export type UserModeType = 'b2c' | 'b2b-user' | 'b2b-admin' | 'b2b_user' | 'b2b_admin';

export interface UserModeContextType {
  userMode: UserModeType;
  setUserMode: (mode: UserModeType | string) => void;
  clearUserMode: () => void;
  isLoading: boolean;
}
