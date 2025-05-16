
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';

// Landing and selection pages
import Home from '@/pages/Home';
import B2BSelectionPage from '@/pages/b2b/Selection';

// Common pages
import NotFound from '@/pages/common/NotFound';
import Unauthorized from '@/pages/common/Unauthorized';

// Layouts
import B2CLayout from '@/layouts/B2CLayout';
import B2BUserLayout from '@/layouts/B2BUserLayout';
import B2BAdminLayout from '@/layouts/B2BAdminLayout';

// B2C pages
import B2CLogin from '@/pages/b2c/Login';
import B2CRegister from '@/pages/b2c/Register';
import B2CDashboard from '@/pages/b2c/Dashboard';
import B2CJournal from '@/pages/b2c/Journal';
import B2CMusic from '@/pages/b2c/Music';
import B2CMusicCreate from '@/pages/b2c/MusicCreate';
import B2CMusicPreferences from '@/pages/b2c/MusicPreferences';
import B2CScan from '@/pages/b2c/Scan';
import B2CCoach from '@/pages/b2c/Coach';
import B2CCoachChat from '@/pages/b2c/CoachChat';
import B2CVR from '@/pages/b2c/VR';
import B2CGamification from '@/pages/b2c/Gamification';
import B2CPreferences from '@/pages/b2c/Preferences';
import B2CCocon from '@/pages/b2c/Cocon';
import B2CSettings from '@/pages/b2c/Settings';

// B2B User pages
import B2BUserLogin from '@/pages/b2b/user/Login';
import B2BUserRegister from '@/pages/b2b/user/Register';
import B2BUserDashboard from '@/pages/b2b/user/Dashboard';
import B2BUserJournal from '@/pages/b2b/user/Journal';
import B2BUserMusic from '@/pages/b2b/user/Music';
import B2BUserMusicCreate from '@/pages/b2b/user/MusicCreate';
import B2BUserMusicPreferences from '@/pages/b2b/user/MusicPreferences';
import B2BUserScan from '@/pages/b2b/user/Scan';
import B2BUserCoach from '@/pages/b2b/user/Coach';
import B2BUserCoachChat from '@/pages/b2b/user/CoachChat';
import B2BUserVR from '@/pages/b2b/user/VR';
import B2BUserGamification from '@/pages/b2b/user/Gamification';
import B2BUserPreferences from '@/pages/b2b/user/Preferences';
import B2BUserCocon from '@/pages/b2b/user/Cocon';
import B2BUserSettings from '@/pages/b2b/user/Settings';

// B2B Admin pages
import B2BAdminLogin from '@/pages/b2b/admin/Login';
import B2BAdminDashboard from '@/pages/b2b/admin/Dashboard';
import B2BAdminJournal from '@/pages/b2b/admin/Journal';
import B2BAdminScan from '@/pages/b2b/admin/Scan';
import B2BAdminMusic from '@/pages/b2b/admin/Music';
import B2BAdminTeams from '@/pages/b2b/admin/Teams';
import B2BAdminReports from '@/pages/b2b/admin/Reports';
import B2BAdminEvents from '@/pages/b2b/admin/Events';
import B2BAdminSettings from '@/pages/b2b/admin/Settings';
import B2BAdminCoachAnalytics from '@/pages/b2b/admin/CoachAnalytics';

// Create pages for settings sections
const NotImplemented = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <h1 className="text-2xl font-bold mb-4">Page en cours de développement</h1>
    <p className="text-muted-foreground">Cette fonctionnalité sera disponible prochainement.</p>
  </div>
);

export const router = createBrowserRouter([
  // Root route - Immersive Homepage
  {
    path: '/',
    element: <Home />,
  },
  
  // B2B selection page
  {
    path: '/b2b/selection',
    element: <B2BSelectionPage />,
  },
  
  // Error pages
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },

  // B2C Routes
  { 
    path: '/b2c/login',
    element: <B2CLogin />,
  },
  {
    path: '/b2c/register',
    element: <B2CRegister />,
  },
  {
    path: '/b2c',
    element: <ProtectedRoute requiredRole="user" redirectTo="/b2c/login"><B2CLayout /></ProtectedRoute>,
    children: [
      { 
        index: true,
        element: <Navigate to="/b2c/dashboard" replace />
      },
      { 
        path: 'dashboard', 
        element: <B2CDashboard /> 
      },
      { 
        path: 'journal', 
        element: <B2CJournal /> 
      },
      { 
        path: 'music', 
        element: <B2CMusic /> 
      },
      { 
        path: 'music/create', 
        element: <B2CMusicCreate /> 
      },
      { 
        path: 'music/preferences', 
        element: <B2CMusicPreferences /> 
      },
      { 
        path: 'scan', 
        element: <B2CScan /> 
      },
      { 
        path: 'coach', 
        element: <B2CCoach /> 
      },
      { 
        path: 'coach-chat', 
        element: <B2CCoachChat /> 
      },
      { 
        path: 'vr', 
        element: <B2CVR /> 
      },
      { 
        path: 'preferences', 
        element: <B2CPreferences /> 
      },
      { 
        path: 'gamification', 
        element: <B2CGamification /> 
      },
      { 
        path: 'cocon', 
        element: <B2CCocon /> 
      },
      {
        path: 'settings',
        element: <B2CSettings />
      },
      {
        path: 'settings/security',
        element: <NotImplemented />
      },
      {
        path: 'settings/notifications',
        element: <NotImplemented />
      },
      {
        path: 'settings/accessibility',
        element: <NotImplemented />
      },
      {
        path: 'settings/preferences',
        element: <NotImplemented />
      }
    ],
  },

  // B2B User Routes
  {
    path: '/b2b/user/login',
    element: <B2BUserLogin />,
  },
  {
    path: '/b2b/user/register',
    element: <B2BUserRegister />,
  },
  {
    path: '/b2b/user',
    element: <ProtectedRoute requiredRole="b2b_user" redirectTo="/b2b/user/login"><B2BUserLayout /></ProtectedRoute>,
    children: [
      { 
        index: true,
        element: <Navigate to="/b2b/user/dashboard" replace />
      },
      { 
        path: 'dashboard', 
        element: <B2BUserDashboard /> 
      },
      { 
        path: 'journal', 
        element: <B2BUserJournal /> 
      },
      { 
        path: 'music', 
        element: <B2BUserMusic /> 
      },
      { 
        path: 'music/create', 
        element: <B2BUserMusicCreate /> 
      },
      { 
        path: 'music/preferences', 
        element: <B2BUserMusicPreferences /> 
      },
      { 
        path: 'scan', 
        element: <B2BUserScan /> 
      },
      { 
        path: 'coach', 
        element: <B2BUserCoach /> 
      },
      { 
        path: 'coach-chat', 
        element: <B2BUserCoachChat /> 
      },
      { 
        path: 'vr', 
        element: <B2BUserVR /> 
      },
      { 
        path: 'preferences', 
        element: <B2BUserPreferences /> 
      },
      { 
        path: 'gamification', 
        element: <B2BUserGamification /> 
      },
      { 
        path: 'cocon', 
        element: <B2BUserCocon /> 
      },
      {
        path: 'settings',
        element: <B2BUserSettings />
      },
      {
        path: 'settings/security',
        element: <NotImplemented />
      },
      {
        path: 'settings/notifications',
        element: <NotImplemented />
      },
      {
        path: 'settings/accessibility',
        element: <NotImplemented />
      },
      {
        path: 'settings/preferences',
        element: <NotImplemented />
      }
    ],
  },

  // B2B Admin Routes
  {
    path: '/b2b/admin/login',
    element: <B2BAdminLogin />,
  },
  {
    path: '/b2b/admin',
    element: <ProtectedRoute requiredRole="b2b_admin" redirectTo="/b2b/admin/login"><B2BAdminLayout /></ProtectedRoute>,
    children: [
      { 
        index: true,
        element: <Navigate to="/b2b/admin/dashboard" replace />
      },
      { 
        path: 'dashboard', 
        element: <B2BAdminDashboard /> 
      },
      { 
        path: 'journal', 
        element: <B2BAdminJournal /> 
      },
      { 
        path: 'scan', 
        element: <B2BAdminScan /> 
      },
      { 
        path: 'music', 
        element: <B2BAdminMusic /> 
      },
      { 
        path: 'teams', 
        element: <B2BAdminTeams /> 
      },
      { 
        path: 'reports', 
        element: <B2BAdminReports /> 
      },
      { 
        path: 'events', 
        element: <B2BAdminEvents /> 
      },
      { 
        path: 'settings', 
        element: <B2BAdminSettings /> 
      },
      {
        path: 'coach-analytics',
        element: <B2BAdminCoachAnalytics />
      }
    ],
  },
  
  // 404 fallback
  { 
    path: '*', 
    element: <NotFound /> 
  },
]);
