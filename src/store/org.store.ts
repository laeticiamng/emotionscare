import { create } from 'zustand';

export type GroupBy = 'team' | 'tribe' | 'site';
export type RenderMode = 'svg' | 'canvas';

interface OrgStore {
  filters: {
    range: '7d' | '14d' | '30d';
    groupBy: GroupBy;
    site?: string;
    bu?: string;
    minN: number;
  };
  selectedCell?: {
    teamId: string;
    date: string;
  };
  renderMode: RenderMode;
  setFilters: (filters: Partial<OrgStore['filters']>) => void;
  setSelectedCell: (cell: OrgStore['selectedCell']) => void;
  setRenderMode: (mode: RenderMode) => void;
}

export const useOrgStore = create<OrgStore>((set) => ({
  filters: {
    range: '7d',
    groupBy: 'team',
    minN: 5,
  },
  renderMode: 'svg',
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  setSelectedCell: (cell) => set({ selectedCell: cell }),
  setRenderMode: (mode) => set({ renderMode: mode }),
}));