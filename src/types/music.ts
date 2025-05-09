
// Music related types
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  audioUrl?: string;
  emotion?: string;
}

export interface Playlist {
  id: string;
  name: string;
  emotion?: string;
  tracks: Track[];
}

export type MusicEmotion = 'calm' | 'happy' | 'focused' | 'energetic' | 'neutral';

// Re-export types for backward compatibility
export type { MusicTrack, MusicPlaylist } from './index';
