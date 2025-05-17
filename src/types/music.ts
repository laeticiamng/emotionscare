
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  url: string;
  cover?: string;
  duration?: number;
  emotion?: string;
  genre?: string;
  intensity?: number;
  year?: number;
  bpm?: number;
  instrumentalness?: number;
  valence?: number;
  energy?: number;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: MusicTrack[];
  cover?: string;
  emotion?: string;
  createdAt?: string;
  duration?: number;
  author?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  queue: MusicTrack[];
  playlists: MusicPlaylist[];
  history: MusicTrack[];
  repeatMode: 'none' | 'one' | 'all';
  shuffleMode: boolean;
  setCurrentTrack: (track: MusicTrack) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  addToQueue: (track: MusicTrack) => void;
  clearQueue: () => void;
  removeFromQueue: (trackId: string) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  playPlaylist: (playlist: MusicPlaylist) => void;
  playTrack: (track: MusicTrack) => void;
  playTracks: (tracks: MusicTrack[]) => void;
  getEmotionPlaylist: (emotion: string) => MusicPlaylist | null;
  getRecommendedTracks: (limit?: number) => MusicTrack[];
  playSimilar: (track: MusicTrack) => void;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

export interface ProgressBarProps {
  progress: number;
  duration: number;
  onSeek: (time: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  shuffleMode: boolean;
  repeatMode: 'none' | 'one' | 'all';
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
}

export interface MusicLibraryProps {
  onSelect?: (track: MusicTrack) => void;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  energy?: number;
  limit?: number;
}

export interface TrackInfoProps {
  track: MusicTrack | null;
}
