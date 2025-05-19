import React from 'react';
import {
  createBrowserRouter,
} from "react-router-dom";
import HomePage from './pages/HomePage';
import B2BSelectionPage from './pages/b2b/Selection';
import B2BAdminDashboard from './pages/b2b/admin/Dashboard';
import B2BUserDashboard from './pages/b2b/user/Dashboard';
import B2CPage from './pages/b2c/Home';
import B2CLoginPage from './pages/b2c/Login';
import B2CRegisterPage from './pages/b2c/Register';
import B2CForgotPasswordPage from './pages/b2c/ForgotPassword';
import B2CResetPasswordPage from './pages/b2c/ResetPassword';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import UserSettingsPage from './pages/UserSettingsPage';
import AdminUsersPage from './pages/b2b/admin/Users';
import AdminTeamsPage from './pages/b2b/admin/Teams';
import AdminSecurityPage from './pages/b2b/admin/Security';
import AdminAnalyticsPage from './pages/b2b/admin/Analytics';
import AdminSettingsPage from './pages/b2b/admin/Settings';
import B2BUserSettingsPage from './pages/b2b/user/Settings';
import B2BUserPreferencesPage from './pages/b2b/user/Preferences';
import PredictivePage from './pages/PredictivePage';
import Unauthorized from './pages/common/Unauthorized';
import UnifiedSettingsPage from './pages/UnifiedSettingsPage';
import PrivacySettingsPage from './pages/PrivacySettingsPage';
import GdprCompliancePage from './pages/b2b/admin/GdprCompliancePage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/b2b/selection",
    element: <B2BSelectionPage />,
  },
  {
    path: "/b2b/admin/dashboard",
    element: <B2BAdminDashboard />,
  },
  {
    path: "/b2b/user/dashboard",
    element: <B2BUserDashboard />,
  },
  {
    path: "/b2c",
    element: <B2CPage />,
  },
  {
    path: "/b2c/login",
    element: <B2CLoginPage />,
  },
  {
    path: "/b2c/register",
    element: <B2CRegisterPage />,
  },
  {
    path: "/b2c/forgot-password",
    element: <B2CForgotPasswordPage />,
  },
  {
    path: "/b2c/reset-password",
    element: <B2CResetPasswordPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
  {
    path: "/user-settings",
    element: <UserSettingsPage />,
  },
  {
    path: "/b2b/admin/users",
    element: <AdminUsersPage />,
  },
  {
    path: "/b2b/admin/teams",
    element: <AdminTeamsPage />,
  },
  {
    path: "/b2b/admin/security",
    element: <AdminSecurityPage />,
  },
  {
    path: "/b2b/admin/analytics",
    element: <AdminAnalyticsPage />,
  },
  {
    path: "/b2b/admin/settings",
    element: <AdminSettingsPage />,
  },
  {
    path: "/b2b/user/settings",
    element: <B2BUserSettingsPage />,
  },
  {
    path: "/b2b/user/preferences",
    element: <B2BUserPreferencesPage />,
  },
  {
    path: "/predictive",
    element: <PredictivePage />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/unified-settings",
    element: <UnifiedSettingsPage />,
  },
  {
    path: '/preferences/privacy',
    element: <PrivacySettingsPage />,
  },
  {
    path: '/b2b/admin/gdpr-compliance',
    element: <GdprCompliancePage />,
  },
]);

export default router;
