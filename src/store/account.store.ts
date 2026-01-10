import { create } from 'zustand';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { persist } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';

export type AccountStatus = 'active' | 'soft_deleted';

export interface MeAccount {
  status: AccountStatus;
  purge_at?: string;
}

interface AccountState {
  status: AccountStatus;
  purgeAt?: string;
  loading: boolean;
  error: string | null;
  setStatus: (status: AccountStatus) => void;
  setPurgeAt: (purgeAt?: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  softDelete: (reason?: string) => Promise<boolean>;
  undelete: () => Promise<boolean>;
  checkStatus: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  status: 'active' as AccountStatus,
  purgeAt: undefined,
  loading: false,
  error: null,
};

const accountStoreBase = create<AccountState>()(
  persist(
    (set) => ({
      ...initialState,
      setStatus: (status) => set({ status }),
      setPurgeAt: (purgeAt) => set({ purgeAt }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      softDelete: async (reason) => {
        set({ loading: true, error: null });

        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const purgeDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

          const { error } = await supabase
            .from('profiles')
            .update({
              deletion_scheduled_at: purgeDate.toISOString(),
              deletion_reason: reason,
              is_active: false,
            })
            .eq('id', user.id);

          if (error) throw error;

          set({
            status: 'soft_deleted',
            purgeAt: purgeDate.toISOString(),
            loading: false,
          });

          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'account_delete_confirmed');
          }

          return true;
        } catch (error) {
          logger.error('Account deletion failed', error as Error, 'ACCOUNT');
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Erreur de suppression',
          });
          return false;
        }
      },

      undelete: async () => {
        set({ loading: true, error: null });

        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const { error } = await supabase
            .from('profiles')
            .update({
              deletion_scheduled_at: null,
              deletion_reason: null,
              is_active: true,
            })
            .eq('id', user.id);

          if (error) throw error;

          set({
            status: 'active',
            purgeAt: undefined,
            loading: false,
          });

          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'account_undelete_success');
          }

          return true;
        } catch (error) {
          logger.error('Account restoration failed', error as Error, 'ACCOUNT');
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Erreur de restauration',
          });
          return false;
        }
      },

      checkStatus: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data } = await supabase
            .from('profiles')
            .select('deletion_scheduled_at, is_active')
            .eq('id', user.id)
            .single();

          if (data?.deletion_scheduled_at) {
            set({
              status: 'soft_deleted',
              purgeAt: data.deletion_scheduled_at,
            });
          }
        } catch (error) {
          logger.warn('Failed to check account status', { error }, 'ACCOUNT');
        }
      },

      reset: () => set(initialState),
    }),
    {
      name: 'account-store',
      partialize: (state) => ({
        status: state.status,
        purgeAt: state.purgeAt,
      }),
    }
  )
);

export const useAccountStore = createSelectors(accountStoreBase);
