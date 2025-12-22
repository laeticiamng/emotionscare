export type UserModeType = 'b2c' | 'b2b_user' | 'b2b_admin';

export interface UserModeContextType {
  userMode: UserModeType | null;
  setUserMode: (mode: UserModeType) => void;
  changeUserMode: (mode: UserModeType) => void;
  isLoading: boolean;
}
