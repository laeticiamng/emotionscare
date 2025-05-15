
import { ReactNode } from 'react';

/**
 * Basic track interface
 */
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverUrl?: string;
  cover_url?: string;
}

/**
 * Music track with additional metadata
 */
export interface MusicTrack extends Track {
  genre?: string;
  emotion?: string;
  bpm?: number;
  energy?: number;
  playlist_id?: string;
  playlistId?: string;
  audioUrl?: string;
  audio_url?: string;
  cover?: string;
}

/**
 * Music playlist
 */
export interface MusicPlaylist {
  id: string;
  title: string;
  description?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  cover_url?: string;
  emotion?: string;
  category?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  is_default?: boolean;
  name?: string;
}

/**
 * Context type for music player
 */
export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  playlists: MusicPlaylist[];
  currentPlaylist: MusicPlaylist | null;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  addPlaylist: (playlist: MusicPlaylist) => void;
  removePlaylist: (playlistId: string) => void;
  setCurrentPlaylist: (playlist: MusicPlaylist) => void;
  addTrackToPlaylist: (playlistId: string, track: MusicTrack) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
}

/**
 * Props for music drawer component
 */
export interface MusicDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  playlist?: MusicPlaylist | null;
  currentTrack?: MusicTrack | null;
  children?: ReactNode;
}

/**
 * Props for track info component
 */
export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
  showArtist?: boolean;
  showCover?: boolean;
}

/**
 * Props for progress bar component
 */
export interface ProgressBarProps {
  value: number;
  max: number;
  onChange?: (value: number) => void;
  className?: string;
  formatLabel?: (value: number) => string;
  showLabels?: boolean;
}

/**
 * Props for volume control component
 */
export interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
  className?: string;
}

/**
 * Parameters for emotion-based music recommendations
 */
export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  energy?: number;
  genre?: string[];
  excludedGenres?: string[];
  mood?: string;
  tempo?: 'slow' | 'medium' | 'fast';
  limit?: number;
}
