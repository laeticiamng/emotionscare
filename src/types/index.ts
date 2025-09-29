export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  avatar?: string;
  avatar_url?: string;
}

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack?: any;
  setOpenDrawer?: (open: boolean) => void;
}

export * from './emotion';
export * from './theme';
export * from './auth';
export * from './ambition';