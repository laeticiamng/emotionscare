
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  audioUrl?: string;
  url?: string;
  duration: number;
  emotion?: string;
  isPlaying?: boolean;
  mood?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  tracks: MusicTrack[];
  emotion?: string;
}

export interface MusicContextType {
  playlists: MusicPlaylist[];
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  setVolume: (value: number) => void;
  seekTo: (time: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  isOpenDrawer: boolean;
  setOpenDrawer: (open: boolean) => boolean;
  getPlaylistById: (id: string) => MusicPlaylist;
  getPlaylistByEmotion: (emotion: string) => MusicPlaylist;
  createPlaylist: (name: string, tracks: MusicTrack[]) => MusicPlaylist;
  addTrackToPlaylist: (playlistId: string, track: MusicTrack) => MusicPlaylist;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => MusicPlaylist;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

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

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export interface TrackInfoProps {
  track: MusicTrack | null;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
}
