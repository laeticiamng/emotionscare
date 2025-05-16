
import { MusicPlaylist } from './music';

export { MusicPlaylist };

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'user' | 'admin' | 'guest';
}

export interface Story {
  id: string;
  title: string;
  content: string;
  type: 'onboarding' | 'tip' | 'notification';
  seen: boolean;
  cta?: {
    label: string;
    route: string;
  };
}
