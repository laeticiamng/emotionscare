
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import LoadingAnimation from '@/components/ui/loading-animation';

// Pages communes
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const ImmersiveHome = lazy(() => import('@/pages/ImmersiveHome'));

// Pages B2C
const B2CDashboardPage = lazy(() => import('@/pages/b2c/B2CDashboardPage'));

// Pages B2B
const B2BUserDashboard = lazy(() => import('@/pages/b2b/B2BUserDashboard'));
const B2BAdminDashboard = lazy(() => import('@/pages/b2b/B2BAdminDashboard'));

// Pages B2B Admin
const TeamsPage = lazy(() => import('@/pages/b2b/admin/TeamsPage'));
const ReportsPage = lazy(() => import('@/pages/b2b/admin/ReportsPage'));
const EventsPage = lazy(() => import('@/pages/b2b/admin/EventsPage'));
const OptimisationPage = lazy(() => import('@/pages/b2b/admin/OptimisationPage'));
const SettingsPage = lazy(() => import('@/pages/b2b/admin/SettingsPage'));

// Pages fonctionnalités (utilisation des pages existantes)
const EmotionsPage = lazy(() => import('@/pages/EmotionsPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const VRPage = lazy(() => import('@/pages/VRPage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));
const MeditationPage = lazy(() => import('@/pages/MeditationPage'));
const MusicGeneratorPage = lazy(() => import('@/pages/MusicGeneratorPage'));

// Pages nouvelles créées
const SocialCoconPage = lazy(() => import('@/pages/features/SocialCoconPage'));

// Composant de fallback pour le chargement
const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <LoadingAnimation text="Chargement de la page..." />
  </div>
);

export const buildUnifiedRoutes = (): RouteObject[] => {
  return [
    // Routes publiques
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/choose-mode',
      element: <ChooseModePage />,
    },
    {
      path: '/immersive',
      element: <ImmersiveHome />,
    },

    // Routes B2C protégées
    {
      path: '/b2c',
      element: <MainLayout />,
      children: [
        {
          path: 'dashboard',
          element: (
            <ProtectedRoute requiredRole="b2c">
              <B2CDashboardPage />
            </ProtectedRoute>
          ),
        },
      ],
    },

    // Routes B2B User protégées
    {
      path: '/b2b/user',
      element: <MainLayout />,
      children: [
        {
          path: 'dashboard',
          element: (
            <ProtectedRoute requiredRole="b2b_user">
              <B2BUserDashboard />
            </ProtectedRoute>
          ),
        },
      ],
    },

    // Routes B2B Admin protégées
    {
      path: '/b2b/admin',
      element: <MainLayout />,
      children: [
        {
          path: 'dashboard',
          element: (
            <ProtectedRoute requiredRole="b2b_admin">
              <B2BAdminDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: 'teams',
          element: (
            <ProtectedRoute requiredRole="b2b_admin">
              <TeamsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'reports',
          element: (
            <ProtectedRoute requiredRole="b2b_admin">
              <ReportsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'events',
          element: (
            <ProtectedRoute requiredRole="b2b_admin">
              <EventsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'optimisation',
          element: (
            <ProtectedRoute requiredRole="b2b_admin">
              <OptimisationPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'settings',
          element: (
            <ProtectedRoute requiredRole="b2b_admin">
              <SettingsPage />
            </ProtectedRoute>
          ),
        },
      ],
    },

    // Routes des fonctionnalités communes (accessibles selon les rôles)
    {
      path: '/emotions',
      element: (
        <ProtectedRoute>
          <MainLayout>
            <EmotionsPage />
          </MainLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/music',
      element: (
        <ProtectedRoute>
          <MainLayout>
            <MusicPage />
          </MainLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/music-generator',
      element: (
        <ProtectedRoute>
          <MainLayout>
            <MusicGeneratorPage />
          </MainLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/coach',
      element: (
        <ProtectedRoute>
          <MainLayout>
            <CoachPage />
          </MainLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/journal',
      element: (
        <ProtectedRoute>
          <MainLayout>
            <JournalPage />
          </MainLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/scan',
      element: (
        <ProtectedRoute>
          <MainLayout>
            <ScanPage />
          </MainLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/vr',
      element: (
        <ProtectedRoute>
          <MainLayout>
            <VRPage />
          </MainLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/gamification',
      element: (
        <ProtectedRoute>
          <MainLayout>
            <GamificationPage />
          </MainLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/social-cocon',
      element: (
        <ProtectedRoute>
          <MainLayout>
            <SocialCoconPage />
          </MainLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/meditation',
      element: (
        <ProtectedRoute>
          <MainLayout>
            <MeditationPage />
          </MainLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/preferences',
      element: (
        <ProtectedRoute>
          <MainLayout>
            <PreferencesPage />
          </MainLayout>
        </ProtectedRoute>
      ),
    },

    // Route de fallback
    {
      path: '*',
      element: <div>Page not found</div>,
    },
  ];
};
