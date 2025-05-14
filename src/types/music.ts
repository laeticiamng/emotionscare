
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  audioUrl?: string;
  emotion?: string;
}

export interface Playlist {
  id: string;
  name: string;
  emotion?: string;
  tracks: Track[];
  title?: string;
  description?: string;
  coverImage?: string;
}

export interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  playlist: Track[];
  loadPlaylist: (tracks: Track[]) => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<void>;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seekTo: (progress: number) => void;
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverUrl?: string;
  emotion?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
}

export interface MusicRecommendation {
  playlistId?: string;
  playlistName?: string;
  emotion: string;
  description: string;
  tracks?: Track[];
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

export interface ProgressBarProps {
  progress: number;
  onSeek: (value: number) => void;
  duration: number;
}

export interface TrackInfoProps {
  track: Track | null;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
}
