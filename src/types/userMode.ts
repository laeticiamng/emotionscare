
export type UserModeType = 'b2c' | 'b2b_user' | 'b2b_admin' | 'b2b-user' | 'b2b-admin';

export interface UserModeContextType {
  userMode: UserModeType | null;
  setUserMode: (mode: UserModeType | null) => void;
  isLoading: boolean;
}
