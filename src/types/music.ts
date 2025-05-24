
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  artwork?: string;
  emotion?: string;
}

export interface MusicTrack extends Track {
  audioUrl?: string;
  genre?: string;
  coverUrl?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  tracks: MusicTrack[];
  description?: string;
  tags?: string[];
  creator?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  genre?: string;
}

export interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  playlist: Track[];
  play: (track?: Track) => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  setPlaylist: (tracks: Track[]) => void;
  loadPlaylistForEmotion?: (params: EmotionMusicParams) => Promise<MusicPlaylist | null>;
}
