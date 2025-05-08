
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl?: string;
  coverUrl?: string;
  duration?: number;
  genre?: string;
  mood?: string;
  year?: number;
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
