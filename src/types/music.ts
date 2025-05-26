
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  coverUrl?: string;
  emotion?: string;
  genre?: string;
  mood?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  tracks: MusicTrack[];
  tags?: string[];
  creator?: string;
  coverUrl?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity: number;
  genre?: string;
  duration?: number;
}

export interface MusicPlayerState {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
}

export interface MusicRecommendation {
  tracks: MusicTrack[];
  emotion: string;
  confidence: number;
  reasoning?: string;
}
