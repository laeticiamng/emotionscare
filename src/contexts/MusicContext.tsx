
import React, { createContext, useContext, ReactNode } from 'react';

interface MusicContextType {
  // Add your music context properties here
  isPlaying: boolean;
  currentTrack: string | null;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const value = {
    isPlaying: false,
    currentTrack: null,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};
