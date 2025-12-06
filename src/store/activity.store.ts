// @ts-nocheck
import { create } from 'zustand';
import { persist } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';

type ModuleId =
  | 'boss_grit'|'mood_mixer'|'ambition_arcade'|'bounce_back'|'story_synth'
  | 'flash_glow'|'face_ar'|'bubble_beat'|'screen_silk'|'vr_galaxy'
  | 'instant_glow'|'weekly_bars'|'heatmap_rh'|'journal'|'music_therapy'
  | 'scan'|'gamification'|'vr_breath'|'breathwork';

export type ActivityItem = {
  id: string;
  date: string;              // ISO
  module: ModuleId;
  title: string;             // ex. "VR Respiration"
  label?: string;            // ex. "Séance paisible"
  tags?: string[];           // ex. ["respiration","cohérence"]
  actions?: { resume_deeplink?: string; replay_deeplink?: string };
};

export type ActivityFilters = {
  period: '7d' | '30d' | '90d' | 'custom';
  from?: string;
  to?: string;
  modules: ModuleId[];
  search: string;
};

type ActivityState = {
  filters: ActivityFilters;
  items: ActivityItem[];
  nextCursor?: string;
  loading: boolean;
  lastExport?: {
    jobId: string;
    timestamp: number;
    status: 'processing' | 'ready' | 'error';
  };
  
  setFilters: (filters: Partial<ActivityFilters>) => void;
  setItems: (items: ActivityItem[], cursor?: string) => void;
  appendItems: (items: ActivityItem[], cursor?: string) => void;
  setLoading: (loading: boolean) => void;
  setLastExport: (exportData: ActivityState['lastExport']) => void;
  reset: () => void;
};

const initialFilters: ActivityFilters = {
  period: '30d',
  modules: [],
  search: ''
};

const useActivityStoreBase = create<ActivityState>()(
  persist(
    (set) => ({
      filters: initialFilters,
      items: [],
      loading: false,
      
      setFilters: (newFilters) => 
        set((state) => ({ 
          filters: { ...state.filters, ...newFilters },
          items: [], // Reset items when filters change
          nextCursor: undefined
        })),
      
      setItems: (items, cursor) => 
        set({ items, nextCursor: cursor }),
      
      appendItems: (newItems, cursor) =>
        set((state) => ({
          items: [...state.items, ...newItems],
          nextCursor: cursor
        })),
      
      setLoading: (loading) => set({ loading }),
      
      setLastExport: (lastExport) => set({ lastExport }),
      
      reset: () => set({
        filters: initialFilters,
        items: [],
        nextCursor: undefined,
        loading: false,
        lastExport: undefined
      })
    }),
    {
      name: 'activity-store',
      partialize: (state) => ({
        lastExport: state.lastExport
      })
    }
  )
);

export const useActivityStore = createSelectors(useActivityStoreBase);
