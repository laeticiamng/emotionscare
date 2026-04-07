// @ts-nocheck
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

// UserPreferences - utiliser l'implémentation complète
export { UserPreferencesContext, UserPreferencesProvider, useUserPreferences } from './UserPreferencesContext';

// Sidebar - implémentation réelle avec état persistant
export { SidebarProvider, useSidebar, SidebarContext } from './SidebarContext';

// Support - chat de support avec historique de messages
export { SupportProvider, useSupport, SupportContext } from './SupportContext';

// Onboarding - parcours d'accueil avec étapes et persistence Supabase
export { OnboardingProvider, useOnboarding, OnboardingContext } from './OnboardingContext';
