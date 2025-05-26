
import React, { createContext, useContext, ReactNode } from 'react';

// Ensure React is available
if (!React) {
  console.error('[MusicContext] React not available at import time');
}

interface MusicContextType {
  // Add your music context properties here
  isPlaying: boolean;
  currentTrack: string | null;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  if (!React || !React.useContext) {
    console.error('[useMusic] React hooks not available');
    return {
      isPlaying: false,
      currentTrack: null,
    };
  }

  const context = React.useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  if (!React) {
    console.error('[MusicProvider] React not available');
    return <>{children}</>;
  }

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
