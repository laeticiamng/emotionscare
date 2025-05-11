
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { BrandingProvider } from '@/contexts/BrandingContext';
import { SoundscapeProvider } from '@/providers/SoundscapeProvider';
import { StorytellingProvider } from '@/providers/StorytellingProvider';
import { MusicProvider } from '@/contexts/MusicContext';
import BrandingManager from '@/components/branding/BrandingManager';

// Import pages
import HomePage from '@/pages/Home';
import Dashboard from '@/pages/DashboardPage';
import JournalPage from '@/pages/JournalPage';
import Login from '@/pages/LoginPage';
import Register from '@/pages/RegisterPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotFound from '@/pages/NotFound';
import ResetPassword from '@/pages/ResetPasswordPage';
import Profile from '@/pages/Profile';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import ScanPage from '@/pages/ScanPage';
import MusicPage from '@/pages/MusicPage';
import AccountSettingsPage from '@/pages/AccountSettings';
import TeamPage from '@/pages/TeamPage';
import CoachPage from '@/pages/CoachPage';
import CoachChatPage from '@/pages/CoachChatPage';
import DocsPage from '@/pages/Docs';
import BuddyPage from '@/pages/BuddyPage';
import VRPage from '@/pages/VRPage';
import UserSettingsPage from '@/pages/UserSettingsPage';
import SupportPage from '@/pages/Support';
import OnboardingModePage from '@/pages/OnboardingModePage';
import OnboardingPage from '@/pages/OnboardingPage';
import OnboardingExperiencePage from '@/pages/OnboardingExperiencePage';

import ProtectedLayoutWrapper from '@/components/ProtectedLayoutWrapper';

// Import styles
import './App.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserModeProvider>
          <MusicProvider>
            <BrandingProvider>
              <SoundscapeProvider>
                <StorytellingProvider>
                  <BrandingManager>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/forgot-password" element={<ResetPassword />} />
                      <Route path="/onboarding-mode" element={<OnboardingModePage />} />
                      <Route path="/onboarding" element={<OnboardingPage />} />
                      <Route path="/onboarding-experience" element={<OnboardingExperiencePage />} />
                      
                      {/* Protected Routes */}
                      <Route element={<ProtectedLayoutWrapper><ProtectedRoute /></ProtectedLayoutWrapper>}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/journal" element={<JournalPage />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/admin" element={<AdminDashboardPage />} />
                        <Route path="/scan" element={<ScanPage />} />
                        <Route path="/music" element={<MusicPage />} />
                        <Route path="/account" element={<AccountSettingsPage />} />
                        <Route path="/team" element={<TeamPage />} />
                        <Route path="/coach" element={<CoachPage />} />
                        <Route path="/coach-chat" element={<CoachChatPage />} />
                        <Route path="/docs" element={<DocsPage />} />
                        <Route path="/buddy" element={<BuddyPage />} />
                        <Route path="/vr" element={<VRPage />} />
                        <Route path="/settings" element={<UserSettingsPage />} />
                        <Route path="/support" element={<SupportPage />} />
                      </Route>
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrandingManager>
                </StorytellingProvider>
              </SoundscapeProvider>
            </BrandingProvider>
          </MusicProvider>
        </UserModeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
