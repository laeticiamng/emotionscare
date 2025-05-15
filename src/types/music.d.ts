
export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
  preference?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl?: string;
  cover?: string;
  cover_url?: string;
  url?: string;
  audioUrl?: string;
  category?: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  name?: string;
  description?: string;
  category?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
}
