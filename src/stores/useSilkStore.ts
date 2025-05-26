import { create } from 'zustand';

export interface Wall {
  id: string;
  mp4Url: string;
  thumbnailUrl: string;
  deleted_at?: string | null;
}

export interface SilkState {
  walls: Wall[];
  fetch: () => Promise<void>;
  apply: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useSilkStore = create<SilkState>()((set) => ({
  walls: [],
  fetch: async () => {
    const res = await fetch('/user/wallpapers');
    if (res.ok) {
      const data = await res.json();
      set({ walls: data });
    }
  },
  apply: async (id: string) => {
    await fetch(`/user/wallpapers/${id}/apply`, { method: 'POST' });
  },
  remove: async (id: string) => {
    await fetch(`/user/wallpapers/${id}`, { method: 'DELETE' });
    set((state) => ({ walls: state.walls.filter((w) => w.id !== id) }));
  },
}));
