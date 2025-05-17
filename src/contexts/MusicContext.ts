
import { createContext, useContext } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types/music';

export interface MusicContextType {
  isInitialized: boolean;
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  playlist: MusicPlaylist | null;
  togglePlay: () => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  loadPlaylistForEmotion: (emotion: string) => void;
  initializeMusicSystem?: () => void;
}

export const MusicContext = createContext<MusicContextType | null>(null);

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  
  return context;
};

export default MusicContext;
