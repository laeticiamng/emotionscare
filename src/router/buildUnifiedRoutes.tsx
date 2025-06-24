
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import B2BLayout from '@/layouts/B2BLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import UniversalErrorBoundary from '@/components/ErrorBoundary/UniversalErrorBoundary';

// Pages principales
const ImmersiveHome = lazy(() => import('@/pages/ImmersiveHome'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const B2BSelectionPage = lazy(() => import('@/pages/B2BSelectionPage'));
const Point20Page = lazy(() => import('@/pages/Point20Page'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));

// Pages B2C - utilisation des imports corrects depuis lazyComponents.ts
const B2CLoginPage = lazy(() => import('@/pages/b2c/LoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/b2c/RegisterPage'));
const B2CDashboardPage = lazy(() => import('@/pages/b2c/DashboardPage'));
const B2CJournalPage = lazy(() => import('@/pages/b2c/JournalPage'));
const B2CScanPage = lazy(() => import('@/pages/b2c/ScanPage'));
const B2CMusicPage = lazy(() => import('@/pages/b2c/MusicPage'));
const B2CCoachPage = lazy(() => import('@/pages/b2c/CoachPage'));
const B2CVRPage = lazy(() => import('@/pages/b2c/VRPage'));
const B2CGamificationPage = lazy(() => import('@/pages/b2c/GamificationPage'));
const B2CSocialPage = lazy(() => import('@/pages/b2c/SocialPage'));
const B2CSettingsPage = lazy(() => import('@/pages/b2c/SettingsPage'));

// Pages B2B User
const B2BUserLoginPage = lazy(() => import('@/pages/b2b/user/LoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/b2b/user/RegisterPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/b2b/user/DashboardPage'));
const B2BUserScanPage = lazy(() => import('@/pages/b2b/user/ScanPage'));
const B2BUserCoachPage = lazy(() => import('@/pages/b2b/user/CoachPage'));
const B2BUserMusicPage = lazy(() => import('@/pages/b2b/user/MusicPage'));

// Pages B2B Admin
const B2BAdminLoginPage = lazy(() => import('@/pages/b2b/admin/LoginPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/b2b/admin/DashboardPage'));

// Pages fonctionnelles communes (placeholders)
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const VRPage = lazy(() => import('@/pages/VRPage'));
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));
const SocialCoconPage = lazy(() => import('@/pages/SocialCoconPage'));

// Placeholders pour les pages manquantes - créer des composants simples
const PlaceholderPage = lazy(() => Promise.resolve({ 
  default: () => (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Page en construction</h1>
      <p className="text-muted-foreground">Cette fonctionnalité sera bientôt disponible.</p>
    </div>
  )
}));

export const ROUTE_MANIFEST = [
  '/',
  '/choose-mode',
  '/b2b/selection',
  '/onboarding',
  '/b2c/login',
  '/b2c/register',
  '/b2c/dashboard',
  '/scan',
  '/music',
  '/coach',
  '/journal',
  '/vr',
  '/preferences',
  '/gamification',
  '/social-cocon',
  '/b2b/user/login',
  '/b2b/user/register',
  '/b2b/user/dashboard',
  '/b2b/admin/login',
  '/b2b/admin/dashboard'
];

export function buildUnifiedRoutes() {
  return [
    // Routes publiques
    {
      path: '/',
      element: <ImmersiveHome />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/choose-mode',
      element: <ChooseModePage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/b2b/selection',
      element: <B2BSelectionPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/onboarding',
      element: <OnboardingPage />,
      errorElement: <UniversalErrorBoundary />
    },

    // Routes B2C
    {
      path: '/b2c/login',
      element: <B2CLoginPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/b2c/register',
      element: <B2CRegisterPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/b2c',
      element: (
        <ProtectedRoute requiredRole="b2c">
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: 'dashboard',
          element: <B2CDashboardPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'journal',
          element: <B2CJournalPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'scan',
          element: <B2CScanPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'music',
          element: <B2CMusicPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'coach',
          element: <B2CCoachPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'vr',
          element: <B2CVRPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'gamification',
          element: <B2CGamificationPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'social',
          element: <B2CSocialPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'settings',
          element: <B2CSettingsPage />,
          errorElement: <UniversalErrorBoundary />
        }
      ]
    },

    // Routes B2B User
    {
      path: '/b2b/user/login',
      element: <B2BUserLoginPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/b2b/user/register',
      element: <B2BUserRegisterPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/b2b/user',
      element: (
        <ProtectedRoute requiredRole="b2b_user">
          <B2BLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: 'dashboard',
          element: <B2BUserDashboardPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'scan',
          element: <B2BUserScanPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'coach',
          element: <B2BUserCoachPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'music',
          element: <B2BUserMusicPage />,
          errorElement: <UniversalErrorBoundary />
        }
      ]
    },

    // Routes B2B Admin
    {
      path: '/b2b/admin/login',
      element: <B2BAdminLoginPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/b2b/admin',
      element: (
        <ProtectedRoute requiredRole="b2b_admin">
          <B2BLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: 'dashboard',
          element: <B2BAdminDashboardPage />,
          errorElement: <UniversalErrorBoundary />
        }
      ]
    },

    // Routes fonctionnelles communes
    {
      path: '/scan',
      element: <ScanPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/music',
      element: <MusicPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/coach',
      element: <CoachPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/journal',
      element: <JournalPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/vr',
      element: <VRPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/preferences',
      element: <PreferencesPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/gamification',
      element: <GamificationPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/social-cocon',
      element: <SocialCoconPage />,
      errorElement: <UniversalErrorBoundary />
    },

    // Route catch-all pour les 404
    {
      path: '*',
      element: <Navigate to="/" replace />,
      errorElement: <UniversalErrorBoundary />
    }
  ];
}
