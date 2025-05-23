
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VRPage from './pages/VRPage';
import ScanPage from './pages/ScanPage';
import SocialCocoon from './pages/SocialCocoon';
import Social from './pages/Social';
import DashboardRedirect from './pages/DashboardRedirect';
import ProtectedRouteWithMode from './components/ProtectedRouteWithMode';
import ChooseModePage from './pages/ChooseModePage';

// Pages B2C
import B2CDashboard from './pages/dashboards/B2CDashboard';
import B2CLogin from './pages/b2c/Login';
import B2CRegister from './pages/b2c/Register';
import B2CResetPassword from './pages/b2c/ResetPassword';
import B2COnboarding from './pages/b2c/Onboarding';

// Pages B2B User
import B2BUserDashboard from './pages/dashboards/B2BUserDashboard';
import B2BUserLogin from './pages/b2b/user/Login';
import B2BUserRegister from './pages/b2b/user/Register';

// Pages B2B Admin
import B2BAdminDashboard from './pages/dashboards/B2BAdminDashboard';
import B2BAdminLogin from './pages/b2b/admin/Login';

// Page de sélection B2B
import B2BSelection from './pages/b2b/Selection';

// Page d'erreur 404
import NotFoundPage from './pages/NotFoundPage';

const routes = [
  // Page d'accueil principale
  { path: '/', element: <HomePage /> },
  
  // Redirection dashboard
  { path: '/dashboard', element: <DashboardRedirect /> },
  
  // Choix du mode utilisateur
  { path: '/choose-mode', element: <ChooseModePage /> },
  
  // Routes B2C
  { path: '/b2c/login', element: <B2CLogin /> },
  { path: '/b2c/register', element: <B2CRegister /> },
  { path: '/b2c/reset-password', element: <B2CResetPassword /> },
  { 
    path: '/b2c/dashboard', 
    element: <ProtectedRouteWithMode requiredMode="b2c" redirectTo="/choose-mode"><B2CDashboard /></ProtectedRouteWithMode> 
  },
  { 
    path: '/b2c/onboarding', 
    element: <ProtectedRouteWithMode requiredMode="b2c" redirectTo="/choose-mode"><B2COnboarding /></ProtectedRouteWithMode> 
  },
  { path: '/b2c/scan', element: <ScanPage /> },
  { path: '/b2c/vr', element: <VRPage /> },
  { path: '/b2c/social', element: <Social /> },
  
  // Routes B2B User
  { path: '/b2b/user/login', element: <B2BUserLogin /> },
  { path: '/b2b/user/register', element: <B2BUserRegister /> },
  { 
    path: '/b2b/user/dashboard', 
    element: <ProtectedRouteWithMode requiredMode="b2b_user" redirectTo="/choose-mode"><B2BUserDashboard /></ProtectedRouteWithMode> 
  },
  { path: '/b2b/user/scan', element: <ScanPage /> },
  { path: '/b2b/user/vr', element: <VRPage /> },
  { path: '/b2b/user/social', element: <Social /> },
  
  // Routes B2B Admin
  { path: '/b2b/admin/login', element: <B2BAdminLogin /> },
  { 
    path: '/b2b/admin/dashboard', 
    element: <ProtectedRouteWithMode requiredMode="b2b_admin" redirectTo="/choose-mode"><B2BAdminDashboard /></ProtectedRouteWithMode> 
  },
  { path: '/b2b/admin/social', element: <Social /> },
  
  // Page de sélection B2B
  { path: '/b2b/selection', element: <B2BSelection /> },
  
  // Accès direct aux fonctionnalités principales
  { path: '/scan', element: <ScanPage /> },
  { path: '/vr', element: <VRPage /> },
  { path: '/social', element: <Social /> },
  { path: '/social-cocoon', element: <SocialCocoon /> },
  
  // Page 404 pour les routes non trouvées
  { path: '/404', element: <NotFoundPage /> },
  { path: '*', element: <Navigate to="/404" replace /> }
];

export default routes;
