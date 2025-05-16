
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  coverUrl: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  coverUrl: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  loadTrack: (track: MusicTrack) => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  adjustVolume: (increment: boolean) => void;
  seekTo: (time: number) => void;
  togglePlay: () => void;
  setPlaylist: (playlist: MusicPlaylist) => void;
  loadPlaylistForEmotion: (emotion: string | EmotionMusicParams) => Promise<MusicPlaylist | null>;
  setEmotion: (emotion: string) => void;
  openDrawer?: boolean;
  setOpenDrawer?: (open: boolean) => void;
}

export interface MusicDrawerProps {
  open?: boolean;
  onClose?: () => void;
}

export interface Track {
  id: string;
  title: string;
  artist?: string;
  url: string;
  audioUrl?: string;
  coverUrl?: string;
  cover?: string;
  duration?: number;
  emotion?: string;
  intensity?: number;
  category?: string;
}

export interface ProgressBarProps {
  progress: number;
  total: number;
  onSeek: (value: number) => void;
}

export interface TrackInfoProps {
  title: string;
  artist: string;
  coverUrl: string;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
}

export interface MusicLibraryProps {
  onTrackSelect: (track: Track) => void;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}
