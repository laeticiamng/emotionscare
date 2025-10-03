
import React, { lazy } from 'react';
import { ComponentLoadingFallback } from '@/components/ui/loading-fallback';

// Lazy loading unifié pour optimiser les performances
export const ImmersiveHome = lazy(() => 
  import('@/pages/ImmersiveHome').then(module => ({
    default: module.default
  }))
);

export const MeditationPage = lazy(() => 
  import('@/pages/MeditationPage').then(module => ({
    default: module.default
  }))
);

// Wrapper avec Suspense pour le chargement unifié
export const LazyPageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <React.Suspense fallback={<ComponentLoadingFallback />}>
    {children}
  </React.Suspense>
);

export default {
  ImmersiveHome,
  MeditationPage,
  LazyPageWrapper
};
