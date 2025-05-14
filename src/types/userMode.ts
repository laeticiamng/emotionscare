
export type UserMode = 'personal' | 'professional' | 'anonymous' | 'b2b-admin' | 'b2c' | 'b2b-user' | 'b2b-collaborator' | 'team';

export interface UserModeContextType {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  
  // Add missing property
  isLoading: boolean;
}
