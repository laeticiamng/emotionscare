
import { ReactNode } from 'react';

export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  albumId?: string;
  albumName?: string;
  duration?: number;
  coverUrl?: string;
  cover?: string;
  coverImage?: string;
  audioUrl: string;
  url?: string; // Ajout pour compatibilité
  track_url?: string; // Ajout pour compatibilité
  emotion?: string;
  tags?: string[];
  createdAt?: Date | string;
  plays?: number;
  isLiked?: boolean;
}

export interface MusicAlbum {
  id: string;
  title: string;
  artist?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  releaseDate?: Date | string;
  description?: string;
  tags?: string[];
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string; // Ajout pour compatibilité
  description?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  userId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  isPublic?: boolean;
  plays?: number;
  tags?: string[];
}

export interface PlaylistCreationOptions {
  name: string;
  description?: string;
  coverUrl?: string;
  tracks?: MusicTrack[];
  isPublic?: boolean;
  tags?: string[];
}

export interface MusicPlayerState {
  currentTrack: MusicTrack | null;
  queue: MusicTrack[];
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  repeatMode: 'off' | 'one' | 'all';
  shuffleMode: boolean;
  autoplay: boolean;
}

export interface MusicPlayerContext {
  state: MusicPlayerState;
  play: (track?: MusicTrack) => void;
  pause: () => void;
  togglePlayPause: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (tracks: MusicTrack | MusicTrack[]) => void;
  clearQueue: () => void;
  setTrack: (track: MusicTrack) => void;
  playPlaylist: (playlist: MusicPlaylist, startIndex?: number) => void;
  isTrackPlaying: (trackId: string) => boolean;
}

export interface MusicLibraryProps {
  tracks?: MusicTrack[];
  playlists?: MusicPlaylist[];
  onTrackSelect?: (track: MusicTrack) => void;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
  currentTrack?: MusicTrack | null;
}

export interface PlayerControlProps {
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  isPlaying?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek?: (time: number) => void;
  formatTime?: (time: number) => string;
  className?: string;
  showTimestamps?: boolean;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange?: (volume: number) => void;
  onChange?: (volume: number) => void;
  isMuted?: boolean;
  muted?: boolean;
  onMuteToggle?: () => void;
  className?: string;
  showLabel?: boolean;
}

export interface TrackListProps {
  tracks: MusicTrack[];
  onSelect?: (track: MusicTrack) => void;
  currentTrackId?: string;
  showArtist?: boolean;
  showDuration?: boolean;
  showCover?: boolean;
  isCompact?: boolean;
  className?: string;
}

export interface MusicPlayerProps {
  track?: MusicTrack | null;
  autoPlay?: boolean;
  showControls?: boolean;
  showProgress?: boolean;
  showVolume?: boolean;
  showTrackInfo?: boolean;
  onTrackEnd?: () => void;
  onTimeUpdate?: (time: number) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'expanded';
}

export interface MusicSearchProps {
  onSearch?: (term: string) => void;
  className?: string;
  placeholder?: string;
}

export interface MusicFilterProps {
  tags?: string[];
  emotions?: string[];
  onFilter?: (filters: { tags: string[]; emotions: string[] }) => void;
  className?: string;
}

export interface EmotionMusicRecommendationProps {
  emotion?: string;
  onTrackSelect?: (track: MusicTrack) => void;
  limit?: number;
  className?: string;
}

export interface EmotionSelectorProps {
  onSelect?: (emotion: string) => void;
  selectedEmotion?: string;
  className?: string;
}

export interface MusicVisualizerProps {
  isPlaying?: boolean;
  audio?: HTMLAudioElement;
  className?: string;
  variant?: 'bars' | 'circles' | 'wave';
  color?: string;
}

export interface RecentTracksProps {
  tracks?: MusicTrack[];
  onTrackSelect?: (track: MusicTrack) => void;
  limit?: number;
  className?: string;
}

export interface MusicDrawerContentProps {
  onClose?: () => void;
}

export interface MusicDrawerProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  children?: ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack | null;
}

export interface MusicControlsProps {
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  volume?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onVolumeChange?: (volume: number) => void;
  track?: MusicTrack | null;
  className?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  history?: string[];
  preferences?: string[];
}

export interface MusicContextType {
  tracks: MusicTrack[];
  playlists: MusicPlaylist[];
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  setTrack: (track: MusicTrack) => void;
  setPlaylists: (playlists: MusicPlaylist[]) => void;
  setTracks: (tracks: MusicTrack[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  playPlaylist: (playlist: MusicPlaylist, index?: number) => void;
  addToPlaylist: (trackId: string, playlistId: string) => Promise<void>;
  createPlaylist: (name: string, tracks?: string[]) => Promise<void>;
  likeTrack: (trackId: string) => Promise<void>;
  unlikeTrack: (trackId: string) => Promise<void>;
}
