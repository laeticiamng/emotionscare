// @ts-nocheck
/**
 * MusicContext - Compatibility Layer
 *
 * This context wraps the Zustand music store to maintain backward compatibility
 * with components that expect a React Context API.
 *
 * For new code, prefer using:
 * - useMusicStore from '@/store/music.store' for direct state access
 * - useMusicCompat from '@/hooks/useMusicCompat' for full API
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useMusicCompat } from '@/hooks/useMusicCompat';

// ============================================================================
// TYPES
// ============================================================================

type MusicContextValue = ReturnType<typeof useMusicCompat>;

// ============================================================================
// CONTEXT
// ============================================================================

export const MusicContext = createContext<MusicContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

interface MusicProviderProps {
  children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const musicValue = useMusicCompat();

  const value = useMemo(() => musicValue, [musicValue]);

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

export const useMusic = (): MusicContextValue => {
  const context = useContext(MusicContext);

  // If not in provider, return useMusicCompat directly
  // This allows components to work both inside and outside the provider
  if (!context) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMusicCompat();
  }

  return context;
};

export default MusicContext;
