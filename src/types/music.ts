
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  cover?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  emotion?: string;
  description?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  preferences?: Record<string, any>;
}
