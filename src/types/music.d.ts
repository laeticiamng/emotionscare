
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  src?: string;
  emotion?: string;
  coverArt?: string;
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
}

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  volume: number;
  playlist: MusicTrack[];
  allTracks: MusicTrack[];
  playlists: MusicPlaylist[];
  play: () => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  setTrack: (track: MusicTrack) => void;
  setVolume: (volume: number) => void;
  setPlaylist: (playlist: MusicTrack[]) => void;
  togglePlay: () => void;
  addToPlaylist: (track: MusicTrack) => void;
  createPlaylist: (name: string, tracks?: MusicTrack[]) => MusicPlaylist;
  removeFromPlaylist: (trackId: string) => void;
  getTracksByEmotion: (emotion: string) => MusicTrack[];
  progress: number;
  loadPlaylist?: (playlistId: string) => void;
}

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
