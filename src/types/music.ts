
import React from 'react';
import { Track } from '../services/music/types';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl?: string;
  coverUrl?: string;
  cover?: string;
  cover_url?: string;
  audio_url?: string;
  url?: string;
  emotion?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  emotion?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  cover_url?: string;
  title?: string;
  category?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  play: (track?: MusicTrack) => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  seekTo: (position: number) => void;
  setPlaylist: (playlist: MusicPlaylist) => void;
}

export interface MusicDrawerProps {
  isOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  tempo?: 'slow' | 'medium' | 'fast';
  instrumental?: boolean;
}
