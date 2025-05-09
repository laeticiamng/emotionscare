
// Music related types
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  audioUrl?: string;
  coverUrl?: string;
  coverImage?: string;
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

// Backward compatibility aliases
export type Track = MusicTrack;
export type Playlist = MusicPlaylist;
