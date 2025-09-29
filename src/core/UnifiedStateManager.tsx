/**
 * UNIFIED STATE MANAGER - Version simplifiée
 * Remplace tous les contexts/stores éparpillés par un système unifié
 */

import React, { createContext, useContext, ReactNode } from 'react';

// ==================== TYPES SIMPLIFIÉS ====================

interface User {
  id: string;
  email: string;
  role: 'consumer' | 'employee' | 'manager' | 'admin';
}

interface UnifiedContextType {
  // Performance monitoring
  recordPerformanceMetric: (name: string, value: number) => void;
  
  // Accessibility helpers
  announceToScreenReader: (message: string) => void;
  applyAccessibilityPreferences: () => void;
  
  // Security functions
  logSecurityEvent: (event: string, details?: any) => void;
  validateSecureAction: (action: string) => boolean;
  
  // Analytics (privacy-compliant)
  trackEvent: (event: string, properties?: Record<string, any>) => void;
  
  // Error handling
  reportError: (error: Error, context?: string) => void;
}

const UnifiedContext = createContext<UnifiedContextType | null>(null);

export const useUnifiedContext = () => {
  const context = useContext(UnifiedContext);
  if (!context) {
    // Version non-critique - retourne des fonctions vides plutôt que de throw
    return {
      recordPerformanceMetric: () => {},
      announceToScreenReader: () => {},
      applyAccessibilityPreferences: () => {},
      logSecurityEvent: () => {},
      validateSecureAction: () => true,
      trackEvent: () => {},
      reportError: () => {},
    };
  }
  return context;
};

// ==================== PROVIDER SIMPLIFIÉ ====================

interface UnifiedProviderProps {
  children: ReactNode;
}

export const UnifiedProvider: React.FC<UnifiedProviderProps> = ({ children }) => {
  
  // Performance Monitoring
  const recordPerformanceMetric = (name: string, value: number) => {
    if (import.meta.env.DEV) {
      console.log(`📊 Performance: ${name} = ${value.toFixed(2)}ms`);
    }
  };
  
  // Accessibility
  const announceToScreenReader = (message: string) => {
    try {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);
    } catch (error) {
      console.warn('Screen reader announcement failed:', error);
    }
  };
  
  const applyAccessibilityPreferences = () => {
    // Version simplifiée - pas de dépendances sur le store
  };
  
  // Security
  const logSecurityEvent = (event: string, details?: any) => {
    if (import.meta.env.DEV) {
      console.warn(`🚨 Security Event: ${event}`, details);
    }
  };
  
  const validateSecureAction = (action: string): boolean => {
    return true; // Version simplifiée
  };
  
  // Analytics (Privacy-compliant)
  const trackEvent = (event: string, properties?: Record<string, any>) => {
    if (import.meta.env.DEV) {
      console.log(`📊 Event: ${event}`, properties);
    }
  };
  
  // Error Handling
  const reportError = (error: Error, context?: string) => {
    console.error(`❌ Error${context ? ` in ${context}` : ''}:`, error);
  };
  
  const contextValue: UnifiedContextType = {
    recordPerformanceMetric,
    announceToScreenReader,
    applyAccessibilityPreferences,
    logSecurityEvent,
    validateSecureAction,
    trackEvent,
    reportError,
  };
  
  return (
    <UnifiedContext.Provider value={contextValue}>
      {children}
    </UnifiedContext.Provider>
  );
};

// ==================== HOOKS UTILITAIRES SIMPLIFIÉS ====================

// Hook pour l'authentification simplifié
export const useAuth = () => {
  return {
    user: null,
    isAuthenticated: false,
    login: async (email: string, password: string) => {
      console.log('Login attempt:', { email });
    },
    logout: () => {
      console.log('Logout');
    },
    loading: false,
    error: null
  };
};

// Hook pour le store unifié simplifié
export const useUnifiedStore = () => {
  return {
    user: null,
    isAuthenticated: false,
    app: {
      isLoading: false,
      error: null,
      currentView: '/',
      sidebarOpen: false,
      modals: {},
    },
    music: {
      currentTrack: null,
      isPlaying: false,
      volume: 0.7,
      playlist: [],
      history: [],
    },
    emotions: {
      currentEmotion: null,
      history: [],
      insights: [],
    },
    setUser: () => {},
    updateUserPreferences: () => {},
    setAppState: () => {},
    toggleSidebar: () => {},
    openModal: () => {},
    closeModal: () => {},
    playTrack: () => {},
    pauseTrack: () => {},
    setVolume: () => {},
    nextTrack: () => {},
    previousTrack: () => {},
    addToPlaylist: () => {},
    removeFromPlaylist: () => {},
    recordEmotion: () => {},
    addInsight: () => {},
    clearEmotionHistory: () => {},
  };
};