
export type UserModeType = 'b2c' | 'b2b' | 'b2b_user' | 'b2b_admin' | 'b2b-user' | 'b2b-admin' | 'b2b-collaborator' | 'individual' | 'professional';

export interface UserModeContextType {
  mode: UserModeType;
  setMode: (mode: UserModeType) => void;
  userMode: UserModeType;
  setUserMode: (mode: UserModeType) => void;
  isLoading: boolean;
}
