
import { Track, Playlist, EmotionMusicParams } from '../contexts/music/types';

export interface MusicTrack extends Track {
  id: string;
  title: string;
  url: string;
  artist?: string;
  coverUrl?: string;
  cover?: string;
  audioUrl?: string;
  duration?: number;
  emotion?: string;
  intensity?: number;
  category?: string;
  emotionalTone?: string;
}

export interface MusicPlaylist extends Playlist {
  id: string;
  name: string;
  title?: string;
  tracks: MusicTrack[];
  emotion?: string;
  coverUrl?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  duration: number;
  position: number;
  playTrack: (track: MusicTrack) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seekTo: (position: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  loadPlaylistForEmotion?: (params: EmotionMusicParams) => Promise<MusicPlaylist>;
}

export interface MusicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ProgressBarProps {
  position: number;
  duration: number;
  onSeek: (position: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export interface MusicLibraryProps {
  onSelectTrack: (track: MusicTrack) => void;
  currentTrack?: MusicTrack | null;
}

export { EmotionMusicParams };
