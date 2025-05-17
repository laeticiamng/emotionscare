
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  src: string;
  cover?: string;
  emotion?: string;
  playlist?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  coverImage?: string;
  description?: string;
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
  setPlaylist: (tracks: MusicTrack[]) => void;
  togglePlay: () => void;
  addToPlaylist: (track: MusicTrack) => void;
  createPlaylist: (name: string, tracks?: MusicTrack[]) => MusicPlaylist;
  removeFromPlaylist: (trackId: string) => void;
  getTracksByEmotion: (emotion: string) => MusicTrack[];
  progress: number;
}

export interface MusicDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ProgressBarProps {
  progress: number;
  duration: number;
  onSeek: (position: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (value: number) => void;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export interface MusicLibraryProps {
  tracks: MusicTrack[];
  onSelectTrack: (track: MusicTrack) => void;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface TrackInfoProps {
  track: MusicTrack | null;
}
