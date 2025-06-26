
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { homeRoutes } from './routes/homeRoutes';
import { userRoutes } from './routes/userRoutes';

// Lazy load pages
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const VRPage = lazy(() => import('@/pages/VRPage'));
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));
const SocialCoconPage = lazy(() => import('@/pages/SocialCoconPage'));

export function buildUnifiedRoutes(): RouteObject[] {
  return [
    // Home routes
    ...homeRoutes,
    
    // User routes (B2C, B2B)
    ...userRoutes,
    
    // Feature routes
    {
      path: '/scan',
      element: <ScanPage />,
    },
    {
      path: '/music',
      element: <MusicPage />,
    },
    {
      path: '/coach',
      element: <CoachPage />,
    },
    {
      path: '/journal',
      element: <JournalPage />,
    },
    {
      path: '/vr',
      element: <VRPage />,
    },
    {
      path: '/preferences',
      element: <PreferencesPage />,
    },
    {
      path: '/gamification',
      element: <GamificationPage />,
    },
    {
      path: '/social-cocon',
      element: <SocialCoconPage />,
    },
    
    // Catch all 404
    {
      path: '*',
      element: lazy(() => import('@/pages/NotFoundPage'))(),
    }
  ];
}
