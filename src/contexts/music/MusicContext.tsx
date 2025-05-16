
import React, { createContext, useContext } from 'react';
import { MusicContextType } from '@/types/music';

// Create the context with empty default values
export const MusicContext = createContext<MusicContextType>({} as MusicContextType);

// Create the hook for using the music context
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
