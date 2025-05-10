
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

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  currentPlaylist: MusicPlaylist | null; 
  isPlaying: boolean;
  volume: number;
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  initializeMusicSystem: () => void;
  error: Error | null;
  currentEmotion?: string;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
}
