import { EmotionResult } from './emotion';

export interface MoodData {
  mood: string;
  intensity: number;
  timestamp?: string;
  userId?: string;
  date?: string;
  sentiment?: string;
}

export interface AudioPlaylist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  cover_url?: string;
  tracks: AudioTrack[];
  createdAt?: string;
  updatedAt?: string;
  category?: string;
  tags?: string[];
  user_id?: string;
  isPublic?: boolean;
  duration?: number;
  likes?: number;
  plays?: number;
  mood?: string;
  emotion?: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  duration: number;
  url: string;
  track_url?: string;
  coverUrl?: string;
  cover_url?: string;
  createdAt?: string;
  updatedAt?: string;
  playlistId?: string;
  user_id?: string;
  isPublic?: boolean;
  likes?: number;
  plays?: number;
  mood?: string;
  emotion?: string;
  category?: string;
  tags?: string[];
}

export interface AudioProcessorProps {
  audioUrl: string;
  onDataReceived: (data: any) => void;
  onError: (error: any) => void;
}

export interface MusicContextType {
  currentTrack: AudioTrack | null;
  playlist: AudioPlaylist | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playTrack: (track: AudioTrack, playlist?: AudioPlaylist | null) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  loadPlaylist: (playlist: AudioPlaylist) => void;
  clearPlaylist: () => void;
}

export interface MusicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export interface MusicLibraryProps {
  playlists: AudioPlaylist[];
  onPlaylistSelect: (playlist: AudioPlaylist) => void;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  category?: string;
  mood?: string;
}

export interface TrackInfoProps {
  track: AudioTrack;
}

export interface EmotionalData {
  emotion: string;
  intensity: number;
  timestamp: string;
}
