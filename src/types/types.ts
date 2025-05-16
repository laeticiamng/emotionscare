
export interface Story {
  id: string;
  title: string;
  content: string;
  type: 'onboarding' | 'notification' | 'achievement' | 'tip';
  seen: boolean;
  date?: Date | string;
  cta?: {
    label: string;
    route: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
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
