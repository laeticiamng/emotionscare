
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  cover?: string;
  coverImage?: string;
  genre?: string;
  mood?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: MusicTrack[];
  cover?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MusicPlayerState {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  shuffle?: boolean;
  repeat?: 'none' | 'one' | 'all';
}
