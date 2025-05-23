
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  url?: string;
  cover_url?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  duration?: number; // total duration in seconds
  emotion_type?: string; // what emotion this playlist is designed for
  created_at?: string; // ISO date string
}

export interface MusicGenerationResult {
  id: string;
  url: string | null;
  prompt: string;
  style: string;
  duration: number;
  status: 'generated' | 'processing' | 'error';
}
