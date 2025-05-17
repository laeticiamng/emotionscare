
export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverUrl?: string;
  audioUrl?: string;
  album?: string;
  genre?: string;
  emotion?: string;
  description?: string;
  coverImage?: string;
  cover?: string;
}

export interface AudioPlaylist {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  coverUrl?: string;
  tracks: AudioTrack[];
  emotion?: string;
  mood?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface AudioContextType {
  tracks: AudioTrack[];
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  prevTrack: () => void;
  nextTrack: () => void;
}
