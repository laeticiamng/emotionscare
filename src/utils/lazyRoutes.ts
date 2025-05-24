
import { lazy, ComponentType } from 'react';

// Utilitaire pour retry automatique en cas d'échec de chargement
const retryLazyImport = <T>(
  importFn: () => Promise<{ default: T }>,
  retries = 3
): Promise<{ default: T }> => {
  return importFn().catch((error) => {
    if (retries > 0) {
      console.warn(`Retry loading component, ${retries} attempts left`, error);
      return retryLazyImport(importFn, retries - 1);
    }
    throw error;
  });
};

// Lazy loading avec retry automatique
const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => {
  return lazy(() => retryLazyImport(importFn, 3));
};

// Pages principales - Lazy loaded
export const MeditationPage = createLazyComponent(() => import('@/pages/MeditationPage'));
export const ImmersiveHome = createLazyComponent(() => import('@/pages/ImmersiveHome'));

// Components lourds - Lazy loaded
export const GuidedSessionList = createLazyComponent(() => import('@/components/meditation/GuidedSessionList'));
export const EnhancedCoachAI = createLazyComponent(() => import('@/components/coach/EnhancedCoachAI'));
export const CoachChatInterface = createLazyComponent(() => import('@/components/coach/CoachChatInterface'));
