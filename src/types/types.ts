
export interface Story {
  id: string;
  title: string;
  content: string;
  type: 'onboarding' | 'notification' | 'achievement' | 'tip' | string;
  seen: boolean;
  date?: Date | string;
  cta?: {
    label: string;
    route: string;
  };
}

export type UserRole = 'user' | 'admin' | 'b2b_user' | 'b2b_admin' | 'b2b-user' | 'b2b-admin' | 'collaborator' | 'b2c' | string;

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  avatar?: string;
  preferences?: {
    theme: string;
    fontSize: string;
    fontFamily: string;
    reduceMotion: boolean;
    colorBlindMode: boolean;
    autoplayMedia: boolean;
    soundEnabled: boolean;
  };
}

export type Period = 'day' | 'week' | 'month' | 'year' | string;
export type UserModeType = 'personal' | 'team' | 'organization' | string;
