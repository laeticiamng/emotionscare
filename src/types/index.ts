
export interface Emotion {
  emotion: string;
  score: number;
  intensity?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar_url?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  cover?: string;
  coverUrl?: string;
  cover_url?: string;
  source?: string;
  file?: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  duration: number;
  cover?: string;
  source: string;
  category: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration: number;
  source: string;
  category: string;
  tags?: string[];
  coach?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  date: Date | string;
  tags?: string[];
}

export interface NotificationType {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date | string;
}
