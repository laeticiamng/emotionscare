// @ts-nocheck
/**
 * MusicContext - Compatibility Layer for Context-based API
 *
 * This file provides backward compatibility for components using the Context-based
 * music API. Under the hood, it uses the Zustand store via useMusicCompat hook.
 */

import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useMusicCompat } from '@/hooks/useMusicCompat';

// ============================================================================
// TYPES
// ============================================================================

export type MusicContextType = ReturnType<typeof useMusicCompat>;

// ============================================================================
// CONTEXT
// ============================================================================

export const MusicContext = createContext<MusicContextType | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const music = useMusicCompat();

  // Memoize to prevent unnecessary re-renders
  const value = useMemo(() => music, [
    music.state.currentTrack,
    music.state.isPlaying,
    music.state.isPaused,
    music.state.volume,
    music.state.progress,
    music.state.playlist,
    music.state.isGenerating,
    music.state.therapeuticMode,
  ]);

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);

  if (!context) {
    // If used outside provider, return the hook directly (fallback)
    // This allows usage without wrapping in MusicProvider
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMusicCompat();
  }

  return context;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default MusicContext;
