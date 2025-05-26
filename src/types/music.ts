
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  url: string;
  duration: number;
  emotion?: string;
  coverUrl?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
}
