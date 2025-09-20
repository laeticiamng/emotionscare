
import React from 'react';
import { create } from 'zustand';

import { persist } from '@/store/utils/createImmutableStore';
import { createSelectors } from '@/store/utils/createSelectors';
import { mapMoodToVibe, type MoodVibe } from '@/utils/moodVibes';

interface MoodState {
  valence: number; // -100 à +100 (négatif à positif)
  arousal: number; // 0 à 100 (calme à excité)
  timestamp: string;
  vibe: MoodVibe;
  isLoading: boolean;
  error: string | null;
}

interface MoodStore extends MoodState {
  updateMood: (valence: number, arousal: number) => void;
  fetchCurrentMood: () => Promise<void>;
  resetMood: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const moodStoreBase = create<MoodStore>()(
  persist(
    (set, get) => ({
      valence: 0,
      arousal: 50,
      timestamp: new Date().toISOString(),
      isLoading: false,
      vibe: 'calm',
      error: null,

      updateMood: (valence: number, arousal: number) => {
        const clampedValence = Math.max(-100, Math.min(100, valence));
        const clampedArousal = Math.max(0, Math.min(100, arousal));
        const vibe = mapMoodToVibe(clampedValence, clampedArousal);
        const timestamp = new Date().toISOString();
        set({
          valence: clampedValence,
          arousal: clampedArousal,
          vibe,
          timestamp,
          error: null,
        });

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('mood.updated', {
            detail: { valence: clampedValence, arousal: clampedArousal, vibe, timestamp },
          }));
        }
      },

      fetchCurrentMood: async () => {
        set({ isLoading: true, error: null });

        try {
          await new Promise(resolve => setTimeout(resolve, 500));

          const mockValence = Math.floor(Math.random() * 201) - 100;
          const mockArousal = Math.floor(Math.random() * 101);
          const mockTimestamp = new Date().toISOString();
          const mockMood = {
            valence: mockValence,
            arousal: mockArousal,
            timestamp: mockTimestamp,
            vibe: mapMoodToVibe(mockValence, mockArousal),
          };

          set({
            ...mockMood,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue',
          });
        }
      },

      resetMood: () => {
        set({
          valence: 0,
          arousal: 50,
          vibe: 'calm',
          timestamp: new Date().toISOString(),
          error: null,
        });
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'emotions-care-mood',
      version: 1,
    }
  )
);

export const useMoodStore = createSelectors(moodStoreBase);

export const useMood = () => {
  const store = useMoodStore();

  React.useEffect(() => {
    const lastUpdate = new Date(store.timestamp);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);

    if (diffMinutes > 30) {
      store.fetchCurrentMood();
    }
  }, []);

  React.useEffect(() => {
    const handleMoodUpdate = (event: CustomEvent) => {
      const { valence, arousal, timestamp, vibe } = event.detail as {
        valence: number;
        arousal: number;
        timestamp?: string;
        vibe?: MoodVibe;
      };

      const nextVibe = vibe ?? mapMoodToVibe(valence, arousal);
      useMoodStore.setState({
        valence,
        arousal,
        timestamp: timestamp ?? new Date().toISOString(),
        vibe: nextVibe,
      });
    };

    window.addEventListener('mood.updated', handleMoodUpdate as EventListener);

    return () => {
      window.removeEventListener('mood.updated', handleMoodUpdate as EventListener);
    };
  }, []);

  return store;
};

export const getMoodColor = (valence: number, arousal: number): string => {
  if (valence > 50 && arousal > 70) return '#10b981';
  if (valence > 50 && arousal < 30) return '#3b82f6';
  if (valence < -50 && arousal > 70) return '#ef4444';
  if (valence < -50 && arousal < 30) return '#6b7280';
  return '#8b5cf6';
};

export const getMoodEmoji = (valence: number, arousal: number): string => {
  if (valence > 50 && arousal > 70) return '🎉';
  if (valence > 50 && arousal < 30) return '😌';
  if (valence < -50 && arousal > 70) return '😤';
  if (valence < -50 && arousal < 30) return '😔';
  return '😐';
};

export const getMoodDescription = (valence: number, arousal: number): string => {
  if (valence > 50 && arousal > 70) return 'Énergique et joyeux';
  if (valence > 50 && arousal < 30) return 'Calme et serein';
  if (valence < -50 && arousal > 70) return 'Stressé et agité';
  if (valence < -50 && arousal < 30) return 'Fatigué et morose';
  return 'Humeur neutre';
};
