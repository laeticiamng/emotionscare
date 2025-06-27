import React, { lazy, Suspense } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import Shell from '@/Shell';
import Layout from '@/components/layout/Layout';
import LoadingAnimation from '@/components/ui/loading-animation';
import { ComponentLoadingFallback } from '@/components/ui/loading-fallback';
import { UNIFIED_ROUTES, getContextualRedirect } from '@/utils/routeUtils';
import { useAuth } from '@/hooks/useAuth';
import { validateRoute } from '@/routesManifest';
import { optimizedRoutes } from './routes/lazyRoutes';
import { B2CLoginPage, B2CRegisterPage, B2BUserLoginPage, B2BUserRegisterPage, B2BAdminLoginPage, B2BUserDashboardPage, B2BAdminDashboardPage, B2CDashboardPage } from '@/utils/lazyComponents';
import FeedbackPage from '@/pages/FeedbackPage';
import AccountDeletePage from '@/pages/AccountDeletePage';
import ExportCSVPage from '@/pages/ExportCSVPage';
import PrivacyTogglesPage from '@/pages/PrivacyTogglesPage';
import HealthCheckBadgePage from '@/pages/HealthCheckBadgePage';
import B2BPage from '@/pages/B2BPage';
import B2BSelectionPage from '@/pages/B2BSelectionPage';
import { OFFICIAL_ROUTES } from '@/routesManifest';

// Composant de fallback pour le chargement
const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <LoadingAnimation text="Chargement de la page..." />
  </div>
);

// Wrapper pour Suspense
const withSuspense = (Component: React.ComponentType) => () => (
  <Suspense fallback={<PageLoadingFallback />}>
    <Component />
  </Suspense>
);

// Lazy loading des pages lourdes
const LazyHomePage = lazy(() => import('@/pages/HomePage'));
const LazyChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const LazyScanPage = lazy(() => import('@/pages/ScanPage'));
const LazyMusicPage = lazy(() => import('@/pages/MusicPage'));
const LazyCoachPage = lazy(() => import('@/pages/CoachPage'));
const LazyJournalPage = lazy(() => import('@/pages/JournalPage'));
const LazyVRPage = lazy(() => import('@/pages/VRPage'));
const LazyPreferencesPage = lazy(() => import('@/pages/PreferencesPage'));
const LazyGamificationPage = lazy(() => import('@/pages/GamificationPage'));
const LazySocialCoconPage = lazy(() => import('@/pages/SocialCoconPage'));
const LazyTeamsPage = lazy(() => import('@/pages/TeamsPage'));
const LazyReportsPage = lazy(() => import('@/pages/ReportsPage'));
const LazyEventsPage = lazy(() => import('@/pages/EventsPage'));
const LazyOptimisationPage = lazy(() => import('@/pages/OptimisationPage'));
const LazySettingsPage = lazy(() => import('@/pages/SettingsPage'));

// Composant ProtectedRoute
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, userMode } = useAuth();

  if (!isLoggedIn) {
    const redirectPath = getContextualRedirect(userMode);
    console.warn('🔒 Accès refusé: Redirection vers', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

// Construction des routes unifiées
export const buildUnifiedRoutes = (): RouteObject[] => {
  console.log('🏗️ Construction des routes unifiées...');

  return [
    {
      path: '/',
      element: <Shell />,
      children: [
        // Routes publiques
        {
          index: true,
          element: withSuspense(LazyHomePage)(),
        },
        {
          path: UNIFIED_ROUTES.CHOOSE_MODE,
          element: withSuspense(LazyChooseModePage)(),
        },
        {
          path: UNIFIED_ROUTES.B2B_SELECTION,
          element: withSuspense(B2BSelectionPage)(),
        },

        // Routes d'authentification
        {
          path: UNIFIED_ROUTES.B2C_LOGIN,
          element: withSuspense(B2CLoginPage)(),
        },
        {
          path: UNIFIED_ROUTES.B2C_REGISTER,
          element: withSuspense(B2CRegisterPage)(),
        },
        {
          path: UNIFIED_ROUTES.B2B_USER_LOGIN,
          element: withSuspense(B2BUserLoginPage)(),
        },
        {
          path: UNIFIED_ROUTES.B2B_USER_REGISTER,
          element: withSuspense(B2BUserRegisterPage)(),
        },
        {
          path: UNIFIED_ROUTES.B2B_ADMIN_LOGIN,
          element: withSuspense(B2BAdminLoginPage)(),
        },

        // Routes protégées (nécessitent une authentification)
        {
          element: <ProtectedRoute />,
          children: [
            // Dashboards
            {
              path: UNIFIED_ROUTES.B2C_DASHBOARD,
              element: withSuspense(B2CDashboardPage)(),
            },
            {
              path: UNIFIED_ROUTES.B2B_USER_DASHBOARD,
              element: withSuspense(B2BUserDashboardPage)(),
            },
            {
              path: UNIFIED_ROUTES.B2B_ADMIN_DASHBOARD,
              element: withSuspense(B2BAdminDashboardPage)(),
            },

            // Fonctionnalités
            {
              path: UNIFIED_ROUTES.SCAN,
              element: withSuspense(LazyScanPage)(),
            },
            {
              path: UNIFIED_ROUTES.MUSIC,
              element: withSuspense(LazyMusicPage)(),
            },
            {
              path: UNIFIED_ROUTES.COACH,
              element: withSuspense(LazyCoachPage)(),
            },
            {
              path: UNIFIED_ROUTES.JOURNAL,
              element: withSuspense(LazyJournalPage)(),
            },
            {
              path: UNIFIED_ROUTES.VR,
              element: withSuspense(LazyVRPage)(),
            },
             {
              path: UNIFIED_ROUTES.PREFERENCES,
              element: withSuspense(LazyPreferencesPage)(),
            },
            {
              path: UNIFIED_ROUTES.GAMIFICATION,
              element: withSuspense(LazyGamificationPage)(),
            },
            {
              path: UNIFIED_ROUTES.SOCIAL_COCON,
              element: withSuspense(LazySocialCoconPage)(),
            },

            // Admin-only features
            {
              path: UNIFIED_ROUTES.TEAMS,
              element: withSuspense(LazyTeamsPage)(),
            },
            {
              path: UNIFIED_ROUTES.REPORTS,
              element: withSuspense(LazyReportsPage)(),
            },
            {
              path: UNIFIED_ROUTES.EVENTS,
              element: withSuspense(LazyEventsPage)(),
            },
            {
              path: UNIFIED_ROUTES.OPTIMISATION,
              element: withSuspense(LazyOptimisationPage)(),
            },
            {
              path: UNIFIED_ROUTES.SETTINGS,
              element: withSuspense(LazySettingsPage)(),
            },
             // User spaces routes - NEW PAGES
      {
        path: OFFICIAL_ROUTES.FEEDBACK,
        element: (
          <Suspense fallback={<ComponentLoadingFallback />}>
            <FeedbackPage />
          </Suspense>
        ),
      },
      {
        path: OFFICIAL_ROUTES.ACCOUNT_DELETE,
        element: (
          <Suspense fallback={<ComponentLoadingFallback />}>
            <AccountDeletePage />
          </Suspense>
        ),
      },
      {
        path: OFFICIAL_ROUTES.EXPORT_CSV,
        element: (
          <Suspense fallback={<ComponentLoadingFallback />}>
            <ExportCSVPage />
          </Suspense>
        ),
      },
      {
        path: OFFICIAL_ROUTES.PRIVACY_TOGGLES,
        element: (
          <Suspense fallback={<ComponentLoadingFallback />}>
            <PrivacyTogglesPage />
          </Suspense>
        ),
      },
      {
        path: OFFICIAL_ROUTES.HEALTH_CHECK_BADGE,
        element: (
          <Suspense fallback={<ComponentLoadingFallback />}>
            <HealthCheckBadgePage />
          </Suspense>
        ),
      },

      // B2B spaces routes - NEW PAGES
      {
        path: OFFICIAL_ROUTES.B2B,
        element: (
          <Suspense fallback={<ComponentLoadingFallback />}>
            <B2BPage />
          </Suspense>
        ),
      },
      {
        path: OFFICIAL_ROUTES.B2B_SELECTION,
        element: (
          <Suspense fallback={<ComponentLoadingFallback />}>
            <B2BSelectionPage />
          </Suspense>
        ),
      },
          ],
        },
      ],
    },
    // ...optimizedRoutes, // Intégration des routes optimisées
    {
      path: '*',
      element: <div>Page Not Found</div>, // Fallback pour les routes inconnues
    },
  ].map(route => {
    if (route.path && !validateRoute(route.path)) {
      console.warn(`Route non validée: ${route.path}`);
    }
    return route;
  });
};
