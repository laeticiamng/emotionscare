
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverUrl?: string;
  artworkUrl?: string;
  cover?: string;
  audioUrl?: string;
  streamUrl?: string;
  duration?: number;
  mood?: string;
  emotion?: string;
  tags?: string[];
  description?: string;
  summary?: string;
  source?: string;
  category?: string;
  genre?: string;
  bpm?: number;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title: string;
  description?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  coverImage?: string;
  emotion?: string;
  mood?: string;
  category?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  genre?: string;
  tempo?: string;
  duration?: number;
}

export interface MusicContextType {
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  playlist?: MusicPlaylist | null;
  tracks?: MusicTrack[];
  playTrack?: (track: MusicTrack) => void;
  pauseTrack?: () => void;
  resumeTrack?: () => void;
  nextTrack?: () => void;
  prevTrack?: () => void;
  stopTrack?: () => void;
  seekTo?: (time: number) => void;
  setVolume?: (volume: number) => void;
  volume?: number;
  duration?: number;
  currentTime?: number;
  progress?: number;
  playlists?: MusicPlaylist[];
  loadPlaylist?: (id: string) => void | Promise<MusicPlaylist | null>;
  loadPlaylistForEmotion?: (params: EmotionMusicParams) => Promise<MusicPlaylist | null>;
  setOpenDrawer?: (open: boolean) => void;
  isOpenDrawer?: boolean;
  play?: () => void;
  pause?: () => void;
  resume?: () => void;
  togglePlay?: () => void;
}
