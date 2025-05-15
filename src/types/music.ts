
import { Emotion } from './emotion';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  cover_url?: string;
  emotion?: string;
  audioUrl?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  emotion?: string;
  category?: string;
  coverUrl?: string;
  cover_url?: string;
  cover?: string;
  title?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  duration: number;
  currentTime: number;
  play: (track?: MusicTrack, playlist?: MusicPlaylist) => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  playFromPlaylist: (playlist: MusicPlaylist, index?: number) => void;
  playByEmotion: (emotion: string) => void;
}

export interface MusicDrawerProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack;
}

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  className?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  mode?: 'focus' | 'relax' | 'energize' | 'comfort';
}

export type Track = MusicTrack;
