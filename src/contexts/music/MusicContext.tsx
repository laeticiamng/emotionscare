
import { createContext, useContext } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';

// Create a default context value
const defaultContextValue: MusicContextType = {
  currentTrack: null,
  playlist: null,
  isPlaying: false,
  volume: 1,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  currentEmotion: null,
  playTrack: () => {},
  pauseTrack: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  toggleMute: () => {},
  loadPlaylistForEmotion: async () => null,
};

// Create the context
const MusicContext = createContext<MusicContextType>(defaultContextValue);

// Create a hook for using the context
export const useMusic = () => {
  const context = useContext(MusicContext);
  
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  
  return context;
};

export default MusicContext;
