// @ts-nocheck
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setImplicitOn } from '@/lib/implicitAssess';

interface ImplicitAssessState {
  enabled: boolean;
  toggle: () => void;
  setEnabled: (enabled: boolean) => void;
}

export const useImplicitAssessStore = create<ImplicitAssessState>()(
  persist(
    (set) => ({
      enabled: false,
      toggle: () =>
        set((state) => {
          const newEnabled = !state.enabled;
          setImplicitOn(newEnabled);
          return { enabled: newEnabled };
        }),
      setEnabled: (enabled) => {
        setImplicitOn(enabled);
        set({ enabled });
      },
    }),
    {
      name: 'emotionscare.implicit-assess',
      onRehydrateStorage: () => (state) => {
        if (state) {
          setImplicitOn(state.enabled);
        }
      },
    }
  )
);
