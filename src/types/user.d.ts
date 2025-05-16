
export type UserRole = 'user' | 'b2c' | 'b2b_user' | 'b2b_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: UserRole;
  created_at: string;
  preferences?: {
    theme: string;
    fontSize: string;
    fontFamily: string;
    reduceMotion: boolean;
    colorBlindMode: boolean;
    autoplayMedia: boolean;
    soundEnabled: boolean;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      frequency: string;
    }
  };
}
