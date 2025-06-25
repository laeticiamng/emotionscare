
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const EmotionsPage = lazy(() => import('@/pages/EmotionsPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));

export const featureRoutes: RouteObject[] = [
  {
    path: '/emotions',
    element: (
      <ProtectedRoute>
        <EmotionsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/music',
    element: (
      <ProtectedRoute>
        <MusicPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/coach',
    element: (
      <ProtectedRoute>
        <CoachPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/journal',
    element: (
      <ProtectedRoute>
        <JournalPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/scan',
    element: (
      <ProtectedRoute>
        <ScanPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/preferences',
    element: (
      <ProtectedRoute>
        <PreferencesPage />
      </ProtectedRoute>
    ),
  },
];
