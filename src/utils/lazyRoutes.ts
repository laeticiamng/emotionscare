
import { lazy } from 'react';

// Lazy loading des pages principales
export const MeditationPage = lazy(() => import('@/pages/MeditationPage'));
export const ImmersiveHome = lazy(() => import('@/pages/ImmersiveHome'));

export default {
  MeditationPage,
  ImmersiveHome
};
