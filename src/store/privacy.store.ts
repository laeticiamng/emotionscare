import { create } from 'zustand';
import { persist } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';

export type PrivacyKey = 'cam' | 'mic' | 'hr' | 'gps' | 'social' | 'nft';
export type PrivacyPrefs = Record<PrivacyKey, boolean>;
export type OrgLocks = Partial<Record<PrivacyKey, boolean>>;

interface PrivacyState {
  prefs: PrivacyPrefs;
  lockedByOrg: OrgLocks;
  loading: boolean;
  error: string | null;
  
  // Actions
  setPrefs: (prefs: PrivacyPrefs) => void;
  setLockedByOrg: (locks: OrgLocks) => void;
  setPref: (key: PrivacyKey, value: boolean) => Promise<boolean>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refresh: () => Promise<void>;
}

const initialPrefs: PrivacyPrefs = {
  cam: false,
  mic: false,
  hr: false,
  gps: false,
  social: false,
  nft: false,
};

const usePrivacyStoreBase = create<PrivacyState>()(
  persist(
    (set, get) => ({
      prefs: initialPrefs,
      lockedByOrg: {},
      loading: false,
      error: null,
      
      setPrefs: (prefs) => set({ prefs }),
      setLockedByOrg: (lockedByOrg) => set({ lockedByOrg }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      setPref: async (key, value) => {
        const state = get();
        
        // Check if locked by org
        if (state.lockedByOrg[key]) {
          set({ error: `${key} est géré par votre organisation` });
          return false;
        }

        // Optimistic update
        const oldPrefs = state.prefs;
        set({ 
          prefs: { ...state.prefs, [key]: value },
          error: null,
          loading: true 
        });

        try {
          const response = await fetch('/api/me/privacy_prefs', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ [key]: value }),
          });

          if (!response.ok) {
            throw new Error('Failed to update privacy preference');
          }

          const updatedPrefs = await response.json();
          set({ 
            prefs: updatedPrefs,
            loading: false 
          });

          // Broadcast change to other components
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('privacyPrefChanged', {
              detail: { key, value, allPrefs: updatedPrefs }
            }));
          }

          // Analytics
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'privacy_toggle', {
              custom_key: key,
              custom_value: value
            });
          }

          return true;
        } catch (error) {
          // Rollback on error
          set({ 
            prefs: oldPrefs, 
            loading: false,
            error: error instanceof Error ? error.message : 'Erreur de mise à jour'
          });
          return false;
        }
      },

      refresh: async () => {
        set({ loading: true, error: null });
        
        try {
          const response = await fetch('/api/me/privacy_prefs');
          if (!response.ok) {
            throw new Error('Failed to fetch privacy preferences');
          }
          
          const data = await response.json();
          set({ 
            prefs: data,
            lockedByOrg: data.lockedByOrg || {},
            loading: false 
          });
        } catch (error) {
          set({ 
            loading: false,
            error: error instanceof Error ? error.message : 'Erreur de chargement'
          });
        }
      },
    }),
    {
      name: 'privacy-store',
      partialize: (state) => ({
        prefs: state.prefs,
      }),
    }
  )
);

export const usePrivacyStore = createSelectors(usePrivacyStoreBase);
