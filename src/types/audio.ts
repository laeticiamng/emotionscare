
// Define AudioTrack type
export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  audioUrl?: string;
  coverUrl?: string;
  coverImage?: string;
  cover?: string;
  album?: string;
  genre?: string;
  emotion?: string;
  intensity?: number;
  category?: string;
}

// Define AudioPlaylist type
export interface AudioPlaylist {
  id: string;
  title: string;
  tracks: AudioTrack[];
  description?: string;
  coverImage?: string;
  emotion?: string;
  mood?: string;
}

// Audio Player State
export interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  playlist: AudioTrack[];
  repeatMode: 'off' | 'all' | 'one';
  shuffleMode: boolean;
}

// Audio Context Value
export interface AudioContextValue {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  playlist: AudioTrack[];
  repeatMode: 'off' | 'all' | 'one';
  shuffleMode: boolean;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleMute: () => void;
  toggleRepeatMode: () => void;
  toggleShuffleMode: () => void;
}

// Parameters for emotion-based music
export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}
