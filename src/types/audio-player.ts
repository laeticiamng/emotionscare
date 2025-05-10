
export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  repeat: boolean;
  shuffle: boolean;
  error: Error | null;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  coverImage?: string;
  emotion?: string;
  tags?: string[];
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  showLabel?: boolean;
  className?: string;
}

export interface TrackInfoProps {
  track?: MusicTrack | null;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack | null;
  loadingTrack?: boolean;
  audioError?: Error | null;
}
