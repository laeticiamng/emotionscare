
import { ReactNode } from 'react';

// Types utilisés par les services de musique
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url?: string;
  cover?: string;
  coverUrl: string;
  emotion?: string;
  audioUrl: string;
  audio_url?: string;
}

export interface MusicPlaylist {
  id: string;
  name?: string;
  emotion?: string;
  tracks: MusicTrack[];
  title?: string; // Ajouté pour la compatibilité
  description?: string; // Ajouté pour la compatibilité
}

// Props pour les composants de musique
export interface MusicContextType {
  playlists: MusicPlaylist[];
  currentPlaylist: MusicPlaylist | null;
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  loadPlaylist: (playlist: MusicPlaylist) => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seekToPosition: (position: number) => void;
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<boolean>;
}

export interface MusicDrawerProps {
  onClose?: () => void;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration: number;
}

export interface ProgressBarProps {
  progress: number;
  duration: number;
  onSeek?: (position: number) => void;
}

export interface TrackInfoProps {
  track?: Track;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange?: (volume: number) => void;
}
