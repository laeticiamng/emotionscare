
export interface Track {
  id: string;
  title: string;
  artist?: string;
  url?: string;
  audioUrl?: string;
  track_url?: string;
  coverUrl?: string;
  coverImage?: string;
  cover?: string;
  duration?: number;
  emotion?: string;
  intensity?: number;
  category?: string;
}

export interface Playlist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  emotion?: string;
  tracks: Track[];
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}
