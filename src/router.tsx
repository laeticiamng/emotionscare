
import { RouteObject, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/common/Login';
import RegisterPage from './pages/common/Register';
import B2CLogin from './pages/b2c/Login';
import B2CRegister from './pages/b2c/Register';
import B2BSelectionPage from './pages/B2BSelectionPage';
import B2BUserLogin from './pages/b2b/user/Login';
import B2BAdminLogin from './pages/b2b/admin/Login';
import B2BUserRegister from './pages/b2b/user/Register';
import B2CLayout from './layouts/B2CLayout';
import B2BUserLayout from './layouts/B2BUserLayout';
import B2BAdminLayout from './layouts/B2BAdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import B2CDashboardPage from './pages/b2c/DashboardPage';
import B2BUserDashboardPage from './pages/b2b/user/Dashboard';
import B2BAdminDashboardPage from './pages/b2b/admin/Dashboard';
import B2CGamificationPage from './pages/b2c/Gamification';
import B2BUserGamificationPage from './pages/b2b/user/Gamification';
import RetentionDashboardPage from './pages/RetentionDashboardPage';
import B2CJournalPage from './pages/b2c/Journal';
import B2CScanPage from './pages/b2c/Scan';
import B2CMusicPage from './pages/b2c/Music';
import B2CCoachPage from './pages/b2c/Coach';
import B2CCoachChatPage from './pages/b2c/CoachChat';
import B2CVRPage from './pages/b2c/VR';
import B2CPreferencesPage from './pages/b2c/Preferences';
import B2CSettingsPage from './pages/b2c/Settings';
import B2CCoconPage from './pages/b2c/Cocon';
import B2BUserJournalPage from './pages/b2b/user/Journal';
import B2BUserScanPage from './pages/b2b/user/Scan';
import B2BUserMusicPage from './pages/b2b/user/Music';
import B2BUserCoachPage from './pages/b2b/user/Coach';
import B2BUserVRPage from './pages/b2b/user/VR';
import B2BUserPreferencesPage from './pages/b2b/user/Preferences';
import B2BUserSettingsPage from './pages/b2b/user/Settings';
import B2BUserCoconPage from './pages/b2b/user/Cocon';
import B2BAdminJournalPage from './pages/b2b/admin/Journal';
import B2BAdminScanPage from './pages/b2b/admin/Scan';
import B2BAdminMusicPage from './pages/b2b/admin/Music';
import B2BAdminTeamsPage from './pages/b2b/admin/Teams';
import B2BAdminReportsPage from './pages/b2b/admin/Reports';
import B2BAdminEventsPage from './pages/b2b/admin/Events';
import B2BAdminSettingsPage from './pages/b2b/admin/Settings';
import B2BAdminInnovationPage from './pages/b2b/admin/Innovation';
import SecurityDashboard from './pages/b2b/admin/Security';
import TimelinePage from './pages/TimelinePage';
import WorldPage from './pages/WorldPage';
import SanctuaryPage from './pages/SanctuaryPage';
import ImmersiveHome from './pages/ImmersiveHome';
import Home from './pages/Home';
import UnifiedSettingsPage from './pages/UnifiedSettingsPage';
import SupportPage from './pages/Support';
import PredictiveDashboardPage from './pages/PredictiveDashboardPage';

// Define the application routes without creating a router instance
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <ImmersiveHome />
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: 'support',
    element: <SupportPage />
  },
  {
    path: 'settings',
    element: (
      <ProtectedRoute>
        <UnifiedSettingsPage />
      </ProtectedRoute>
    )
  },
  // B2C Auth Routes
  {
    path: 'b2c/login',
    element: <B2CLogin />
  },
  {
    path: 'b2c/register',
    element: <B2CRegister />
  },
  // B2B Selection Route
  {
    path: 'b2b/selection',
    element: <B2BSelectionPage />
  },
  // Make sure the route with special character is also supported
  {
    path: 'b2b/sélection',
    element: <B2BSelectionPage />
  },
  // B2B Auth Routes
  {
    path: 'b2b/user/login',
    element: <B2BUserLogin />
  },
  {
    path: 'b2b/user/register',
    element: <B2BUserRegister />
  },
  {
    path: 'b2b/admin/login',
    element: <B2BAdminLogin />
  },
  // B2C Protected Routes
  {
    path: 'b2c',
    element: (
      <ProtectedRoute requiredRole="b2c">
        <B2CLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <B2CDashboardPage />
      },
      {
        path: 'journal',
        element: <B2CJournalPage />
      },
      {
        path: 'scan',
        element: <B2CScanPage />
      },
      {
        path: 'music',
        element: <B2CMusicPage />
      },
      {
        path: 'coach',
        element: <B2CCoachPage />
      },
      {
        path: 'coach-chat',
        element: <B2CCoachChatPage />
      },
      {
        path: 'vr',
        element: <B2CVRPage />
      },
      {
        path: 'preferences',
        element: <B2CPreferencesPage />
      },
      {
        path: 'settings',
        element: <B2CSettingsPage />
      },
      {
        path: 'cocon',
        element: <B2CCoconPage />
      },
      {
        path: 'timeline',
        element: <TimelinePage />
      },
      {
        path: 'world',
        element: <WorldPage />
      },
      {
        path: 'sanctuaire',
        element: <SanctuaryPage />
      },
      {
        path: 'retention',
        element: <RetentionDashboardPage />
      },
      {
        path: 'gamification',
        element: <B2CGamificationPage />
      },
      {
        path: 'predictive',
        element: <PredictiveDashboardPage />
      }
    ]
  },
  // B2B User Protected Routes
  {
    path: 'b2b/user',
    element: (
      <ProtectedRoute requiredRole="b2b_user">
        <B2BUserLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <B2BUserDashboardPage />
      },
      {
        path: 'journal',
        element: <B2BUserJournalPage />
      },
      {
        path: 'scan',
        element: <B2BUserScanPage />
      },
      {
        path: 'music',
        element: <B2BUserMusicPage />
      },
      {
        path: 'coach',
        element: <B2BUserCoachPage />
      },
      {
        path: 'vr',
        element: <B2BUserVRPage />
      },
      {
        path: 'preferences',
        element: <B2BUserPreferencesPage />
      },
      {
        path: 'settings',
        element: <B2BUserSettingsPage />
      },
      {
        path: 'cocon',
        element: <B2BUserCoconPage />
      },
      {
        path: 'timeline',
        element: <TimelinePage />
      },
      {
        path: 'world',
        element: <WorldPage />
      },
      {
        path: 'sanctuaire',
        element: <SanctuaryPage />
      },
      {
        path: 'retention',
        element: <RetentionDashboardPage />
      },
      {
        path: 'gamification',
        element: <B2BUserGamificationPage />
      },
      {
        path: 'predictive',
        element: <PredictiveDashboardPage />
      }
    ]
  },
  // B2B Admin Protected Routes
  {
    path: 'b2b/admin',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <B2BAdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <B2BAdminDashboardPage />
      },
      {
        path: 'journal',
        element: <B2BAdminJournalPage />
      },
      {
        path: 'scan',
        element: <B2BAdminScanPage />
      },
      {
        path: 'music',
        element: <B2BAdminMusicPage />
      },
      {
        path: 'teams',
        element: <B2BAdminTeamsPage />
      },
      {
        path: 'reports',
        element: <B2BAdminReportsPage />
      },
      {
        path: 'events',
        element: <B2BAdminEventsPage />
      },
      {
        path: 'security',
        element: <SecurityDashboard />
      },
      {
        path: 'innovation',
        element: <B2BAdminInnovationPage />
      },
      {
        path: 'retention',
        element: <RetentionDashboardPage />
      },
      {
        path: 'settings',
        element: <B2BAdminSettingsPage />
      },
      {
        path: 'predictive',
        element: <PredictiveDashboardPage />
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
];

export default routes;
