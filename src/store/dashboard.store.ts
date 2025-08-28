import { create } from 'zustand';

type ModuleId = string;

export type ContinueItem = { 
  title: string; 
  subtitle?: string; 
  deeplink: string; 
  module: ModuleId; 
};

export type Nudge = { 
  text: string; 
  deeplink: string; 
  emoji?: string; 
};

export type WeeklyData = {
  today?: {
    label: string;
    color: 'low' | 'medium' | 'high';
    emoji: string;
  };
  days?: Array<{
    date: string;
    value: 'low' | 'medium' | 'high';
    label: string;
  }>;
};

type DashboardState = {
  weekly: WeeklyData | null;
  continueItem: ContinueItem | null;
  nudge: Nudge | null;
  loading: {
    weekly: boolean;
    continue: boolean;
    nudge: boolean;
  };
  
  setWeekly: (data: WeeklyData) => void;
  setContinueItem: (item: ContinueItem | null) => void;
  setNudge: (nudge: Nudge | null) => void;
  setLoading: (key: keyof DashboardState['loading'], loading: boolean) => void;
  reset: () => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  weekly: null,
  continueItem: null,
  nudge: null,
  loading: {
    weekly: false,
    continue: false,
    nudge: false
  },
  
  setWeekly: (weekly) => set({ weekly }),
  setContinueItem: (continueItem) => set({ continueItem }),
  setNudge: (nudge) => set({ nudge }),
  
  setLoading: (key, loading) =>
    set((state) => ({
      loading: { ...state.loading, [key]: loading }
    })),
  
  reset: () => set({
    weekly: null,
    continueItem: null,
    nudge: null,
    loading: { weekly: false, continue: false, nudge: false }
  })
}));