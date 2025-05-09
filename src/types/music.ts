
// Directly define the types here rather than re-exporting them from index.ts
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number; // Changed from optional to required
  audioUrl?: string;
  coverUrl?: string;
  coverImage?: string;
  url?: string;
  cover?: string;
  externalUrl?: string;
  genre?: string;
  emotion?: string;
  mood?: string;
  year?: number;
  isPlaying?: boolean;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  emotion?: string;
  tracks: MusicTrack[];
}

export type MusicEmotion = 'calm' | 'happy' | 'focused' | 'energetic' | 'neutral';

// For backward compatibility
export type Track = MusicTrack;
