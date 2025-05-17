
export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  description?: string;
  duration: number;
  url: string;
  audioUrl?: string;
  coverUrl?: string;
  category?: string;
  mood?: string;
  tags?: string[];
  source?: string;
}

export interface AudioPlaylist {
  id: string;
  name: string;
  tracks: AudioTrack[];
  description?: string;
  coverUrl?: string;
  emotion?: string;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTrack: AudioTrack | null;
  playlist: AudioPlaylist | null;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  loading: boolean;
  shuffleMode: boolean;
  repeatMode: 'off' | 'one' | 'all';
}

export interface AudioContextValue {
  // État du lecteur
  isPlaying: boolean;
  currentTrack: AudioTrack | null;
  playlist: AudioPlaylist | null;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  loading: boolean;
  shuffleMode: boolean;
  repeatMode: 'off' | 'one' | 'all';
  
  // Méthodes
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  loadPlaylist: (playlist: AudioPlaylist) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams) => Promise<AudioPlaylist | null>;
  setOpenDrawer: (open: boolean) => void;
  openDrawer: boolean;
  setEmotion: (emotion: string) => void;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}
