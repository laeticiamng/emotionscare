
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  audioUrl?: string;
  artwork?: string;
  emotion?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: MusicTrack[];
  category?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  loadPlaylist?: (playlist: MusicPlaylist) => void;
  loadPlaylistForEmotion?: (emotion: string) => Promise<MusicPlaylist | null>;
}

export interface MusicDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentTrack?: MusicTrack;
  playlist?: MusicPlaylist;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  artwork?: string;
  url: string;
  duration: number;
  audioUrl?: string;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  onSeek?: (value: number) => void;
}

export interface TrackInfoProps {
  track: Track;
}

export interface VolumeControlProps {
  value: number;
  onChange: (value: number) => void;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}
