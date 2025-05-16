
export interface Track {
  id: string;
  title: string;
  artist?: string;
  url: string;
  audioUrl?: string;
  coverUrl?: string;
  cover?: string;
  duration?: number;
  emotion?: string;
  intensity?: number;
  category?: string;
}

export interface Playlist {
  id: string;
  name: string;
  emotion?: string;
  tracks: Track[];
  title?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}
