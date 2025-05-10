
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverImage?: string;
  emotion?: string;
  intensity?: number;
  bpm?: number;
  genre?: string;
  isExclusive?: boolean;
  // Backward compatibility properties
  cover?: string;
  coverUrl?: string;
  audioUrl?: string;
  audioSrc?: string;
  album?: string;
  artwork?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  tracks: MusicTrack[];
  emotion?: string;
  totalDuration?: number;
  isCustom?: boolean;
}

export interface MusicPreferences {
  volume: number;
  autoplay: boolean;
  crossfade: boolean;
  crossfadeDuration: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
  emotionSync: boolean;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  playlists: MusicPlaylist[];
  playlist: MusicPlaylist | null;
  currentPlaylist: MusicPlaylist | null;
  currentTime: number;
  duration: number;
  loading: boolean;
  error: string | null;
  audioState: {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
  };
  currentEmotion?: string;
  preferences: MusicPreferences;
  
  // Player controls
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  seekTo: (time: number) => void;
  
  // Track operations
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  
  // Playlist operations
  loadPlaylist: (playlist: MusicPlaylist) => void;
  loadPlaylistById: (id: string) => void;
  loadPlaylistForEmotion: (emotion: string) => MusicPlaylist | null;
  
  // UI controls
  setOpenDrawer: (open: boolean) => void;
  initializeMusicSystem: () => void;
  setAudioState: (state: any) => void;
  openDrawer: boolean;
}
