
import React, { lazy } from 'react';
import { ComponentLoadingFallback } from '@/components/ui/loading-fallback';

// Lazy load des composants pour optimiser les performances
export const ImmersiveHome = lazy(() => 
  import('@/components/home/ImmersiveHome').then(module => ({
    default: module.ImmersiveHome
  }))
);

// Wrapper avec Suspense pour le chargement
export const ImmersiveHomeWrapper: React.FC = () => (
  <React.Suspense fallback={<ComponentLoadingFallback />}>
    <ImmersiveHome />
  </React.Suspense>
);
