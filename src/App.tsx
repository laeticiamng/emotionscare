import React from 'react';
import {
  BrowserRouter as RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

import HomePage from '@/pages/HomePage';
import B2BSelectionPage from '@/pages/B2BSelectionPage';
import B2BAdminDashboard from '@/pages/b2b/admin/Dashboard';
import B2BUserDashboard from '@/pages/b2b/user/Dashboard';
import B2BAdminUsersPage from '@/pages/b2b/admin/Users';
import B2BAdminTeamsPage from '@/pages/b2b/admin/Teams';
import B2BAdminSecurityPage from '@/pages/b2b/admin/Security';
import B2BAdminSettingsPage from '@/pages/b2b/admin/Settings';
import B2BUserSettingsPage from '@/pages/b2b/user/Settings';
import B2BUserPreferencesPage from '@/pages/b2b/user/Preferences';
import UserSettingsPage from '@/pages/UserSettingsPage';
import ProfilePage from '@/pages/ProfilePage';
import PredictivePage from '@/pages/PredictivePage';
import UnifiedSettingsPage from '@/pages/UnifiedSettingsPage';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { PreferencesProvider } from '@/contexts/PreferencesContext';
import { LayoutProvider } from '@/contexts/LayoutContext';
import { CoachProvider } from '@/contexts/CoachContext';
import { ChatProvider } from '@/contexts/ChatContext';

import Unauthorized from '@/pages/common/Unauthorized';
import PrivacyConsentBanner from './components/privacy/PrivacyConsentBanner';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <ThemeProvider>
          <AuthProvider>
            <UserModeProvider>
              <PreferencesProvider>
                <LayoutProvider>
                  <CoachProvider>
                    <ChatProvider>
                      <RouterProvider router={router} />
                      <PrivacyConsentBanner />
                      <Toaster />
                    </ChatProvider>
                  </CoachProvider>
                </LayoutProvider>
              </PreferencesProvider>
            </UserModeProvider>
          </AuthProvider>
        </ThemeProvider>
      </div>
    </QueryClientProvider>
  );
}

export default App;
