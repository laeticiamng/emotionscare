// @ts-nocheck
import { create } from 'zustand';
import { persist } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';

export type Scope = 'friends' | 'org' | 'global';
export type Period = '7d' | '30d';

export interface LeaderboardEntry {
  rank: number;
  display_name: string;
  avatar_url?: string;
  tier_label?: string;
  badges?: string[];
  me?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  locked: boolean;
  icon_url: string;
  hint?: string;
}

export interface MyGamification {
  rank_label: string;
  tier: number;
  next_goal_hint?: string;
  featured_badge?: Badge;
}

interface GamificationState {
  // Current selections
  scope: Scope;
  period: Period;
  
  // Data
  myRank: MyGamification | null;
  entries: LeaderboardEntry[];
  badges: {
    unlocked: Badge[];
    locked: Badge[];
  } | null;
  
  // UI state
  loading: boolean;
  error: string | null;
  nextCursor: string | null;
  
  // Actions
  setScope: (scope: Scope) => void;
  setPeriod: (period: Period) => void;
  setMyRank: (data: MyGamification) => void;
  setEntries: (entries: LeaderboardEntry[]) => void;
  appendEntries: (entries: LeaderboardEntry[]) => void;
  setBadges: (badges: { unlocked: Badge[]; locked: Badge[] }) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setNextCursor: (cursor: string | null) => void;
  reset: () => void;
}

const initialState = {
  scope: 'friends' as Scope,
  period: '7d' as Period,
  myRank: null,
  entries: [],
  badges: null,
  loading: false,
  error: null,
  nextCursor: null,
};

const useGamificationStoreBase = create<GamificationState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setScope: (scope) => {
        set({ scope, entries: [], nextCursor: null });
      },
      
      setPeriod: (period) => {
        set({ period, entries: [], nextCursor: null });
      },
      
      setMyRank: (myRank) => set({ myRank }),
      
      setEntries: (entries) => set({ entries }),
      
      appendEntries: (newEntries) => {
        const { entries } = get();
        const uniqueEntries = [...entries];
        
        newEntries.forEach(newEntry => {
          const existingIndex = uniqueEntries.findIndex(e => e.rank === newEntry.rank);
          if (existingIndex >= 0) {
            uniqueEntries[existingIndex] = newEntry;
          } else {
            uniqueEntries.push(newEntry);
          }
        });
        
        // Sort by rank
        uniqueEntries.sort((a, b) => a.rank - b.rank);
        set({ entries: uniqueEntries });
      },
      
      setBadges: (badges) => set({ badges }),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),
      
      setNextCursor: (nextCursor) => set({ nextCursor }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'gamification-store',
      partialize: (state) => ({
        scope: state.scope,
        period: state.period,
      }),
    }
  )
);

export const useGamificationStore = createSelectors(useGamificationStoreBase);
