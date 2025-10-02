import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';

import { createSelectors } from '@/store/utils/createSelectors';
import { persist } from '@/store/utils/createImmutableStore';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

type Nullable<T> = T | null;

interface AuthStoreState {
  user: Nullable<User>;
  session: Nullable<Session>;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;
  lastSyncAt: Nullable<number>;
  setSession: (session: Nullable<Session>) => void;
  setUser: (user: Nullable<User>) => void;
  setLoading: (loading: boolean) => void;
  clearSession: () => void;
  initialize: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const initialState: Omit<AuthStoreState,
  'setSession' | 'setUser' | 'setLoading' | 'clearSession' | 'initialize' | 'refreshSession'> = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  hasHydrated: false,
  lastSyncAt: null,
};

let initializePromise: Promise<void> | null = null;

const syncSession = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session ?? null;
};

const authStoreBase = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSession: (session) => {
        set({
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session,
          isLoading: false,
          hasHydrated: true,
          lastSyncAt: session ? Date.now() : null,
        });
        logger.debug('Auth session updated', { hasSession: !!session }, 'AUTH');
      },

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
        logger.debug('Auth user updated', { hasUser: !!user }, 'AUTH');
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      clearSession: () => {
        set({
          session: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          lastSyncAt: Date.now(),
        });
        logger.info('Auth session cleared', {}, 'AUTH');
      },

      initialize: async () => {
        if (get().hasHydrated && get().session) {
          logger.debug('Auth store already hydrated with active session', {}, 'AUTH');
          set({ isLoading: false });
          return;
        }

        if (initializePromise) {
          await initializePromise;
          return;
        }

        set({ isLoading: true });

        initializePromise = (async () => {
          try {
            const session = await syncSession();
            set({
              session,
              user: session?.user ?? null,
              isAuthenticated: !!session,
              hasHydrated: true,
              isLoading: false,
              lastSyncAt: session ? Date.now() : null,
            });
            logger.debug('Auth store initialized', { hasSession: !!session }, 'AUTH');
          } catch (error) {
            logger.error('Failed to initialize auth store', error, 'AUTH');
            set({
              session: null,
              user: null,
              isAuthenticated: false,
              hasHydrated: true,
              isLoading: false,
              lastSyncAt: Date.now(),
            });
          } finally {
            initializePromise = null;
          }
        })();

        await initializePromise;
      },

      refreshSession: async () => {
        try {
          const session = await syncSession();
          set({
            session,
            user: session?.user ?? null,
            isAuthenticated: !!session,
            lastSyncAt: Date.now(),
          });
          logger.debug('Auth session refreshed', { hasSession: !!session }, 'AUTH');
        } catch (error) {
          logger.error('Failed to refresh auth session', error, 'AUTH');
          set({
            session: null,
            user: null,
            isAuthenticated: false,
            lastSyncAt: Date.now(),
          });
        }
      },
    }),
    {
      name: 'ec-auth-store',
      storage: () => localStorage,
      version: 1,
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
        hasHydrated: state.hasHydrated,
        isLoading: state.isLoading,
        lastSyncAt: state.lastSyncAt,
      }),
    }
  )
);

export const useAuthStore = createSelectors(authStoreBase);
