
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl?: string;
  coverUrl?: string;
  duration?: number;
  genre?: string;
  emotion?: string;
  mood?: string;
  year?: number;
  url?: string;
  cover?: string;
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
