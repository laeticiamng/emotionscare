
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import Dashboard from '@/pages/Dashboard';
import JournalPage from '@/pages/JournalPage';
import MusicPage from '@/pages/MusicPage';
import ScanPage from '@/pages/ScanPage';
import VRPage from '@/pages/VRPage';
import AudioPage from '@/pages/AudioPage';
import SettingsPage from '@/pages/SettingsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import LoginPage from '@/pages/common/Login';
import RegisterPage from '@/pages/common/Register';
import OnboardingPage from '@/pages/common/Onboarding';

// Coach related pages
import CoachPage from '@/pages/b2c/Coach';
import CoachChatPage from '@/pages/b2c/CoachChat';
import B2BUserCoachPage from '@/pages/b2b/user/Coach';
import B2BUserCoachChatPage from '@/pages/b2b/user/CoachChat';
import B2BAdminCoachAnalyticsPage from '@/pages/b2b/admin/CoachAnalytics';

// Home page
import Home from '@/pages/Home';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* B2C Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/journal" element={<JournalPage />} />
      <Route path="/music" element={<MusicPage />} />
      <Route path="/scan" element={<ScanPage />} />
      <Route path="/vr" element={<VRPage />} />
      <Route path="/audio" element={<AudioPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      
      {/* Coach routes */}
      <Route path="/coach" element={<CoachPage />} />
      <Route path="/coach-chat" element={<CoachChatPage />} />

      {/* B2B User Routes */}
      <Route path="/b2b/user/dashboard" element={<Dashboard />} />
      <Route path="/b2b/user/coach" element={<B2BUserCoachPage />} />
      <Route path="/b2b/user/coach-chat" element={<B2BUserCoachChatPage />} />

      {/* B2B Admin Routes */}
      <Route path="/b2b/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/b2b/admin/coach-analytics" element={<B2BAdminCoachAnalyticsPage />} />

      {/* Catch all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
