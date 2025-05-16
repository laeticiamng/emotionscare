
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url?: string;
  audioUrl: string;
  coverUrl?: string;
  cover_url?: string;
  emotionalTone?: string;
  genreId?: string;
  albumId?: string;
  playCount?: number;
  isFavorite?: boolean;
  bpm?: number;
  moodScore?: number;
  energyLevel?: number;
  visualizerType?: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  description?: string;
  authorId?: string;
  authorName?: string;
  createdAt?: string;
  updatedAt?: string;
  isPublic?: boolean;
  mood?: string;
  category?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (position: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  muted: boolean;
  onMuteToggle: () => void;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export interface TrackInfoProps {
  track: MusicTrack | null;
}

export interface MusicLibraryProps {
  tracks?: MusicTrack[];
  playlists?: MusicPlaylist[];
  onTrackSelect?: (track: MusicTrack) => void;
  onPlaylistSelect?: (playlist: MusicPlaylist) => void;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  muted: boolean;
  currentTime: number;
  duration: number;
  currentEmotion: string | null;
  emotion: string | null;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams) => Promise<MusicPlaylist | null>;
  setEmotion: (emotion: string | null) => void;
  setOpenDrawer?: (open: boolean) => void;
}
