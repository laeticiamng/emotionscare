
export type MusicTrack = {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url?: string;
  audioUrl?: string;
  coverUrl?: string;
  emotionalTone?: string;
  mood?: string;
  tags?: string[];
};

export type MusicPlaylist = {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  category?: string;
  mood?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
};

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  playlists: MusicPlaylist[];
  currentPlaylist: MusicPlaylist | null;
  togglePlay: () => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  isMuted: boolean;
  duration: number;
  currentTime: number;
  seekTo: (time: number) => void;
  queue: MusicTrack[];
  addToQueue: (track: MusicTrack) => void;
  clearQueue: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  isShuffled: boolean;
  isRepeating: boolean;
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  setEmotion: (emotion: string) => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  currentEmotion: string | null;
}

export type MusicPlayerProps = {
  track?: MusicTrack;
  autoPlay?: boolean;
  showControls?: boolean;
  showProgress?: boolean;
  onEnded?: () => void;
  className?: string;
};

export type MusicControlsProps = {
  showVolume?: boolean;
  showShuffle?: boolean;
  showRepeat?: boolean;
  size?: 'sm' | 'md' | 'lg';
  vertical?: boolean;
  className?: string;
};

export type MusicCardProps = {
  track: MusicTrack;
  onClick?: () => void;
  isPlaying?: boolean;
  isActive?: boolean;
  showPlayButton?: boolean;
  className?: string;
};

export type PlaylistCardProps = {
  playlist: MusicPlaylist;
  onClick?: () => void;
  className?: string;
};

export type MusicMoodProps = {
  mood: string;
  intensity?: number; // 0-100
  onSelect?: () => void;
  className?: string;
};
