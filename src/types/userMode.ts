
export type UserModeType = 'b2c' | 'b2b_user' | 'b2b_admin';

export interface UserModeContextType {
  mode: UserModeType;
  setMode: (mode: UserModeType) => void;
  userMode: UserModeType;
  setUserMode: (mode: UserModeType) => void;
  isLoading: boolean;
}
