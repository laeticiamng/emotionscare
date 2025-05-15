
// Types liés au mode utilisateur
export type UserModeType = 'b2c' | 'b2b_user' | 'b2b_admin' | 'coach' | 'b2b-admin' | 'b2b-user';

export interface UserModeContextType {
  userMode: UserModeType;
  setUserMode: (mode: UserModeType) => void;
  isConsumerMode: boolean;
  isBusinessMode: boolean;
  isAdminMode: boolean;
  isCoachMode: boolean;
  switchToConsumer: () => void;
  switchToBusiness: () => void;
  switchToAdmin: () => void;
  switchToCoach: () => void;
}
