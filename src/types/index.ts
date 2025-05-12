
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

// Removed duplicate MusicTrack definition since it's now in types/music.ts

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

// Removed duplicate JournalEntry definition since it's now in types.ts

export interface NotificationType {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date | string;
}
