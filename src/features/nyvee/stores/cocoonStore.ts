// @ts-nocheck
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CocoonState {
  unlockedCocoons: string[];
  unlockCocoon: (cocoonId: string) => void;
  hasUnlocked: (cocoonId: string) => boolean;
  reset: () => void;
}

export const useCocoonStore = create<CocoonState>()(
  persist(
    (set, get) => ({
      unlockedCocoons: ['crystal'], // Premier cocon débloqué par défaut

      unlockCocoon: (cocoonId: string) => {
        const { unlockedCocoons } = get();
        if (!unlockedCocoons.includes(cocoonId)) {
          set({ unlockedCocoons: [...unlockedCocoons, cocoonId] });
          
          // Analytics
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'cocoon_unlocked', {
              cocoon_id: cocoonId,
              total_unlocked: unlockedCocoons.length + 1,
            });
          }
        }
      },

      hasUnlocked: (cocoonId: string) => {
        return get().unlockedCocoons.includes(cocoonId);
      },

      reset: () => set({ unlockedCocoons: ['crystal'] }),
    }),
    {
      name: 'nyvee-cocoons',
    }
  )
);
