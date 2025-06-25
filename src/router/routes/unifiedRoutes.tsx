
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import ChooseModePage from '@/pages/ChooseModePage';

// Lazy loading pour les pages existantes
const B2CLoginPage = lazy(() => import('@/pages/b2c/LoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/b2c/RegisterPage'));
const B2CDashboardPage = lazy(() => import('@/pages/b2c/DashboardPage'));

const B2BSelectionPage = lazy(() => import('@/pages/b2b/B2BSelectionPage'));
const B2BUserLoginPage = lazy(() => import('@/pages/b2b/B2BUserLoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/b2b/B2BUserRegisterPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/b2b/B2BUserDashboard'));
const B2BAdminLoginPage = lazy(() => import('@/pages/b2b/B2BAdminLoginPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/b2b/B2BAdminDashboard'));

const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const FlashGlowPage = lazy(() => import('@/pages/FlashGlowPage'));
const BossLevelGritPage = lazy(() => import('@/pages/BossLevelGritPage'));
const MoodMixerPage = lazy(() => import('@/pages/MoodMixerPage'));
const BounceBackBattlePage = lazy(() => import('@/pages/BounceBackBattlePage'));
const BreathworkPage = lazy(() => import('@/pages/BreathworkPage'));
const InstantGlowPage = lazy(() => import('@/pages/InstantGlowPage'));

const VRPage = lazy(() => import('@/pages/VRPage'));
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));
const TeamsPage = lazy(() => import('@/pages/TeamsPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));
const OptimisationPage = lazy(() => import('@/pages/OptimisationPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

// Stub components pour les pages manquantes
const StubPage = ({ title }: { title: string }) => (
  <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{title}</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Page en cours de développement - {title}
        </p>
      </div>
    </div>
  </div>
);

export const unifiedRoutes: RouteObject[] = [
  // Routes principales
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/choose-mode',
    element: <ChooseModePage />,
  },

  // Routes B2C
  {
    path: '/b2c/login',
    element: <B2CLoginPage />,
  },
  {
    path: '/b2c/register',
    element: <B2CRegisterPage />,
  },
  {
    path: '/b2c/dashboard',
    element: (
      <ProtectedRoute requiredRole="b2c">
        <B2CDashboardPage />
      </ProtectedRoute>
    ),
  },

  // Routes B2B
  {
    path: '/b2b',
    element: <StubPage title="B2B Landing" />,
  },
  {
    path: '/b2b/selection',
    element: <B2BSelectionPage />,
  },
  {
    path: '/b2b/user/login',
    element: <B2BUserLoginPage />,
  },
  {
    path: '/b2b/user/register',
    element: <B2BUserRegisterPage />,
  },
  {
    path: '/b2b/user/dashboard',
    element: (
      <ProtectedRoute requiredRole="b2b_user">
        <B2BUserDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/admin/login',
    element: <B2BAdminLoginPage />,
  },
  {
    path: '/b2b/admin/dashboard',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <B2BAdminDashboardPage />
      </ProtectedRoute>
    ),
  },

  // Routes mesure & adaptation
  {
    path: '/scan',
    element: (
      <ProtectedRoute>
        <ScanPage />
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
    path: '/flash-glow',
    element: (
      <ProtectedRoute>
        <FlashGlowPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/boss-level-grit',
    element: (
      <ProtectedRoute>
        <BossLevelGritPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/mood-mixer',
    element: (
      <ProtectedRoute>
        <MoodMixerPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/bounce-back-battle',
    element: (
      <ProtectedRoute>
        <BounceBackBattlePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/breathwork',
    element: (
      <ProtectedRoute>
        <BreathworkPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/instant-glow',
    element: (
      <ProtectedRoute>
        <InstantGlowPage />
      </ProtectedRoute>
    ),
  },

  // Routes immersives
  {
    path: '/vr',
    element: (
      <ProtectedRoute>
        <VRPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vr-galactique',
    element: <StubPage title="VR Galactique" />,
  },
  {
    path: '/screen-silk-break',
    element: <StubPage title="Screen Silk Break" />,
  },
  {
    path: '/story-synth-lab',
    element: <StubPage title="Story Synth Lab" />,
  },
  {
    path: '/ar-filters',
    element: <StubPage title="AR Filters" />,
  },
  {
    path: '/bubble-beat',
    element: <StubPage title="Bubble Beat" />,
  },

  // Routes ambition & progression
  {
    path: '/ambition-arcade',
    element: <StubPage title="Ambition Arcade" />,
  },
  {
    path: '/gamification',
    element: <StubPage title="Gamification" />,
  },
  {
    path: '/weekly-bars',
    element: <StubPage title="Weekly Bars" />,
  },
  {
    path: '/heatmap-vibes',
    element: <StubPage title="Heatmap Vibes" />,
  },

  // Routes espaces utilisateur
  {
    path: '/onboarding',
    element: <StubPage title="Onboarding" />,
  },
  {
    path: '/preferences',
    element: (
      <ProtectedRoute>
        <PreferencesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/social-cocon',
    element: <StubPage title="Social Cocon" />,
  },
  {
    path: '/profile-settings',
    element: <StubPage title="Profile Settings" />,
  },
  {
    path: '/activity-history',
    element: <StubPage title="Activity History" />,
  },
  {
    path: '/notifications',
    element: <StubPage title="Notifications" />,
  },
  {
    path: '/feedback',
    element: <StubPage title="Feedback" />,
  },
  {
    path: '/account/delete',
    element: <StubPage title="Account Delete" />,
  },
  {
    path: '/export-csv',
    element: <StubPage title="Export CSV" />,
  },
  {
    path: '/privacy-toggles',
    element: <StubPage title="Privacy Toggles" />,
  },
  {
    path: '/health-check-badge',
    element: <StubPage title="Health Check Badge" />,
  },

  // Routes B2B espaces
  {
    path: '/teams',
    element: (
      <ProtectedRoute allowedRoles={['b2b_user', 'b2b_admin']}>
        <TeamsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports',
    element: (
      <ProtectedRoute allowedRoles={['b2b_admin']}>
        <ReportsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/events',
    element: (
      <ProtectedRoute allowedRoles={['b2b_user', 'b2b_admin']}>
        <EventsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/optimisation',
    element: (
      <ProtectedRoute allowedRoles={['b2b_admin']}>
        <OptimisationPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/security',
    element: <StubPage title="Security" />,
  },
  {
    path: '/audit',
    element: <StubPage title="Audit" />,
  },
  {
    path: '/accessibility',
    element: <StubPage title="Accessibility" />,
  },
  {
    path: '/innovation',
    element: <StubPage title="Innovation" />,
  },
  {
    path: '/help-center',
    element: <StubPage title="Help Center" />,
  },

  // Route de fallback pour 404
  {
    path: '*',
    element: <StubPage title="Page non trouvée" />,
  },
];
