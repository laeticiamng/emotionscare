
// Basic audio types that will be extended by music types
export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  duration: number;
  url?: string;
  audioUrl?: string;
  coverUrl?: string;
  album?: string;
  year?: number;
  genre?: string;
  emotion?: string;
}

export interface AudioPlaylist {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  tracks: AudioTrack[];
  emotion?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export type { AudioTrack, AudioPlaylist, EmotionMusicParams };
