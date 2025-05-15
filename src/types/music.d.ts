
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration: number;
  // Additional properties found in usage
  category?: string;
  mood?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  // Additional properties found in usage
  description?: string;
  category?: string;
  coverUrl?: string;
}

export interface MusicLibraryProps {
  playlists: MusicPlaylist[];
  onSelectPlaylist: (playlist: MusicPlaylist) => void;
  // Add missing properties
  onSelectTrack?: (track: MusicTrack) => void;
}

export { type ProgressBarProps, type VolumeControlProps } from './audio-player';
