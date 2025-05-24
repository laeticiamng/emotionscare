
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';

// Pages publiques
import HomePage from '@/pages/HomePage';
import ChooseModePage from '@/pages/ChooseModePage';
import NotFoundPage from '@/pages/common/NotFoundPage';

// Auth pages B2C
import B2CLoginPage from '@/pages/b2c/auth/B2CLoginPage';
import B2CRegisterPage from '@/pages/b2c/auth/B2CRegisterPage';
import B2CResetPasswordPage from '@/pages/b2c/auth/B2CResetPasswordPage';
import B2COnboardingPage from '@/pages/b2c/onboarding/B2COnboardingPage';

// Auth pages B2B User
import B2BUserLoginPage from '@/pages/b2b/user/auth/B2BUserLoginPage';
import B2BUserRegisterPage from '@/pages/b2b/user/auth/B2BUserRegisterPage';

// Auth pages B2B Admin
import B2BAdminLoginPage from '@/pages/b2b/admin/auth/B2BAdminLoginPage';

// Selection page
import B2BSelectionPage from '@/pages/auth/B2BSelectionPage';

// Protected routes wrapper
import ProtectedRoute from '@/components/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';

// Dashboard pages
import B2CDashboardPage from '@/pages/b2c/dashboard/B2CDashboardPage';
import B2BUserDashboardPage from '@/pages/b2b/user/dashboard/B2BUserDashboardPage';
import B2BAdminDashboardPage from '@/pages/b2b/admin/dashboard/B2BAdminDashboardPage';
import B2BAdminAnalyticsPage from '@/pages/b2b/admin/analytics/B2BAdminAnalyticsPage';
import B2BAdminUsersPage from '@/pages/b2b/admin/users/B2BAdminUsersPage';

// Feature pages
import ScanPage from '@/pages/ScanPage';
import Coach from '@/pages/Coach';
import Music from '@/pages/Music';
import Journal from '@/pages/Journal';

// Common pages
import ProfilePage from '@/pages/common/ProfilePage';
import SettingsPage from '@/pages/common/SettingsPage';
import HelpPage from '@/pages/common/HelpPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <AuthProvider>
          <UserModeProvider>
            <Routes>
              {/* Pages publiques */}
              <Route path="/" element={<HomePage />} />
              <Route path="/choose-mode" element={<ChooseModePage />} />
              <Route path="/b2b/selection" element={<B2BSelectionPage />} />
              
              {/* Auth B2C */}
              <Route path="/b2c/login" element={<B2CLoginPage />} />
              <Route path="/b2c/register" element={<B2CRegisterPage />} />
              <Route path="/b2c/reset-password" element={<B2CResetPasswordPage />} />
              <Route path="/b2c/onboarding" element={<B2COnboardingPage />} />
              
              {/* Auth B2B User */}
              <Route path="/b2b/user/login" element={<B2BUserLoginPage />} />
              <Route path="/b2b/user/register" element={<B2BUserRegisterPage />} />
              
              {/* Auth B2B Admin */}
              <Route path="/b2b/admin/login" element={<B2BAdminLoginPage />} />
              
              {/* Routes protégées */}
              <Route path="/" element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                {/* Dashboards */}
                <Route path="b2c/dashboard" element={
                  <ProtectedRoute requiredRole="b2c">
                    <B2CDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="b2b/user/dashboard" element={
                  <ProtectedRoute requiredRole="b2b_user">
                    <B2BUserDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="b2b/admin/dashboard" element={
                  <ProtectedRoute requiredRole="b2b_admin">
                    <B2BAdminDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="b2b/admin/analytics" element={
                  <ProtectedRoute requiredRole="b2b_admin">
                    <B2BAdminAnalyticsPage />
                  </ProtectedRoute>
                } />
                <Route path="b2b/admin/users" element={
                  <ProtectedRoute requiredRole="b2b_admin">
                    <B2BAdminUsersPage />
                  </ProtectedRoute>
                } />
                
                {/* Features */}
                <Route path="scan" element={<ScanPage />} />
                <Route path="coach" element={<Coach />} />
                <Route path="music" element={<Music />} />
                <Route path="journal" element={<Journal />} />
                
                {/* Common */}
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="help" element={<HelpPage />} />
              </Route>
              
              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            
            <Toaster />
          </UserModeProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
