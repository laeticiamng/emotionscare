
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover?: string;
  coverUrl?: string;
  coverImage?: string;
  duration?: number;
  audioUrl?: string;
  src?: string;
  track_url?: string;
  album?: string;
  year?: number;
  tags?: string[];
  genre?: string;
  emotion?: string;
  mood?: string | string[];
  category?: string | string[];
  intensity?: number;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  description?: string;
  cover?: string;
  coverUrl?: string;
  coverImage?: string;
  tracks: MusicTrack[];
  emotion?: string;
  mood?: string | string[];
  category?: string | string[];
  tags?: string[];
}

export interface MusicQueueItem extends MusicTrack {
  playlistId?: string;
}

export interface MusicState {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  currentPlaylist: MusicPlaylist | null;
  queue: MusicQueueItem[];
  history: MusicQueueItem[];
  repeat: 'off' | 'track' | 'playlist';
  shuffle: boolean;
  volume: number;
  muted: boolean;
}

export interface MusicContextType extends MusicState {
  play: (track: MusicTrack, playlist?: MusicPlaylist) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  setRepeat: (mode: 'off' | 'track' | 'playlist') => void;
  playPlaylist: (playlist: MusicPlaylist, startTrackId?: string) => void;
  addToQueue: (track: MusicTrack) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  seekTo: (time: number) => void;
  currentTime?: number;
  duration?: number;
}
