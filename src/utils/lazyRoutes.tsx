
import React, { lazy } from 'react';

// Pages principales
export const ImmersiveHome = lazy(() => import('@/pages/ImmersiveHome'));
export const MeditationPage = lazy(() => import('@/pages/MeditationPage'));

// Export par défaut pour compatibilité
export default {
  ImmersiveHome,
  MeditationPage,
};
