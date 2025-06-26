
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  lastRefresh: number;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  refreshSession: () => Promise<boolean>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,
      lastRefresh: 0,

      setSession: (session: Session | null) => {
        set({
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session?.user,
          lastRefresh: Date.now()
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      refreshSession: async (): Promise<boolean> => {
        try {
          const { data, error } = await supabase.auth.refreshSession();
          
          if (error || !data.session) {
            console.log('🔄 Session refresh failed:', error?.message);
            get().setSession(null);
            return false;
          }

          console.log('✅ Session refreshed successfully');
          get().setSession(data.session);
          return true;
        } catch (error) {
          console.error('❌ Refresh session error:', error);
          get().setSession(null);
          return false;
        }
      },

      logout: async (): Promise<void> => {
        try {
          await supabase.auth.signOut();
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
            lastRefresh: 0
          });
        } catch (error) {
          console.error('❌ Logout error:', error);
        }
      },

      initialize: async (): Promise<void> => {
        try {
          set({ isLoading: true });

          // Récupérer la session existante
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('❌ Get session error:', error);
            set({ isLoading: false });
            return;
          }

          // Vérifier si la session est proche de l'expiration
          if (session?.expires_at) {
            const expiresAt = session.expires_at * 1000;
            const now = Date.now();
            const timeUntilExpiry = expiresAt - now;

            // Si expire dans moins de 60 secondes, tenter un refresh
            if (timeUntilExpiry < 60000) {
              console.log('🔄 Session expires soon, refreshing...');
              const refreshSuccess = await get().refreshSession();
              if (!refreshSuccess) {
                set({ isLoading: false });
                return;
              }
            } else {
              get().setSession(session);
            }
          } else {
            get().setSession(session);
          }

          set({ isLoading: false });
        } catch (error) {
          console.error('❌ Auth initialization error:', error);
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        session: state.session,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        lastRefresh: state.lastRefresh
      })
    }
  )
);

// Auto-refresh des tokens avant expiration
setInterval(() => {
  const { session, refreshSession } = useAuthStore.getState();
  
  if (session?.expires_at) {
    const expiresAt = session.expires_at * 1000;
    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;

    // Refresh 60 secondes avant expiration
    if (timeUntilExpiry < 60000 && timeUntilExpiry > 0) {
      console.log('🔄 Auto-refreshing session...');
      refreshSession();
    }
  }
}, 30000); // Vérifier toutes les 30 secondes
