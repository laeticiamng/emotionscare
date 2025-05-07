
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Shell from '@/components/Shell';
import Index from '@/pages/Index';
import Home from '@/pages/Home';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import NotFound from '@/pages/NotFound';
import DashboardPage from '@/pages/DashboardPage';
import ProtectedLayout from '@/components/ProtectedLayout';
import ScanPage from '@/pages/ScanPage';
import ScanDetailPage from '@/pages/ScanDetailPage';
import JournalPage from '@/pages/JournalPage';
import JournalEntryPage from '@/pages/JournalEntryPage';
import JournalNewPage from '@/pages/JournalNewPage';
import SettingsPage from '@/pages/SettingsPage';
import OnboardingPage from '@/pages/OnboardingPage';
import CoachPage from '@/pages/CoachPage';
import GamificationPage from '@/pages/GamificationPage';
import MyDataPage from '@/pages/MyDataPage';
import BuddyPage from '@/pages/BuddyPage';
import SocialCocoonPage from '@/pages/SocialCocoonPage';
import CompliancePage from '@/pages/CompliancePage';
import PersonalActivityPage from '@/pages/PersonalActivityPage';
import UserPreferences from '@/pages/UserPreferences';
import DesignSystemPage from '@/pages/DesignSystemPage';
import Pricing from '@/pages/Pricing';
import Contact from '@/pages/Contact';
import Docs from '@/pages/Docs';
import VRSessionsPage from '@/pages/VRSessionsPage';
import VRSessionPage from '@/pages/VRSessionPage';
import VRAnalyticsPage from '@/pages/VRAnalyticsPage';
import InvitePage from '@/pages/InvitePage';
import GroupListPage from '@/pages/GroupListPage';
import GroupsPage from '@/pages/GroupsPage';
import CommunityAdminPage from '@/pages/CommunityAdminPage';
import CommunityFeed from '@/pages/CommunityFeed';
import NotImplementedPage from '@/pages/NotImplementedPage';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MusicProvider } from '@/contexts/MusicContext';
import MusicWellbeingPage from '@/pages/MusicWellbeingPage';
import MusicDrawer from '@/components/music/MusicDrawer';
import MusicGenerationPage from '@/pages/MusicGenerationPage';

import AdminLoginPage from '@/pages/AdminLoginPage';

function App() {
  return (
    <ThemeProvider>
      <MusicProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Shell />}>
              <Route index element={<Index />} />
              <Route path="home" element={<Home />} />
              <Route path="design-system" element={<DesignSystemPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
              <Route path="onboarding" element={<OnboardingPage />} />
              <Route path="admin-login" element={<AdminLoginPage />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="contact" element={<Contact />} />
              <Route path="docs" element={<Docs />} />
              <Route path="invite" element={<InvitePage />} />
              
              <Route path="/" element={<ProtectedLayout />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="scan" element={<ScanPage />} />
                <Route path="scan/:id" element={<ScanDetailPage />} />
                <Route path="journal" element={<JournalPage />} />
                <Route path="journal/new" element={<JournalNewPage />} />
                <Route path="journal/:id" element={<JournalEntryPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="coach" element={<CoachPage />} />
                <Route path="gamification" element={<GamificationPage />} />
                <Route path="mydata" element={<MyDataPage />} />
                <Route path="buddy" element={<BuddyPage />} />
                <Route path="social-cocoon" element={<SocialCocoonPage />} />
                <Route path="compliance" element={<CompliancePage />} />
                <Route path="personal-activity" element={<PersonalActivityPage />} />
                <Route path="preferences" element={<UserPreferences />} />
                <Route path="vr" element={<VRSessionsPage />} />
                <Route path="vr/:id" element={<VRSessionPage />} />
                <Route path="vr/analytics" element={<VRAnalyticsPage />} />
                <Route path="music" element={<MusicWellbeingPage />} />
                <Route path="music/create" element={<MusicGenerationPage />} />
                <Route path="groups" element={<GroupListPage />} />
                <Route path="groups/:id" element={<GroupsPage />} />
                <Route path="community-admin" element={<CommunityAdminPage />} />
                <Route path="community" element={<CommunityFeed />} />
                <Route path="not-implemented" element={<NotImplementedPage />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <MusicDrawer />
        </BrowserRouter>
      </MusicProvider>
    </ThemeProvider>
  );
}

export default App;
