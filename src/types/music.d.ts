
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  src?: string;
  audioUrl?: string;
  track_url?: string;
  coverUrl?: string;
  coverImage?: string;
  cover?: string;
  emotion?: string;
  intensity?: number;
  category?: string;
  album?: string;
  year?: number;
  genre?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  description?: string;
  coverImage?: string;
  createdBy?: string;
  createdAt?: string;
  isPublic?: boolean;
  tags?: string[];
  title?: string;
  emotion?: string;
}

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  volume: number;
  playlist: MusicPlaylist | MusicTrack[] | null;
  allTracks: MusicTrack[];
  playlists: MusicPlaylist[];
  play: () => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  setTrack: (track: MusicTrack) => void;
  setVolume: (volume: number) => void;
  setPlaylist: (playlist: MusicTrack[] | MusicPlaylist) => void;
  togglePlay: () => void;
  addToPlaylist: (track: MusicTrack) => void;
  createPlaylist: (name: string, tracks?: MusicTrack[]) => MusicPlaylist;
  removeFromPlaylist: (trackId: string) => void;
  getTracksByEmotion: (emotion: string) => MusicTrack[];
  progress: number;
  loadPlaylist?: (playlistId: string) => void;
}

// Additional interfaces kept the same
export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

export interface ProgressBarProps {
  progress: number;
  onSeek?: (value: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
}

export interface MusicControlsProps {
  minimal?: boolean;
}

export interface MusicLibraryProps {
  onTrackSelect: (track: MusicTrack) => void;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface TrackInfoProps {
  track: MusicTrack | null;
}
