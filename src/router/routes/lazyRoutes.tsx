
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import LoadingAnimation from '@/components/ui/loading-animation';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';

// Composant de fallback pour le chargement
const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <LoadingAnimation text="Chargement de la page..." />
  </div>
);

// Lazy loading des pages lourdes
const LazyVRPage = lazy(() => import('@/pages/VRPage'));
const LazyMusicPage = lazy(() => import('@/pages/MusicPage'));
const LazyCoachPage = lazy(() => import('@/pages/CoachPage'));
const LazyJournalPage = lazy(() => import('@/pages/JournalPage'));
const LazyB2BAdminDashboard = lazy(() => import('@/pages/B2BAdminDashboardPage'));
const LazyGamificationPage = lazy(() => import('@/pages/GamificationPage'));
const LazyScanPage = lazy(() => import('@/pages/ScanPage'));

// Wrapper pour le Suspense
const withSuspense = (Component: React.ComponentType) => () => (
  <Suspense fallback={<PageLoadingFallback />}>
    <Component />
  </Suspense>
);

// Routes optimisées avec lazy loading
export const optimizedRoutes: RouteObject[] = [
  {
    path: UNIFIED_ROUTES.VR,
    Component: withSuspense(LazyVRPage),
  },
  {
    path: UNIFIED_ROUTES.MUSIC,
    Component: withSuspense(LazyMusicPage),
  },
  {
    path: UNIFIED_ROUTES.COACH,
    Component: withSuspense(LazyCoachPage),
  },
  {
    path: UNIFIED_ROUTES.JOURNAL,
    Component: withSuspense(LazyJournalPage),
  },
  {
    path: UNIFIED_ROUTES.B2B_ADMIN_DASHBOARD,
    Component: withSuspense(LazyB2BAdminDashboard),
  },
  {
    path: UNIFIED_ROUTES.GAMIFICATION,
    Component: withSuspense(LazyGamificationPage),
  },
  {
    path: UNIFIED_ROUTES.SCAN,
    Component: withSuspense(LazyScanPage),
  },
];

export { withSuspense };
