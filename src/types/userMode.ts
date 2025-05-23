
export type UserModeType = 'b2c' | 'b2b_user' | 'b2b_admin';

export interface UserModeContextType {
  userMode: UserModeType | null;
  setUserMode: React.Dispatch<React.SetStateAction<UserModeType | null>>;
  isLoading: boolean;
  changeUserMode: (mode: UserModeType) => void;
  clearUserMode?: () => void;
}
