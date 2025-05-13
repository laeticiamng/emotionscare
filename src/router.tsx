
// 📁 src/router.tsx
// ROUTAGE COMPLET DE LA PLATEFORME EMOTIONSCARE – LOVABLE.DEV

import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import B2CLayout from '@/layouts/B2CLayout';
import B2BUserLayout from '@/layouts/B2BUserLayout';
import B2BAdminLayout from '@/layouts/B2BAdminLayout';

import B2CHome from '@/pages/b2c/Home';
import B2CDashboard from '@/pages/b2c/Dashboard';
import B2CJournal from '@/pages/b2c/Journal';
import B2CMusic from '@/pages/b2c/Music';
import B2CScan from '@/pages/b2c/Scan';
import B2CCoach from '@/pages/b2c/Coach';
import B2CVR from '@/pages/b2c/VR';
import B2CPreferences from '@/pages/b2c/Preferences';
import B2CGamification from '@/pages/b2c/Gamification';

import B2BUserDashboard from '@/pages/b2b/user/Dashboard';
import B2BUserJournal from '@/pages/b2b/user/Journal';
import B2BUserMusic from '@/pages/b2b/user/Music';
import B2BUserScan from '@/pages/b2b/user/Scan';
import B2BUserCoach from '@/pages/b2b/user/Coach';
import B2BUserVR from '@/pages/b2b/user/VR';
import B2BUserPreferences from '@/pages/b2b/user/Preferences';
import B2BUserGamification from '@/pages/b2b/user/Gamification';

import B2BAdminDashboard from '@/pages/b2b/admin/Dashboard';
import B2BAdminTeams from '@/pages/b2b/admin/Teams';
import B2BAdminReports from '@/pages/b2b/admin/Reports';
import B2BAdminEvents from '@/pages/b2b/admin/Events';
import B2BAdminSettings from '@/pages/b2b/admin/Settings';

import Login from '@/pages/common/Login';
import Register from '@/pages/common/Register';
import Selection from '@/pages/b2b/Selection';
import NotFound from '@/pages/common/NotFound';
import Unauthorized from '@/pages/common/Unauthorized';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Selection />, // Choix Particulier ou Entreprise
  },
  {
    path: '/b2c',
    element: <ProtectedRoute role="b2c"><B2CLayout /></ProtectedRoute>,
    children: [
      { path: 'login', element: <Login role="b2c" /> },
      { path: 'register', element: <Register role="b2c" /> },
      { path: 'dashboard', element: <B2CDashboard /> },
      { path: 'journal', element: <B2CJournal /> },
      { path: 'music', element: <B2CMusic /> },
      { path: 'scan', element: <B2CScan /> },
      { path: 'coach', element: <B2CCoach /> },
      { path: 'vr', element: <B2CVR /> },
      { path: 'preferences', element: <B2CPreferences /> },
      { path: 'gamification', element: <B2CGamification /> },
    ],
  },
  {
    path: '/b2b/user',
    element: <ProtectedRoute role="b2b_user"><B2BUserLayout /></ProtectedRoute>,
    children: [
      { path: 'login', element: <Login role="b2b_user" /> },
      { path: 'register', element: <Register role="b2b_user" /> },
      { path: 'dashboard', element: <B2BUserDashboard /> },
      { path: 'journal', element: <B2BUserJournal /> },
      { path: 'music', element: <B2BUserMusic /> },
      { path: 'scan', element: <B2BUserScan /> },
      { path: 'coach', element: <B2BUserCoach /> },
      { path: 'vr', element: <B2BUserVR /> },
      { path: 'preferences', element: <B2BUserPreferences /> },
      { path: 'gamification', element: <B2BUserGamification /> },
    ],
  },
  {
    path: '/b2b/admin',
    element: <ProtectedRoute role="b2b_admin"><B2BAdminLayout /></ProtectedRoute>,
    children: [
      { path: 'login', element: <Login role="b2b_admin" /> },
      { path: 'dashboard', element: <B2BAdminDashboard /> },
      { path: 'teams', element: <B2BAdminTeams /> },
      { path: 'reports', element: <B2BAdminReports /> },
      { path: 'events', element: <B2BAdminEvents /> },
      { path: 'settings', element: <B2BAdminSettings /> },
    ],
  },
  { path: '/unauthorized', element: <Unauthorized /> },
  { path: '*', element: <NotFound /> },
]);
