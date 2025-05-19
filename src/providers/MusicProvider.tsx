
import React from 'react';
import { MusicProvider as OriginalMusicProvider } from '@/contexts/MusicContext';

interface MusicProviderProps {
  children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  return <OriginalMusicProvider>{children}</OriginalMusicProvider>;
};

// Re-export the useMusic hook from the contexts
export { useMusic } from '@/hooks/useMusic';

export default MusicProvider;
