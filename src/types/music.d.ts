
export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  duration: number;
  currentTime: number;
  playlist: MusicPlaylist | null;
  playlists: MusicPlaylist[];
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  isOpenDrawer?: boolean;
  playTrack: (track: MusicTrack) => void;
  playPlaylist: (playlist: MusicPlaylist) => void;
  playSimilar: (mood?: string) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  recommendByEmotion: (emotion: string, intensity?: number) => MusicPlaylist;
  getRecommendedPlaylists: (limit?: number) => MusicPlaylist[];
  pauseTrack?: () => void;
  resumeTrack?: () => void;
  nextTrack?: () => void;
  previousTrack?: () => void;
  toggleMute?: () => void;
  loadPlaylistForEmotion?: (params: EmotionMusicParams) => Promise<MusicPlaylist | null>;
  setEmotion?: (emotion: string) => void;
  currentPlaylist?: MusicPlaylist | null;
  emotion?: string | null;
  currentEmotion?: string | null;
  isMuted?: boolean;
  muted?: boolean;
}
