import { create } from 'zustand';

import { persist } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';

export type AccountStatus = 'active' | 'soft_deleted';

export interface DeleteResp {
  status: 'soft_deleted';
  purge_at: string;
}

export interface UndeleteResp {
  status: 'active';
}

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
    (set, get) => ({
      ...initialState,
      setStatus: (status) => set({ status }),
      setPurgeAt: (purgeAt) => set({ purgeAt }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      softDelete: async (reason) => {
        set({ loading: true, error: null });

        try {
          const response = await fetch('/api/me/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason }),
          });

          if (!response.ok) {
            throw new Error('Failed to delete account');
          }

          const data: DeleteResp = await response.json();
          set({
            status: data.status,
            purgeAt: data.purge_at,
            loading: false,
          });

          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'account_delete_confirmed');
          }

          return true;
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Erreur de suppression',
          });

          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'account_delete_error');
          }

          return false;
        }
      },
      undelete: async () => {
        set({ loading: true, error: null });

        try {
          const response = await fetch('/api/me/undelete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to restore account');
          }

          const data: UndeleteResp = await response.json();
          set({
            status: data.status,
            purgeAt: undefined,
            loading: false,
          });

          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'account_undelete_success');
          }

          return true;
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Erreur de restauration',
          });
          return false;
        }
      },
      checkStatus: async () => {
        try {
          console.log('Account status check skipped in demo mode');
        } catch (error) {
          console.warn('Failed to check account status:', error);
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
