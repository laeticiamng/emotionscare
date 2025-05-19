
import React from 'react';
import { MusicProvider as OriginalMusicProvider } from '@/contexts/MusicContext';
import { MusicContextType } from '@/types/music';

interface MusicProviderProps {
  children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  return <OriginalMusicProvider>{children}</OriginalMusicProvider>;
};

// Add useMusic custom hook to export from the module
export { useMusic } from '@/contexts/MusicContext';

export default MusicProvider;
