// @ts-nocheck
import { create } from 'zustand';

interface Modal {
  id: string;
  component?: string;
  props?: Record<string, unknown>;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  overlay?: boolean;
}

interface ModalStore {
  modals: Modal[];
  open: (modal: Omit<Modal, 'id'> & { id?: string }) => string;
  close: (id: string) => void;
  closeAll: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modals: [],
  open: (modal) => {
    const id = modal.id || `modal-${Date.now()}`;
    set((state) => ({ modals: [...state.modals, { ...modal, id }] }));
    return id;
  },
  close: (id) => set((state) => ({ modals: state.modals.filter((m) => m.id !== id) })),
  closeAll: () => set({ modals: [] }),
}));
