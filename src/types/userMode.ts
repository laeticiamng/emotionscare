
export type UserMode = 'personal' | 'professional' | 'anonymous' | 'b2b-admin' | 'b2c';

export interface UserModeContextType {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  
  // Add missing property
  isLoading: boolean;
}
