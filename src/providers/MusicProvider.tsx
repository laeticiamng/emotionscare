
import React from 'react';
import { MusicProvider as OriginalMusicProvider, useMusic as OriginalUseMusic } from '@/contexts/MusicContext';

interface MusicProviderProps {
  children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  return <OriginalMusicProvider>{children}</OriginalMusicProvider>;
};

// Re-export the useMusic hook from the main context
export const useMusic = OriginalUseMusic;

export default MusicProvider;
