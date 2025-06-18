
import { createBrowserRouter } from 'react-router-dom';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';

// Pages principales
import ImmersiveHome from '@/pages/ImmersiveHome';
import ModeSelectorPage from '@/pages/ModeSelectorPage';
import B2BSelectionPage from '@/pages/B2BSelectionPage';

// Pages d'authentification - CHEMINS UNIQUES
import B2CLoginPage from '@/pages/auth/B2CLoginPage';
import B2CRegisterPage from '@/pages/auth/B2CRegisterPage';
import B2BUserLoginPage from '@/pages/auth/B2BUserLoginPage';
import B2BUserRegisterPage from '@/pages/auth/B2BUserRegisterPage';
import B2BAdminLoginPage from '@/pages/auth/B2BAdminLoginPage';

// Pages de tableau de bord - CHEMINS UNIQUES
import B2CDashboardPage from '@/pages/dashboard/B2CDashboardPage';
import B2BUserDashboardPage from '@/pages/dashboard/B2BUserDashboardPage';
import B2BAdminDashboardPage from '@/pages/dashboard/B2BAdminDashboardPage';

// Pages des fonctionnalités - CHEMINS UNIQUES ABSOLUS
import ScanPage from '@/pages/ScanPage';
import MusicPage from '@/pages/MusicPage';
import CoachPage from '@/pages/CoachPage';
import JournalPage from '@/pages/JournalPage';
import VRPage from '@/pages/VRPage';
import PreferencesPage from '@/pages/PreferencesPage';
import GamificationPage from '@/pages/GamificationPage';
import SocialCoconPage from '@/pages/SocialCoconPage';

// Pages administrateur - CHEMINS UNIQUES
import TeamsPage from '@/pages/TeamsPage';
import ReportsPage from '@/pages/ReportsPage';
import EventsPage from '@/pages/EventsPage';
import OptimisationPage from '@/pages/OptimisationPage';
import SettingsPage from '@/pages/SettingsPage';

// Composants de protection
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/layout/Layout';

export const router = createBrowserRouter([
  // Routes publiques
  {
    path: UNIFIED_ROUTES.HOME,
    element: <ImmersiveHome />
  },
  {
    path: UNIFIED_ROUTES.CHOOSE_MODE,
    element: <ModeSelectorPage />
  },
  {
    path: UNIFIED_ROUTES.B2B_SELECTION,
    element: <B2BSelectionPage />
  },

  // Routes d'authentification B2C - UNIQUES
  {
    path: UNIFIED_ROUTES.B2C_LOGIN,
    element: <B2CLoginPage />
  },
  {
    path: UNIFIED_ROUTES.B2C_REGISTER,
    element: <B2CRegisterPage />
  },

  // Routes d'authentification B2B User - UNIQUES
  {
    path: UNIFIED_ROUTES.B2B_USER_LOGIN,
    element: <B2BUserLoginPage />
  },
  {
    path: UNIFIED_ROUTES.B2B_USER_REGISTER,
    element: <B2BUserRegisterPage />
  },

  // Routes d'authentification B2B Admin - UNIQUES
  {
    path: UNIFIED_ROUTES.B2B_ADMIN_LOGIN,
    element: <B2BAdminLoginPage />
  },

  // Routes protégées avec Layout
  {
    path: '/',
    element: <Layout />,
    children: [
      // Dashboards - CHEMINS UNIQUES
      {
        path: UNIFIED_ROUTES.B2C_DASHBOARD,
        element: (
          <ProtectedRoute mockUserMode="b2c" mockAuthenticated={true}>
            <B2CDashboardPage />
          </ProtectedRoute>
        )
      },
      {
        path: UNIFIED_ROUTES.B2B_USER_DASHBOARD,
        element: (
          <ProtectedRoute mockUserMode="b2b_user" mockAuthenticated={true}>
            <B2BUserDashboardPage />
          </ProtectedRoute>
        )
      },
      {
        path: UNIFIED_ROUTES.B2B_ADMIN_DASHBOARD,
        element: (
          <ProtectedRoute mockUserMode="b2b_admin" mockAuthenticated={true}>
            <B2BAdminDashboardPage />
          </ProtectedRoute>
        )
      },

      // Fonctionnalités communes - CHEMINS UNIQUES ABSOLUS
      {
        path: UNIFIED_ROUTES.SCAN,
        element: (
          <ProtectedRoute mockAuthenticated={true}>
            <ScanPage />
          </ProtectedRoute>
        )
      },
      {
        path: UNIFIED_ROUTES.MUSIC,
        element: (
          <ProtectedRoute mockAuthenticated={true}>
            <MusicPage />
          </ProtectedRoute>
        )
      },
      {
        path: UNIFIED_ROUTES.COACH,
        element: (
          <ProtectedRoute mockAuthenticated={true}>
            <CoachPage />
          </ProtectedRoute>
        )
      },
      {
        path: UNIFIED_ROUTES.JOURNAL,
        element: (
          <ProtectedRoute mockAuthenticated={true}>
            <JournalPage />
          </ProtectedRoute>
        )
      },
      {
        path: UNIFIED_ROUTES.VR,
        element: (
          <ProtectedRoute mockAuthenticated={true}>
            <VRPage />
          </ProtectedRoute>
        )
      },
      {
        path: UNIFIED_ROUTES.PREFERENCES,
        element: (
          <ProtectedRoute mockAuthenticated={true}>
            <PreferencesPage />
          </ProtectedRoute>
        )
      },
      {
        path: UNIFIED_ROUTES.GAMIFICATION,
        element: (
          <ProtectedRoute mockAuthenticated={true}>
            <GamificationPage />
          </ProtectedRoute>
        )
      },
      {
        path: UNIFIED_ROUTES.SOCIAL_COCON,
        element: (
          <ProtectedRoute mockAuthenticated={true}>
            <SocialCoconPage />
          </ProtectedRoute>
        )
      },

      // Fonctionnalités administrateur - CHEMINS UNIQUES
      {
        path: UNIFIED_ROUTES.TEAMS,
        element: (
          <ProtectedRoute mockUserMode="b2b_admin" mockAuthenticated={true} requiredRole="admin">
            <TeamsPage />
          </ProtectedRoute>
        )
      },
      {
        path: UNIFIED_ROUTES.REPORTS,
        element: (
          <ProtectedRoute mockUserMode="b2b_admin" mockAuthenticated={true} requiredRole="admin">
            <ReportsPage />
          </ProtectedRoute>
        )
      },
      {
        path: UNIFIED_ROUTES.EVENTS,
        element: (
          <ProtectedRoute mockUserMode="b2b_admin" mockAuthenticated={true} requiredRole="admin">
            <EventsPage />
          </ProtectedRoute>
        )
      },
      {
        path: UNIFIED_ROUTES.OPTIMISATION,
        element: (
          <ProtectedRoute mockUserMode="b2b_admin" mockAuthenticated={true} requiredRole="admin">
            <OptimisationPage />
          </ProtectedRoute>
        )
      },
      {
        path: UNIFIED_ROUTES.SETTINGS,
        element: (
          <ProtectedRoute mockAuthenticated={true}>
            <SettingsPage />
          </ProtectedRoute>
        )
      }
    ]
  }
]);

export default router;
