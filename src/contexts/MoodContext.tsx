import React, { createContext, useContext, ReactNode } from 'react';
import { useMoodStore } from '@/hooks/useMood';
import type { MoodPalette } from '@/utils/moodSignals';
import type { MoodVibe } from '@/utils/moodVibes';

interface MoodContextType {
  currentMood: {
    valence: number;
    arousal: number;
    timestamp: string;
    vibe: MoodVibe;
    isLoading: boolean;
    error: string | null;
    summary: string;
    microGesture: string;
    palette: MoodPalette;
  };
  updateMood: (valence: number, arousal: number) => void;
  fetchCurrentMood: () => Promise<void>;
  resetMood: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

interface MoodProviderProps {
  children: ReactNode;
}

export const MoodProvider: React.FC<MoodProviderProps> = ({ children }) => {
  const moodStore = useMoodStore();
  
  const contextValue: MoodContextType = {
    currentMood: {
      valence: moodStore.valence,
      arousal: moodStore.arousal,
      timestamp: moodStore.timestamp,
      vibe: moodStore.vibe,
      isLoading: moodStore.isLoading,
      error: moodStore.error,
      summary: moodStore.summary,
      microGesture: moodStore.microGesture,
      palette: moodStore.palette,
    },
    updateMood: moodStore.updateMood,
    fetchCurrentMood: moodStore.fetchCurrentMood,
    resetMood: moodStore.resetMood,
    setLoading: moodStore.setLoading,
    setError: moodStore.setError,
  };

  return (
    <MoodContext.Provider value={contextValue}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = (): MoodContextType => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};

export default MoodProvider;