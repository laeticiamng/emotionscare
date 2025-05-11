export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover_url?: string;
  coverUrl?: string;
  cover?: string;
  coverImage?: string;
  bpm?: number;
  mood?: string;
  intensity?: number;
  
  // Add missing properties
  audio_url?: string;
  audioUrl?: string;
  emotion?: string;
  emotion_tag?: string;
  externalUrl?: string;
  genre?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  tracks: MusicTrack[];
  mood?: string;
  cover_url?: string;
  
  // Add missing properties
  emotion?: string;
}

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  currentPlaylist: MusicPlaylist | null;
  volume: number;
  openDrawer: boolean;
  error: string | null;
  togglePlay: () => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  setOpenDrawer: (open: boolean) => void;
  initializeMusicSystem: () => Promise<void>;
  
  // Add missing properties
  playlists?: MusicPlaylist[];
  loadPlaylistById?: (id: string) => Promise<MusicPlaylist | null>;
  currentEmotion?: string;
  toggleRepeat?: () => void;
  toggleShuffle?: () => void;
  loadPlaylistForEmotion?: (emotion: string) => Promise<MusicPlaylist | null>;
}

export interface MusicDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  
  // Add for backward compatibility
  isOpen?: boolean;
  onClose?: () => void;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onChange: (time: number) => void;
}

export interface TrackInfoProps {
  track: MusicTrack | null;
  isPlaying: boolean;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
}

export interface MusicRecommendationCardProps {
  title?: string;
  emotion?: string;
  onSelect?: () => void;
  
  // Add missing properties
  intensity?: number;
  standalone?: boolean;
  className?: string;
}
