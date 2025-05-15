
export type UserModeType = 'B2C' | 'B2B-USER' | 'B2B-ADMIN' | 'B2B-SELECTION' | 'b2c' | 'b2b_user' | 'b2b_admin' | 'coach';

export interface UserModeContextType {
  mode: UserModeType;
  setMode: (mode: UserModeType) => void;
  userMode?: UserModeType;
  setUserMode?: (mode: UserModeType) => void;
}
