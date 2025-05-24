
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Toaster } from 'sonner';

// Pages publiques
import LandingPage from '@/pages/LandingPage';
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

// Protected pages
import ProtectedLayout from '@/components/ProtectedLayout';
import Shell from '@/Shell';

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
              <Route path="/" element={<LandingPage />} />
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
              <Route path="/" element={<ProtectedLayout />}>
                <Route path="" element={<Shell />}>
                  {/* Dashboards */}
                  <Route path="b2c/dashboard" element={<B2CDashboardPage />} />
                  <Route path="b2b/user/dashboard" element={<B2BUserDashboardPage />} />
                  <Route path="b2b/admin/dashboard" element={<B2BAdminDashboardPage />} />
                  <Route path="b2b/admin/analytics" element={<B2BAdminAnalyticsPage />} />
                  <Route path="b2b/admin/users" element={<B2BAdminUsersPage />} />
                  
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
              </Route>
              
              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            
            <Toaster position="top-right" />
          </UserModeProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
