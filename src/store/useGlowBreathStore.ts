// @ts-nocheck

import { create } from 'zustand';
import { GlowWeek, GlowBreathState } from '@/types/glow';

const CACHE_DURATION = 600_000; // 10 minutes

// Mock function for API call - replace with actual API integration
const fetchWithAuth = async (url: string) => {
  // Mock data for development
  return {
    json: async () => [
      {
        week_start: "2025-06-02",
        glowScore: 22,
        coherence: 68,
        moveMinutes: 42,
        calmIndex: 5.3,
        mindfulScore: 2.1,
        moodScore: 0.6
      },
      {
        week_start: "2025-05-26",
        glowScore: 16,
        coherence: 61,
        moveMinutes: 38,
        calmIndex: 4.8,
        mindfulScore: 1.9,
        moodScore: 0.4
      },
      {
        week_start: "2025-05-19",
        glowScore: 28,
        coherence: 72,
        moveMinutes: 45,
        calmIndex: 6.1,
        mindfulScore: 2.3,
        moodScore: 0.8
      }
    ]
  };
};

export const useGlowBreathStore = create<GlowBreathState>((set, get) => ({
  weeks: [],
  loading: false,
  error: undefined,
  lastFetch: undefined,

  fetchWeeks: async () => {
    const state = get();
    
    // Check cache
    if (state.lastFetch && Date.now() - state.lastFetch < CACHE_DURATION) {
      return;
    }

    set({ loading: true, error: undefined });
    
    try {
      const response = await fetchWithAuth('/api/me/breath/weekly');
      const data = await response.json();
      
      set({ 
        weeks: data,
        loading: false,
        lastFetch: Date.now()
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur de chargement',
        loading: false
      });
    }
  }
}));
