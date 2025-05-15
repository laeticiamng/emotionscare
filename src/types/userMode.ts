
// Types liés au mode utilisateur
export type UserModeType = 'B2C' | 'B2B-USER' | 'B2B-ADMIN' | 'B2B-SELECTION';

export interface UserModeContextType {
  mode: UserModeType;
  setMode: (mode: UserModeType) => void;
  userMode?: UserModeType; // Pour compatibilité avec le code existant
  setUserMode?: (mode: UserModeType) => void; // Pour compatibilité
  setAdminMode?: () => void;
  setUserMode?: () => void;
  setB2CMode?: () => void;
  isAdmin?: () => boolean;
  isUser?: () => boolean;
  isB2C?: () => boolean;
}
