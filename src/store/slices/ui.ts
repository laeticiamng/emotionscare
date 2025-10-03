import type { StateCreator } from 'zustand';
import type { AppState } from '../appStore';

export type Theme = 'light' | 'dark' | 'system';
export type ModuleKey = 'music' | 'emotion' | 'journal' | 'coach';

export interface UIState {
  theme: Theme;
  sidebarCollapsed: boolean;
  activeModule: ModuleKey | null;
}

export interface UIActions {
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setActiveModule: (module: ModuleKey | null) => void;
}

export type UISlice = UIState & UIActions;

export const createUIInitialState = (): UIState => ({
  theme: 'system',
  sidebarCollapsed: false,
  activeModule: null,
});

export const createUISlice: StateCreator<AppState, [], [], UISlice> = (set, get) => ({
  ...createUIInitialState(),
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
  setActiveModule: (module) => set({ activeModule: module }),
});
