/**
 * 🗃️ PREMIUM STATE MANAGER
 * Gestionnaire d'état centralisé pour l'architecture premium
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  role: string;
  permissions: string[];
  subscription: string;
  preferences: Record<string, any>;
}

interface AppState {
  features: Array<{ id: string; enabled: boolean }>;
  theme: 'light' | 'dark' | 'system';
  performance: {
    enableAnimations: boolean;
    enablePreloading: boolean;
    optimizeImages: boolean;
  };
}

interface AnalyticsEvent {
  event: string;
  data: Record<string, any>;
  timestamp: number;
}

interface PremiumState {
  // User State
  user: User | null;
  isAuthenticated: boolean;
  
  // App State
  app: AppState;
  
  // Analytics
  analytics: AnalyticsEvent[];
  
  // Actions
  setUser: (user: User | null) => void;
  updateAppSettings: (settings: Partial<AppState>) => void;
  trackAnalytics: (event: string, data: Record<string, any>) => void;
  clearAnalytics: () => void;
}

export const usePremiumStore = create<PremiumState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        user: null,
        isAuthenticated: false,
        
        app: {
          features: [
            { id: 'premium_coaching', enabled: true },
            { id: 'premium_music', enabled: true },
            { id: 'vr_experiences', enabled: true },
            { id: 'advanced_analytics', enabled: true }
          ],
          theme: 'system',
          performance: {
            enableAnimations: true,
            enablePreloading: true,
            optimizeImages: true
          }
        },
        
        analytics: [],
        
        // Actions
        setUser: (user) => 
          set((state) => ({ 
            user, 
            isAuthenticated: !!user 
          }), false, 'setUser'),
        
        updateAppSettings: (settings) =>
          set((state) => ({
            app: { ...state.app, ...settings }
          }), false, 'updateAppSettings'),
        
        trackAnalytics: (event, data) =>
          set((state) => ({
            analytics: [
              ...state.analytics,
              { event, data, timestamp: Date.now() }
            ].slice(-100) // Keep only last 100 events
          }), false, 'trackAnalytics'),
        
        clearAnalytics: () =>
          set({ analytics: [] }, false, 'clearAnalytics')
      }),
      {
        name: 'premium-store',
        partialize: (state) => ({
          user: state.user,
          app: state.app
        }),
      }
    ),
    { name: 'PremiumStore' }
  )
);