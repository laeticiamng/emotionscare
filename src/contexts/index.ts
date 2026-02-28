import React from 'react';

// ========== EXPORTS UNIFIÉS - OPTIMISÉS ==========

// Contextes principaux avec implémentations complètes
export { AuthProvider, useAuth } from './AuthContext';
export { UserModeProvider, useUserMode } from './UserModeContext';
export { ThemeProvider, useTheme } from '@/providers/theme';

// Contextes unifiés optimisés  
export { UnifiedCacheProvider as CacheProvider, useUnifiedCache as useCache } from './UnifiedCacheContext';
export { UnifiedCoachProvider as CoachProvider, useUnifiedCoach as useCoach } from './coach/UnifiedCoachContext';

// MusicContext - Utiliser la version complète
export { MusicProvider, useMusic, MusicContext } from './MusicContext';

// Contextes fonctionnels
export { FeedbackProvider, useFeedback } from './FeedbackContext';
export { InnovationProvider, useInnovation } from './InnovationContext';
export { EthicsProvider, useEthics } from './EthicsContext';
export { ErrorProvider, useErrorHandler as useError } from './ErrorContext';

// ========== CONTEXTES SIMPLIFIÉS POUR COMPATIBILITÉ ==========

// UserPreferences - utiliser l'implémentation complète
export { UserPreferencesContext, UserPreferencesProvider, useUserPreferences } from './UserPreferencesContext';

export const SidebarContext = React.createContext(null);
export const SupportContext = React.createContext(null);
export const OnboardingContext = React.createContext(null);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => children;
export const SupportProvider = ({ children }: { children: React.ReactNode }) => children;
export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => children;

export const useSidebar = () => ({ 
  collapsed: false, 
  toggleCollapsed: () => {}, 
  setCollapsed: () => {} 
});

export const useSupport = () => ({ 
  contactSupport: () => Promise.resolve(),
  getFAQ: () => [],
  submitTicket: () => Promise.resolve('ticket-123')
});

export const useOnboarding = () => ({ 
  isCompleted: true,
  currentStep: 0,
  totalSteps: 5,
  nextStep: () => {},
  previousStep: () => {},
  complete: () => {},
  reset: () => {}
});
