import { create } from 'zustand';
import { persist } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

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
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            // Not logged in, just save locally
            set({ loading: false });
            return true;
          }

          // Upsert privacy preferences to Supabase
          const { error } = await supabase
            .from('user_preferences')
            .upsert({
              user_id: user.id,
              preference_key: `privacy_${key}`,
              preference_value: value,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'user_id,preference_key',
            });

          if (error) {
            throw error;
          }

          set({ loading: false });

          // Broadcast change to other components
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('privacyPrefChanged', {
              detail: { key, value, allPrefs: { ...state.prefs, [key]: value } }
            }));
          }

          // Analytics
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'privacy_toggle', {
              custom_key: key,
              custom_value: value
            });
          }

          return true;
        } catch (error) {
          logger.error('Failed to update privacy preference', error as Error, 'PRIVACY');
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
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            set({ loading: false });
            return;
          }

          // Fetch all privacy preferences
          const { data, error } = await supabase
            .from('user_preferences')
            .select('preference_key, preference_value')
            .eq('user_id', user.id)
            .like('preference_key', 'privacy_%');

          if (error) {
            throw error;
          }

          // Build prefs object from data
          const prefs = { ...initialPrefs };
          data?.forEach((row) => {
            const key = row.preference_key.replace('privacy_', '') as PrivacyKey;
            if (key in prefs) {
              prefs[key] = row.preference_value === true || row.preference_value === 'true';
            }
          });

          set({ 
            prefs,
            loading: false 
          });
        } catch (error) {
          logger.error('Failed to fetch privacy preferences', error as Error, 'PRIVACY');
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
