
import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
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

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/b2b/selection" element={<B2BSelectionPage />} />
      <Route path="/b2b/admin/dashboard" element={<B2BAdminDashboard />} />
      <Route path="/b2b/user/dashboard" element={<B2BUserDashboard />} />
      <Route path="/b2c" element={<B2CPage />} />
      <Route path="/b2c/login" element={<B2CLoginPage />} />
      <Route path="/b2c/register" element={<B2CRegisterPage />} />
      <Route path="/b2c/forgot-password" element={<B2CForgotPasswordPage />} />
      <Route path="/b2c/reset-password" element={<B2CResetPasswordPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/user-settings" element={<UserSettingsPage />} />
      <Route path="/b2b/admin/users" element={<AdminUsersPage />} />
      <Route path="/b2b/admin/teams" element={<AdminTeamsPage />} />
      <Route path="/b2b/admin/security" element={<AdminSecurityPage />} />
      <Route path="/b2b/admin/analytics" element={<AdminAnalyticsPage />} />
      <Route path="/b2b/admin/settings" element={<AdminSettingsPage />} />
      <Route path="/b2b/user/settings" element={<B2BUserSettingsPage />} />
      <Route path="/b2b/user/preferences" element={<B2BUserPreferencesPage />} />
      <Route path="/predictive" element={<PredictivePage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/unified-settings" element={<UnifiedSettingsPage />} />
      <Route path="/preferences/privacy" element={<PrivacySettingsPage />} />
      <Route path="/b2b/admin/gdpr-compliance" element={<GdprCompliancePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
