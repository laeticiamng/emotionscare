
// User roles
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

// User type
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: string;
  avatar?: string;
}

// Music types
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  coverImage?: string;
  audioUrl?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: MusicTrack[];
  emotion?: string;
}

// Emotion detection types
export interface EmotionResult {
  emotion: string;
  confidence: number;
  transcript?: string;
  emojis?: string[];
}

// Theme types
export type ThemeName = 'light' | 'dark' | 'pastel';
