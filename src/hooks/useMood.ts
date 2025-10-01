// @ts-nocheck

import React from 'react';
import { create } from 'zustand';

import { persist } from '@/store/utils/createImmutableStore';
import { createSelectors } from '@/store/utils/createSelectors';
import { type MoodVibe } from '@/utils/moodVibes';
import { buildMoodSignals, type MoodEventDetail, type MoodPalette } from '@/utils/moodSignals';

interface MoodState {
  valence: number; // -100 à +100 (négatif à positif)
  arousal: number; // 0 à 100 (calme à excité)
  timestamp: string;
  vibe: MoodVibe;
  isLoading: boolean;
  error: string | null;
  summary: string;
  microGesture: string;
  palette: MoodPalette;
}

interface MoodStore extends MoodState {
  updateMood: (valence: number, arousal: number) => void;
  fetchCurrentMood: () => Promise<void>;
  resetMood: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const baselineSignals = buildMoodSignals(0, 50);

const moodStoreBase = create<MoodStore>()(
  persist(
    (set) => ({
      valence: 0,
      arousal: 50,
      timestamp: new Date().toISOString(),
      isLoading: false,
      vibe: baselineSignals.vibe,
      error: null,
      summary: baselineSignals.summary,
      microGesture: baselineSignals.microGesture,
      palette: { ...baselineSignals.palette },

      updateMood: (valence: number, arousal: number) => {
        const clampedValence = Math.max(-100, Math.min(100, valence));
        const clampedArousal = Math.max(0, Math.min(100, arousal));
        const signals = buildMoodSignals(clampedValence, clampedArousal);
        const timestamp = new Date().toISOString();
        set({
          valence: clampedValence,
          arousal: clampedArousal,
          vibe: signals.vibe,
          timestamp,
          summary: signals.summary,
          microGesture: signals.microGesture,
          palette: signals.palette,
          error: null,
        });

        if (typeof window !== 'undefined') {
          const detail: MoodEventDetail = {
            valence: clampedValence,
            arousal: clampedArousal,
            timestamp,
            summary: signals.summary,
            microGesture: signals.microGesture,
            palette: signals.palette,
            vibe: signals.vibe,
          };
          window.dispatchEvent(new CustomEvent('mood.updated', { detail }));
        }
      },

      fetchCurrentMood: async () => {
        set({ isLoading: true, error: null });

        try {
          await new Promise(resolve => setTimeout(resolve, 500));

          const mockValence = Math.floor(Math.random() * 201) - 100;
          const mockArousal = Math.floor(Math.random() * 101);
          const mockTimestamp = new Date().toISOString();
          const signals = buildMoodSignals(mockValence, mockArousal);
          const mockMood = {
            valence: mockValence,
            arousal: mockArousal,
            timestamp: mockTimestamp,
            vibe: signals.vibe,
            summary: signals.summary,
            microGesture: signals.microGesture,
            palette: signals.palette,
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
        const baseline = buildMoodSignals(0, 50);
        set({
          valence: 0,
          arousal: 50,
          vibe: baseline.vibe,
          timestamp: new Date().toISOString(),
          error: null,
          summary: baseline.summary,
          microGesture: baseline.microGesture,
          palette: baseline.palette,
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
      const detail = event.detail as Partial<MoodEventDetail> | undefined;
      if (!detail) {
        return;
      }

      const currentState = useMoodStore.getState();

      const parsedValence = Number(detail.valence);
      const parsedArousal = Number(detail.arousal);

      const valence = Number.isFinite(parsedValence)
        ? Math.max(-100, Math.min(100, parsedValence))
        : currentState.valence;
      const arousal = Number.isFinite(parsedArousal)
        ? Math.max(0, Math.min(100, parsedArousal))
        : currentState.arousal;

      const computed = buildMoodSignals(valence, arousal);

      useMoodStore.setState({
        valence,
        arousal,
        timestamp: detail.timestamp ?? new Date().toISOString(),
        vibe: detail.vibe ?? computed.vibe,
        summary: detail.summary ?? computed.summary,
        microGesture: detail.microGesture ?? computed.microGesture,
        palette: detail.palette ?? computed.palette,
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
